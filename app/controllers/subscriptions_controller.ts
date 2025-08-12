import type { HttpContext } from '@adonisjs/core/http'
import Subscription from '#models/subscription'
import { storeSubscriptionValidator, updateSubscriptionValidator } from '#validators/Subscription'
import { DateTime } from 'luxon'
import { storeSuscribe } from '#validators/suscribe'
import Membership from '#models/membership'
import Promotion from '#models/promotion'
import UserPromotion from '#models/user_promotion'
import StripeService from '#services/stripe_service'



export default class SubscriptionsController{
  // Crear membresía
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(storeSubscriptionValidator)
      // Convert startDate and endDate from JS Date to Luxon DateTime
      const { startDate, endDate, ...rest } = data
      const subscription = await Subscription.create({
        ...rest,
        status: rest.status === 'cancelled' ? 'canceled' : rest.status,
        startDate: DateTime.fromJSDate(startDate),
        endDate: DateTime.fromJSDate(endDate),
      })

      return response.created({
        status: 'success',
        data: subscription,
        msg: 'suscripción creada exitosamente.',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        msg: 'Error al crear la suscripción.',
        data: error.messages || error,
      })
    }
  }

  // Obtener todas las membresías
  async index({ response }: HttpContext) {
    try {
      const subscriptions = await Subscription.all()
      return response.ok({
        status: 'success',
        data: subscriptions,
        msg: 'Lista de suscripciones obtenida exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener las suscripciones.',
        data: error.messages || error,
      })    
    }
  }

  // Obtener una membresía por ID
  async show({ params, response }: HttpContext) {
    try {
      const subscription = await Subscription.find(params.id)

      if (!subscription) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'suscripción no encontrada.',
        })
      }

      return response.ok({
        status: 'success',
        data: subscription,
        msg: 'suscripción obtenido exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener la suscripción.',
        data: error.messages || error,
      })
    }
  }

  // Actualizar membresía
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateSubscriptionValidator)
      const subscription = await Subscription.find(params.id)

      if (!subscription) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'suscripción no encontrada.',
        })
      }

    // Convert startDate and endDate from JS Date to Luxon DateTime if present
    const { startDate, endDate, status, ...rest } = data
    const updateData: any = {
      ...rest,
      ...(typeof status !== 'undefined' ? { status: status === 'cancelled' ? 'canceled' : status } : {}),
      ...(typeof startDate !== 'undefined' ? { startDate: DateTime.fromJSDate(startDate) } : {}),
      ...(typeof endDate !== 'undefined' ? { endDate: DateTime.fromJSDate(endDate) } : {}),
    }
    subscription.merge(updateData)
    await subscription.save()

      return response.ok({
        status: 'success',
        data: subscription,
        msg: 'suscripción actualizado exitosamente.',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        msg: 'Error al actualizar la suscripción.',
        data: error.messages || error,
      })
    }
  }

  // Eliminar membresía
  async destroy({ params, response }: HttpContext) {
    try {
      const subscription = await Subscription.find(params.id)

      if (!subscription) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'solicitudes de pago no encontrado.',
        })
      }

      await subscription.softDelete()

      return response.ok({
        status: 'success',
        data: { id: subscription.id },
        msg: 'suscripción eliminado exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al eliminar la suscripción.',
        data: error.messages || error,
      })
    }
  }

  // Obtener suscripciones por usuario
  async getByUser({ auth, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({
          status: 'error',
          msg: 'Usuario no autenticado.',
          data: [],
        })
      }

      const subscriptions = await Subscription.query().where('userId', user.id).preload('membership')

      return response.ok({
        status: 'success',
        data: subscriptions,
        msg: 'Suscripciones del usuario obtenidas exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener las suscripciones del usuario.',
        data: error.messages || error,
      })
    }
  }
async subscribe({ request, response, auth }: HttpContext) {
  try {
    const data = await request.validateUsing(storeSuscribe)
    const user = auth.user
    if (!user) {
      return response.unauthorized({ status: 'error', msg: 'Usuario no autenticado.', data: [] })
    }

    const membership = await Membership.find(data.MembershipId)
    if (!membership) {
      return response.notFound({ status: 'error', msg: 'Membresía no encontrada.', data: [] })
    }

    let promotion: Promotion | null = null
    if (data.PromotionId) {
      promotion = await Promotion.find(data.PromotionId)
      if (!promotion) {
        return response.notFound({ status: 'error', msg: 'Promoción no encontrada.', data: [] })
      }
    }

    // Obtener cliente Stripe
    const userStripe = await StripeService.retrieveCustomerByUserId(user.id)

    // Obtener suscripción Stripe actual (si existe)
    let stripeSubscription: any = await StripeService.retrieveSubscriptionByCustomerId(userStripe.id)
    const userSubscription = await Subscription.query().where('userId', user.id).first()

    let startDate = DateTime.now()
    let endDate = startDate.plus({ days: membership.durationDays })

    if (!userSubscription && stripeSubscription) {
      await StripeService.deleteSubscription(stripeSubscription.id)
      stripeSubscription = null
    }

    if (stripeSubscription != null) {
      const periodEndValue = (stripeSubscription as any)?.current_period_end
      console.log('Current period end value:', periodEndValue)

      let currentPeriodEnd: DateTime

      if (
        typeof periodEndValue === 'number' &&
        !isNaN(periodEndValue) &&
        periodEndValue > 0
      ) {
        currentPeriodEnd = DateTime.fromSeconds(periodEndValue)
      } else if (
        typeof periodEndValue === 'string' &&
        !isNaN(Number(periodEndValue)) &&
        Number(periodEndValue) > 0
      ) {
        currentPeriodEnd = DateTime.fromSeconds(Number(periodEndValue))
      } else {
        // Si no hay periodo, usar la fecha actual como fallback
        currentPeriodEnd = DateTime.now()
        console.warn('current_period_end no está definido, usando fecha actual como inicio del nuevo periodo.')
      }

      startDate = currentPeriodEnd
      endDate = currentPeriodEnd.plus({ days: membership.durationDays })

      await StripeService.updateSubscriptionPrice(stripeSubscription, membership)
    } else {
      console.log('No existing Stripe subscription found, creating a new one.')
      console.log('Creating Stripe subscription with price ID:', membership.stripePriceId)
      console.log('User Stripe ID:', userStripe.id)
      await StripeService.createSubscription(userStripe.id, membership.stripePriceId)
    }

    // Crear o actualizar registro local
    let subscription = await Subscription.query()
      .where('userId', user.id)
      .andWhere('status', 'active')
      .first()

    if (subscription) {
      subscription.merge({
        membershipId: membership.id,
        startDate,
        endDate,
      })
      await subscription.save()
    } else {
      subscription = await Subscription.create({
        userId: user.id,
        membershipId: membership.id,
        status: 'active',
        isRenewable: data.isRenewable,
        startDate,
        endDate,
      })
    }

    if (promotion) {
      await UserPromotion.create({
        userId: user.id,
        promotionId: promotion.id,
      })
    }

    return response.created({
      status: 'success',
      data: subscription,
      msg: 'Suscripción creada o actualizada exitosamente.',
    })

  } catch (error) {
    console.error(error)
    return response.badRequest({
      status: 'error',
      msg: 'Error al crear la suscripción.',
      data: error.messages || error,
    })
  }
}



}