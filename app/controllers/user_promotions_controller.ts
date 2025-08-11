import type { HttpContext } from '@adonisjs/core/http'
import UserPromotion from '#models/user_promotion'
import { storeUserPromotionValidator,updateUserPromotionValidator } from '#validators/UserPromotion'
export default class UserPromotionsController {
  // Crear membresía
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(storeUserPromotionValidator)
      const userPromotion = await UserPromotion.create(data)

      return response.created({
        status: 'success',
        data: userPromotion,
        msg: 'promoción de usuario creado exitosamente.',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        msg: 'Error al crear la promoción de usuario.',
        data: error.messages || error,
      })
    }
  }

  // Obtener todas las promociones de usuario
  async index({ response }: HttpContext) {
    try {
      const userPromotions = await UserPromotion.all()
      return response.ok({
        status: 'success',
        data: userPromotions,
        msg: 'Lista de promociones de usuario obtenida exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener las promociones de usuario.',
        data: error.messages || error,
      })
    }
  }

  // Obtener una promoción de usuario por ID
  async show({ params, response }: HttpContext) {
    try {
      const userPromotion = await UserPromotion.find(params.id)

      if (!userPromotion) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'promoción de usuario no encontrado.',
        })
      }

      return response.ok({
        status: 'success',
        data: userPromotion,
        msg: 'promoción de usuario obtenido exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener la promoción de usuario.',
        data: error.messages || error,
      })
    }
  }

  // Actualizar promoción de usuario
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateUserPromotionValidator)
      const userPromotion = await UserPromotion.find(params.id)

      if (!userPromotion) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'promoción de usuario no encontrado.',
        })
      }

      userPromotion.merge(data)
      await userPromotion.save()

      return response.ok({
        status: 'success',
        data: userPromotion,
        msg: 'promoción de usuario actualizado exitosamente.',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        msg: 'Error al actualizar la promoción de usuario.',
        data: error.messages || error,
      })
    }
  }

  // Eliminar promoción de usuario
  async destroy({ params, response }: HttpContext) {
    try {
      const userPromotion = await UserPromotion.find(params.id)

      if (!userPromotion) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'promoción de usuario no encontrado.',
        })
      }

      await userPromotion.softDelete()

      return response.ok({
        status: 'success',
        data: { id: userPromotion.id },
        msg: 'promoción de usuario eliminado exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al eliminar la promoción de usuario.',
        data: error.messages || error,
      })
    }
  }
}