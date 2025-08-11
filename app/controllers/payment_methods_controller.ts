// import type { HttpContext } from '@adonisjs/core/http'
import type { HttpContext } from '@adonisjs/core/http'
import PaymentMethod from '#models/payment_method'
import { storePaymentMethodValidator, updatePaymentMethodValidator } from '#validators/PaymentMethod'
export default class PaymentMethodsController{
  // Crear membresía
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(storePaymentMethodValidator)
      const paymentMethod = await PaymentMethod.create(data)

      return response.created({
        status: 'success',
        data: paymentMethod,
        msg: 'Método de pago creado exitosamente.',
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
      const paymentMethods = await PaymentMethod.all()
      return response.ok({
        status: 'success',
        data: paymentMethods,
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
      const paymentMethod = await PaymentMethod.find(params.id)

      if (!paymentMethod) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'Método de pago no encontrado.',
        })
      }

      return response.ok({
        status: 'success',
        data: paymentMethod,
        msg: 'Método de pago obtenido exitosamente.',
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
      const data = await request.validateUsing(updatePaymentMethodValidator)
      const paymentMethod = await PaymentMethod.find(params.id)

      if (!paymentMethod) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'Método de pago no encontrado.',
        })
      }

      paymentMethod.merge(data)
      await paymentMethod.save()

      return response.ok({
        status: 'success',
        data: paymentMethod,
        msg: 'Método de pago actualizado exitosamente.',
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
      const paymentMethod = await PaymentMethod.find(params.id)

      if (!paymentMethod) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'Método de pago no encontrado.',
        })
      }

      await paymentMethod.softDelete()

      return response.ok({
        status: 'success',
        data: { id: paymentMethod.id },
        msg: 'Método de pago eliminado exitosamente.',
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