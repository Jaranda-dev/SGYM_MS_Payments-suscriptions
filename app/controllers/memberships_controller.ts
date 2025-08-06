// import type { HttpContext } from '@adonisjs/core/http'
import type { HttpContext } from '@adonisjs/core/http'
import Membership from '#models/membership'
import { storeMembershipValidator, updateMembershipValidator } from '#validators/membership'

export default class MembershipsController  {
  // Crear membresía
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(storeMembershipValidator)
      const membership = await Membership.create(data)

      return response.created({
        status: 'success',
        data: membership,
        msg: 'Membresía creada exitosamente.',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        msg: 'Error al crear la membresía.',
        data: error.messages || error,
      })
    }
  }

  // Obtener todas las membresías
  async index({ response }: HttpContext) {
    try {
      const memberships = await Membership.all()
      return response.ok({
        status: 'success',
        data: memberships,
        msg: 'Lista de membresías obtenida exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener las membresías.',
        data: error.messages || error,
      })
    }
  }

  // Obtener una membresía por ID
  async show({ params, response }: HttpContext) {
    try {
      const membership = await Membership.find(params.id)

      if (!membership) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'Membresía no encontrada.',
        })
      }

      return response.ok({
        status: 'success',
        data: membership,
        msg: 'Membresía obtenida exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al obtener la membresía.',
        data: error.messages || error,
      })
    }
  }

  // Actualizar membresía
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateMembershipValidator)
      const membership = await Membership.find(params.id)

      if (!membership) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'Membresía no encontrada.',
        })
      }

      membership.merge(data)
      await membership.save()

      return response.ok({
        status: 'success',
        data: membership,
        msg: 'Membresía actualizada exitosamente.',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        msg: 'Error al actualizar la membresía.',
        data: error.messages || error,
      })
    }
  }

  // Eliminar membresía
  async destroy({ params, response }: HttpContext) {
    try {
      const membership = await Membership.find(params.id)

      if (!membership) {
        return response.notFound({
          status: 'error',
          data: [],
          msg: 'Membresía no encontrada.',
        })
      }

      await membership.delete()

      return response.ok({
        status: 'success',
        data: { id: membership.id },
        msg: 'Membresía eliminada exitosamente.',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        msg: 'Error al eliminar la membresía.',
        data: error.messages || error,
      })
    }
  }
}