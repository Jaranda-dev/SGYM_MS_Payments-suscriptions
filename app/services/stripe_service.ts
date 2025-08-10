import Profile from '#models/profile'
import User from '#models/user'
import env from '#start/env'
import Stripe from 'stripe'


const stripeSecretKey = env.get('STRIPE_SECRET_KEY')
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-07-30.basil',
})


export default class StripeService {

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

}
