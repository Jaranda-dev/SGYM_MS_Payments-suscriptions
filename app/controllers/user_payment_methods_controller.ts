import type { HttpContext } from '@adonisjs/core/http'
import UserPaymentMethod from '#models/user_payment_method'
import { storeUserPaymentMethodValidator, updateUserPaymentMethodValidator } from '#validators/UserPaymentMethod'

export default class UserPaymentMethodsController {
  // Crear membresía
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(storeUserPaymentMethodValidator)
      const userPaymentMethod = await UserPaymentMethod.create(data)

      return response.created({
        status: 'success',
        data: userPaymentMethod,
        msg: 'método de pago creado exitosamente.',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        msg: 'Error al crear el método de pago.',
        data: error.messages || error,
      })
    }
  }

  // Obtener todas las membresías
  async index({ response }: HttpContext) {
    try {
      const userPaymentMethods = await UserPaymentMethod.all()
      return response.ok({
        status: 'success',
        data: userPaymentMethods,
        msg: 'Lista de métodos de pago obtenida exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener los métodos de pago.',
        data: error.messages || error,
      })
    }
  }

  // Obtener una membresía por ID
  async show({ params, response }: HttpContext) {
    try {
      const userPaymentMethod = await UserPaymentMethod.find(params.id)

      if (!userPaymentMethod) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'método de pago no encontrado.',
        })
      }

      return response.ok({
        status: 'success',
        data: userPaymentMethod,
        msg: 'método de pago obtenido exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener el método de pago.',
        data: error.messages || error,
      })
    }
  }

  // Actualizar membresía
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateUserPaymentMethodValidator)
      const userPaymentMethod = await UserPaymentMethod.find(params.id)

      if (!userPaymentMethod) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'método de pago no encontrado.',
        })
      }

      userPaymentMethod.merge(data)
      await userPaymentMethod.save()

      return response.ok({
        status: 'success',
        data: userPaymentMethod,
        msg: 'método de pago actualizado exitosamente.',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        msg: 'Error al actualizar el método de pago.',
        data: error.messages || error,
      })
    }
  }

  // Eliminar membresía
  async destroy({ params, response }: HttpContext) {
    try {
      const userPaymentMethod = await UserPaymentMethod.find(params.id)

      if (!userPaymentMethod) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'método de pago no encontrado.',
        })
      }

      await userPaymentMethod.delete()

      return response.ok({
        status: 'success',
        data: { id: userPaymentMethod.id },
        msg: 'método de pago eliminado exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al eliminar el método de pago.',
        data: error.messages || error,
      })
    }
  }
}