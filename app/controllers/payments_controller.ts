import type { HttpContext } from '@adonisjs/core/http'
import Payment from '#models/payment'
import { storePaymentValidator , updatePaymentValidator } from '#validators/Payment'
export default class PaymentsController {
  // Crear membresía
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(storePaymentValidator)
      const payment = await Payment.create(data)

      return response.created({
        status: 'success',
        data: payment,
        msg: 'pago creado exitosamente.',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        msg: 'Error al crear el pago.',
        data: error.messages || error,
      })
    }
  }

  // Obtener todas las membresías
  async index({ response }: HttpContext) {
    try {
      const payments = await Payment.all()
      return response.ok({
        status: 'success',
        data: payments,
        msg: 'Lista de pagos obtenida exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener los pagos.',
        data: error.messages || error,
      })
    }
  }

  // Obtener una membresía por ID
  async show({ params, response }: HttpContext) {
    try {
      const payment = await Payment.find(params.id)

      if (!payment) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'pago no encontrado.',
        })
      }

      return response.ok({
        status: 'success',
        data: payment,
        msg: 'pago obtenido exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener el pago.',
        data: error.messages || error,
      })
    }
  }

  // Actualizar membresía
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updatePaymentValidator)
      const payment = await Payment.find(params.id)

      if (!payment) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'pago no encontrado.',
        })
      }

      payment.merge(data)
      await payment.save()

      return response.ok({
        status: 'success',
        data: payment,
        msg: 'pago actualizado exitosamente.',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        msg: 'Error al actualizar el pago.',
        data: error.messages || error,
      })
    }
  }

  // Eliminar membresía
  async destroy({ params, response }: HttpContext) {
    try {
      const payment = await Payment.find(params.id)

      if (!payment) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'pago no encontrado.',
        })
      }

      await payment.delete()

      return response.ok({
        status: 'success',
        data: { id: payment.id },
        msg: 'pago eliminado exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al eliminar el pago.',
        data: error.messages || error,
      })
    }
  }
}