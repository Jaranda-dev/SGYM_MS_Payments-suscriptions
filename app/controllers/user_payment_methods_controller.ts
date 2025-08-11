import type { HttpContext } from '@adonisjs/core/http'
import UserPaymentMethod from '#models/user_payment_method'
import { storeUserPaymentMethodValidator, updateUserPaymentMethodValidator } from '#validators/UserPaymentMethod'
import User from '#models/user'
import StripeService from '#services/stripe_service'

export default class UserPaymentMethodsController {
  // Crear membresía
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(storeUserPaymentMethodValidator)
      data.isDefault = true
      

      const userPaymentMethod = await UserPaymentMethod.create(data)
await UserPaymentMethod.query()
          .where('user_id', userPaymentMethod.userId)
          .where('id', '!=', userPaymentMethod.id)
          .update({ isDefault: false })
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
      if (data.isDefault) {
        // Si se marca como predeterminado, desmarcar otros métodos de pago
        await UserPaymentMethod.query()
          .where('user_id', userPaymentMethod.userId)
          .where('id', '!=', userPaymentMethod.id)
          .update({ isDefault: false })
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

      await userPaymentMethod.softDelete()

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


   async storeByPaymentMethodId({ request, response ,auth }: HttpContext) {
    try {
      const {payment_method_id} = request.body()
      if (!payment_method_id) {
        return response.badRequest({
          status: 'error',
          msg: 'El ID del método de pago es requerido.',
        })
      }
      console.log(auth.user)
      const user = await User.findBy('id', auth.user!.id)
      if (!user) {
        return response.notFound({
          status: 'error',
          msg: 'Usuario no encontrado.',
        })
      }
      const data = await StripeService.retrieveMethod(payment_method_id)

      const userPaymentMethod = await UserPaymentMethod.create({
        userId: user.id,
        paymentMethodId: payment_method_id, 
        customerId: data.customer as string,
        brand: data.card?.brand || '',
        last4: data.card?.last4 || '',
        expMonth: data.card?.exp_month.toString() || '',
        expYear: data.card?.exp_year || 0,
        isDefault: true,
      })

     
        // Si se marca como predeterminado, desmarcar otros métodos de pago
        await UserPaymentMethod.query()
          .where('user_id', userPaymentMethod.userId)
          .where('id', '!=', userPaymentMethod.id)
          .update({ isDefault: false })
      

      return response.created({
        status: 'success',
        data: userPaymentMethod,
        msg: 'método de pago creado exitosamente.',
      })
    } catch (error) {
      console.log(error)
      return response.badRequest({
        status: 'error',
        msg: 'Error al crear el método de pago.',
        data: error.messages || error,
      })
    }
  }

  async getByUser({ response, auth }: HttpContext) {
    try {
      const user = await User.findBy('id', auth.user!.id)
      if (!user) {
        return response.notFound({
          status: 'error',
          msg: 'Usuario no encontrado.',
        })
      }
      const userPaymentMethods = await UserPaymentMethod.query().where('user_id', user.id)
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

  async getDefault({ response, auth }: HttpContext) {
    try {
      const user = await User.findBy('id', auth.user!.id)
      if (!user) {
        return response.notFound({
          status: 'error',
          msg: 'Usuario no encontrado.',
        })
      }
      const userPaymentMethod = await UserPaymentMethod.query()
        .where('user_id', user.id)
        .where('is_default', true)
        .first()

      if (!userPaymentMethod) {
        return response.notFound({
          status: 'error',
          msg: 'Método de pago predeterminado no encontrado.',
        })
      }

      return response.ok({
        status: 'success',
        data: userPaymentMethod,
        msg: 'Método de pago predeterminado obtenido exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener el método de pago predeterminado.',
        data: error.messages || error,
      })
    }
  }
}

