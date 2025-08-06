// import type { HttpContext } from '@adonisjs/core/http'
import type { HttpContext } from '@adonisjs/core/http'
import PaymentRequest from '#models/payment_request'
import { storePaymentRequestValidator ,updatePaymentRequestValidator } from '#validators/payment_request'


export default class PaymentRequestsController{
  // Crear membresía
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(storePaymentRequestValidator)
      const paymentRequest = await PaymentRequest.create(data)

      return response.created({
        status: 'success',
        data: paymentRequest,
        msg: 'solicitudes de pago creado exitosamente.',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        msg: 'Error al crear el solicitudes de pago.',
        data: error.messages || error,
      })
    }
  }

  // Obtener todas las membresías
  async index({ response }: HttpContext) {
    try {
      const paymentRequests = await PaymentRequest.all()
      return response.ok({
        status: 'success',
        data: paymentRequests,
        msg: 'Lista de solicitudes de pago obtenida exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener los solicitudes de pago.',
        data: error.messages || error,
      })
    }
  }

  // Obtener una membresía por ID
  async show({ params, response }: HttpContext) {
    try {
      const paymentRequest = await PaymentRequest.find(params.id)

      if (!paymentRequest) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'solicitudes de pago no encontrado.',
        })
      }

      return response.ok({
        status: 'success',
        data: paymentRequest,
        msg: 'solicitudes de pago obtenido exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener el solicitudes de pago.',
        data: error.messages || error,
      })
    }
  }

  // Actualizar membresía
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updatePaymentRequestValidator)
      const paymentRequest = await PaymentRequest.find(params.id)

      if (!paymentRequest) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'solicitudes de pago no encontrado.',
        })
      }

      paymentRequest.merge(data)
      await paymentRequest.save()

      return response.ok({
        status: 'success',
        data: paymentRequest,
        msg: 'solicitudes de pago actualizado exitosamente.',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        msg: 'Error al actualizar el solicitudes de pago.',
        data: error.messages || error,
      })
    }
  }

  // Eliminar membresía
  async destroy({ params, response }: HttpContext) {
    try {
      const paymentRequest = await PaymentRequest.find(params.id)

      if (!paymentRequest) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'solicitudes de pago no encontrado.',
        })
      }

      await paymentRequest.delete()

      return response.ok({
        status: 'success',
        data: { id: paymentRequest.id },
        msg: 'solicitudes de pago eliminado exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al eliminar el solicitudes de pago.',
        data: error.messages || error,
      })
    }
  }
}