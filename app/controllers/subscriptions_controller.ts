import type { HttpContext } from '@adonisjs/core/http'
import Subscription from '#models/subscription'
import { storeSubscriptionValidator, updateSubscriptionValidator } from '#validators/Subscription'
import { DateTime } from 'luxon'
export default class SubscriptionsController{
  // Crear membresía
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(storeSubscriptionValidator)
      // Convert startDate and endDate from JS Date to Luxon DateTime
      const { startDate, endDate, ...rest } = data
      const subscription = await Subscription.create({
        ...rest,
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
      const { startDate, endDate, ...rest } = data
      subscription.merge({
        ...rest,
        ...(startDate && { startDate: DateTime.fromJSDate(startDate) }),
        ...(endDate && { endDate: DateTime.fromJSDate(endDate) }),
      })
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

      await subscription.delete()

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
}