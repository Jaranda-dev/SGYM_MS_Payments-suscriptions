import Membership from '#models/membership'
import Payment from '#models/payment'
import PaymentRequest from '#models/payment_request'
import Profile from '#models/profile'
import Subscription from '#models/subscription'
import User from '#models/user'
import env from '#start/env'
import { DateTime } from 'luxon'
import Stripe from 'stripe'


const stripeSecretKey = env.get('STRIPE_SECRET_KEY')
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-07-30.basil',
})


export default class StripeService {

  public static async webhooks() {

    return stripe;

  }

  public static async SetupIntent( payment_method_types: string[], customerId: string , user_id: string) {
    return await stripe.setupIntents.create({
      payment_method_types,
      customer: customerId,
      metadata: { user_id },
    })
  }

  public static async createCustomer(email: string, name: string, id: number) {
    return await stripe.customers.create({
      email,
      name,
      metadata: { user_id: id.toString() },
    })
  }

public static async retrieveCustomerByUserId(user_id: number) {
  try{
  
  const customers = await stripe.customers.list({ limit: 100 })
  

 
  let customer = customers.data.find(
    (customer) => customer.metadata?.user_id === user_id.toString()
  )

  // Si no existe, lo creamos
  if (!customer) {
       const user = await User.findBy('id', user_id)
    if (!user) {
      throw new Error('Usuario no encontrado.')
    }


  
    const userProfile = await Profile.findBy('user_id', user_id)
 if (!userProfile) {
      throw new Error('Perfil de usuario no encontrado.')
    }

    customer = await stripe.customers.create({
      email: user.email,
      name: userProfile.fullName,
      metadata: {
        user_id: user_id.toString(),
      },
    })
  }

  return customer
  }
  catch (error) {
    console.error('Error retrieving customer by user ID:', error)
    throw new Error('Error retrieving customer.')
  }
}


  public static async addPaymentMethod(customerId: string, paymentMethodId: string) {
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId })

    await stripe.customers.update(customerId)
  }

  public static async createSubscription(customerId: string, priceId: string) {
    return await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    })
  }

  public static async cancelSubscription(subscriptionId: string) {
    return await stripe.subscriptions.deleteDiscount(subscriptionId)
  }

  public static async retrieveInvoice(invoiceId: string) {
    return await stripe.invoices.retrieve(invoiceId)
  }

  public static async createCheckoutSession(customerId: string, priceId: string, successUrl: string, cancelUrl: string) {
    return await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
    })
  }

  public static async retrieveMethod(paymentMethodId: string) {
    return await stripe.paymentMethods.retrieve(paymentMethodId)
  }

  public static async createProduct(name: string) {
  return await stripe.products.create({
    name
  })
}

public static async updateProduct(productId: string, name: string) {
  return await stripe.products.update(productId, { name })
}

public static async createPrice(
  productId: string,
  unitAmount: number, 
  intervalCount: number 
) {
  return await stripe.prices.create({
    product: productId,
    unit_amount: unitAmount * 100,
    currency: 'mxn',
    recurring: { 
      interval: 'day', 
      interval_count: intervalCount 
    },
  })
}



public static async createCoupon(
  name: string,
  percentOff: number,
) {
  return await stripe.coupons.create({
    name,
    percent_off: percentOff,
    duration: 'once', 
    currency: 'mxn'
  })
}

public static async deleteCoupon(couponId: string) {
  return await stripe.coupons.del(couponId)
}
public static async updateCoupon(couponId: string, data: { name?: string; percent_off?: number }) {
  return await stripe.coupons.update(couponId, data)
}

public static async retrieveProduct(productId: string) {
  return await stripe.products.retrieve(productId)
}

public static async retrieveCoupon(couponId: string) {
  return await stripe.coupons.retrieve(couponId)
}

public static async retrieveSubscriptionByCustomerId(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({ customer: customerId })
  return subscriptions.data[0] || null
}

public static async updateSubscriptionPrice(
  stripeSubscription: Stripe.Subscription,
  membership: Membership
) {
  await stripe.subscriptions.update(stripeSubscription.id, {
    items: [{
      id: stripeSubscription.items.data[0].id,
      price: membership.stripePriceId,
    }],
    billing_cycle_anchor: (stripeSubscription as any).current_period_end,
    proration_behavior: 'none'
  })
}

public static async deleteSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId)
}

  public static async handleWebhook(rawBody: Buffer | string, signature: string): Promise<{ success: boolean }> {
    
    const stripewebhooksecret = env.get('STRIPE_WEBHOOK_SECRET')
   if (!stripewebhooksecret) {
     throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment variables')
   }

    try {
      const stripe = StripeService.webhooks()
      const event = (await stripe).webhooks.constructEvent(
        rawBody,
        signature,
        stripewebhooksecret
      )

      switch (event.type) {
        
        case 'customer.subscription.created':  {
            const subscription = event.data.object as Stripe.Subscription

  // Acceder al primer item de la suscripción
  const firstItem = subscription.items?.data?.[0]
  if (firstItem && firstItem.price) {
    const priceId = firstItem.price.id
    console.log('ID del precio:', priceId)
    // Puedes usar priceId aquí
  }
          console.log('📦 Nueva suscripción creada:', subscription.id)
          console.log('✅ Pago exitoso para suscripción:', subscription.id)

          // Buscar la suscripción local
          const localSubscription = await Subscription.findBy('stripeSubscriptionId', subscription.id)
          if (localSubscription) {
            // Registrar el PaymentRequest
            const paymentRequest = await PaymentRequest.create({
              userId: localSubscription.userId,
              paymentMethodId: 1, // Cambia esto si tienes el método real
              externalReference: invoice.id,
              amount: invoice.amount_paid / 100,
              currency: invoice.currency,
              status: 'success',
              description: invoice.description || 'Pago de suscripción',
              metadata: JSON.stringify(invoice.metadata),
              createdAt: DateTime.now(),
              updatedAt: DateTime.now(),
            })

            // Registrar el pago
            await Payment.create({
              paymentRequestId: paymentRequest.id,
              subscriptionId: localSubscription.id,
              amount: invoice.amount_paid / 100,
              paymentDate: DateTime.now(),
              concept: invoice.description || 'Pago de suscripción',
              status: 'success',
              createdAt: DateTime.now(),
            })
          } else {
            console.warn('No se encontró la suscripción local para el pago:', subscriptionId)
          }
          break
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription
          console.log('🔵 Suscripción actualizada:', subscription.id)
          const localSubscription = await Subscription.findBy('stripeSubscriptionId', subscription.id)
          if (localSubscription) {
            localSubscription.status = subscription.status as 'active' | 'expired' | 'canceled'
            await localSubscription.save()
          }
          break
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription
          console.log('❌ Suscripción cancelada:', subscription.id)
          const localSubscription = await Subscription.findBy('stripeSubscriptionId', subscription.id)
          if (localSubscription) {
            localSubscription.status = 'canceled'
            await localSubscription.save()
          }
          break
        }

        case 'customer.subscription.paused': {
          const subscription = event.data.object as Stripe.Subscription
          console.log('⏸️ Suscripción pausada:', subscription.id)
          // Actualiza estado local si lo necesitas
          break
        }

        case 'customer.subscription.resumed': {
          const subscription = event.data.object as Stripe.Subscription
          console.log('▶️ Suscripción reanudada:', subscription.id)
          // Actualiza estado local si lo necesitas
          break
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as Stripe.Invoice
          const subscriptionId = invoice.subscription as string
          console.log('✅ Pago exitoso para suscripción:', subscriptionId)

          // Buscar la suscripción local
          const localSubscription = await Subscription.findBy('stripeSubscriptionId', subscriptionId)
          if (localSubscription) {
            // Registrar el PaymentRequest
            const paymentRequest = await PaymentRequest.create({
              userId: localSubscription.userId,
              paymentMethodId: 1, // Cambia esto si tienes el método real
              externalReference: invoice.id,
              amount: invoice.amount_paid / 100,
              currency: invoice.currency,
              status: 'success',
              description: invoice.description || 'Pago de suscripción',
              metadata: JSON.stringify(invoice.metadata),
              createdAt: DateTime.now(),
              updatedAt: DateTime.now(),
            })

            // Registrar el pago
            await Payment.create({
              paymentRequestId: paymentRequest.id,
              subscriptionId: localSubscription.id,
              amount: invoice.amount_paid / 100,
              paymentDate: DateTime.now(),
              concept: invoice.description || 'Pago de suscripción',
              status: 'success',
              createdAt: DateTime.now(),
            })
          } else {
            console.warn('No se encontró la suscripción local para el pago:', subscriptionId)
          }
          break
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice
          console.warn('⚠️ Pago fallido para suscripción:', invoice.subscription)
          // Actualiza estado local si lo necesitas
          break
        }

        default:
          console.log(`📌 Evento Stripe no manejado: ${event.type}`)
      }

      return { success: true }
    } catch (error) {
      console.error('❌ Error procesando webhook:', error)
      return { success: false, error: error.message || error }
    }
  }

}
