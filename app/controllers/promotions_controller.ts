import type { HttpContext } from '@adonisjs/core/http'
import Promotion from '#models/promotion'
import { storePromotionValidator, updatePromotionValidator } from '#validators/Promotion'
import { DateTime } from 'luxon'

export default class PromotionsController{
  // Crear membresía
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(storePromotionValidator)
      const promotion = await Promotion.create({
        ...data,
        startDate: DateTime.fromJSDate(data.startDate),
        endDate: DateTime.fromJSDate(data.endDate),
      })

      return response.created({
        status: 'success',
        data: promotion,
        msg: 'promoción creada exitosamente.',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        msg: 'Error al crear la promoción.',
        data: error.messages || error,
      })
    }
  }

  // Obtener todas las membresías
  async index({ response }: HttpContext) {
    try {
      const promotions = await Promotion.all()
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

  // Obtener una membresía por ID
  async show({ params, response }: HttpContext) {
    try {
      const promotion = await Promotion.find(params.id)

      if (!promotion) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'promoción no encontrada.',
        })
      }

      return response.ok({
        status: 'success',
        data: promotion,
        msg: 'promoción obtenido exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener la promoción.',
        data: error.messages || error,
      })
    }
  }

  // Actualizar membresía
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updatePromotionValidator)
      const promotion = await Promotion.find(params.id)

      if (!promotion) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'promoción no encontrada.',
        })
      }

      // Convert startDate and endDate to DateTime if present
      const updateData = {
        ...data,
        startDate: data.startDate ? DateTime.fromJSDate(data.startDate) : undefined,
        endDate: data.endDate ? DateTime.fromJSDate(data.endDate) : undefined,
      }
      promotion.merge(updateData)
      await promotion.save()

      return response.ok({
        status: 'success',
        data: promotion,
        msg: 'promoción actualizado exitosamente.',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        msg: 'Error al actualizar la promoción.',
        data: error.messages || error,
      })
    }
  }

  // Eliminar membresía
  async destroy({ params, response }: HttpContext) {
    try {
      const promotion = await Promotion.find(params.id)

      if (!promotion) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'promoción no encontrada.',
        })
      }

      await promotion.delete()

      return response.ok({
        status: 'success',
        data: { id: promotion.id },
        msg: 'promoción eliminado exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al eliminar la promoción.',
        data: error.messages || error,
      })
    }
  }
}