import type { HttpContext } from '@adonisjs/core/http'
import Promotion from '#models/promotion'
import { storePromotionValidator, updatePromotionValidator } from '#validators/Promotion'
import StripeService from '#services/stripe_service'

import UserPromotion from '#models/user_promotion'

export default class PromotionsController {
  // Crear promoción
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(storePromotionValidator)
      const stripeProduct = await StripeService.createCoupon(data.name, data.discount,)
      const promotion = await Promotion.create({
        ...data,
        stripeCouponId: stripeProduct.id,
      })

      return response.created({
        status: 'success',
        data: promotion,
        msg: 'Promoción creada exitosamente.',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        msg: 'Error al crear la promoción.',
        data: error.messages || error,
      })
    }
  }

  // Obtener todas las promociones
  async index({ response }: HttpContext) {
    try {
      const promotions = await Promotion.all()
      for (const promotion of promotions) {
        await promotion.preload('membership')
      }
      return response.ok({
        status: 'success',
        data: promotions,
        msg: 'Lista de promociones obtenida exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener las promociones.',
        data: error.messages || error,
      })
    }
  }

  // Obtener una promoción por ID
  async show({ params, response }: HttpContext) {
    try {
      const promotion = await Promotion.find(params.id)

      if (!promotion) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'Promoción no encontrada.',
        })
      }

      return response.ok({
        status: 'success',
        data: promotion,
        msg: 'Promoción obtenida exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener la promoción.',
        data: error.messages || error,
      })
    }
  }

  // Actualizar promoción
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updatePromotionValidator)
      const promotion = await Promotion.find(params.id)

      if (!promotion) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'Promoción no encontrada.',
        })
      }

      // Convert startDate and endDate to DateTime if present
      const updateData = {
        ...data
      }
       await StripeService.updateCoupon(promotion.stripeCouponId, {
        name: data.name,
        percent_off: data.discount,
      })

      promotion.merge(updateData)
      await promotion.save()

      return response.ok({
        status: 'success',
        data: promotion,
        msg: 'Promoción actualizada exitosamente.',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        msg: 'Error al actualizar la promoción.',
        data: error.messages || error,
      })
    }
  }

  // Eliminar promoción
  async destroy({ params, response }: HttpContext) {
    try {
      const promotion = await Promotion.find(params.id)

      if (!promotion) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'Promoción no encontrada.',
        })
      }

      await promotion.delete()

      return response.ok({
        status: 'success',
        data: { id: promotion.id },
        msg: 'Promoción eliminada exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al eliminar la promoción.',
        data: error.messages || error,
      })
    }
  }

  // Obtener promociones de una membresía que el usuario no ha usado
  async getPromotionByMembership({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({
          status: 'error',
          msg: 'Usuario no autenticado.',
        })
      }
      const promotions = await Promotion.query().where('membership_id', params.id)
      const userPromotions = await UserPromotion.query()
        .where('user_id', user.id)
        .whereIn('promotion_id', promotions.map(p => p.id))
      const promotionsNotUsed = promotions.filter(promotion =>
        !userPromotions.some(up => up.promotionId === promotion.id)
      )
      return response.ok({
        status: 'success',
        data: promotionsNotUsed,
        msg: 'Promociones obtenidas exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener las promociones.',
        data: error.messages || error,
      })
    }
  }
}