import type { HttpContext } from '@adonisjs/core/http'
import Routine from '#models/routine'
import vine from '@vinejs/vine'

export default class RoutinesController {
  // Listar todas las rutinas
  public async index({ response }: HttpContext) {
    const routines = await Routine.all()
    return response.ok({
      status: 'success',
      data: routines,
      msg: 'Lista de rutinas obtenida correctamente.'
    })
  }

  // Obtener rutina por ID
  public async show({ params, response }: HttpContext) {
    const routine = await Routine.find(params.id)
    if (!routine) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'Rutina no encontrada.'
      })
    }
    return response.ok({
      status: 'success',
      data: routine,
      msg: 'Rutina obtenida correctamente.'
    })
  }

  // Crear rutina
  public async store({ request, response }: HttpContext) {
    const schema = vine.object({
      name: vine.string().minLength(3),
      description: vine.string().minLength(5),
    })
    try {
      const payload = await vine.validate({ schema, data: request.all() })
      const routine = await Routine.create(payload)
      return response.created({
        status: 'success',
        data: routine,
        msg: 'Rutina creada exitosamente.'
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        data: error.messages ?? {},
        msg: 'Datos inválidos. Verifique los campos ingresados.'
      })
    }
  }

  // Actualizar rutina
  public async update({ params, request, response }: HttpContext) {
    const schema = vine.object({
      name: vine.string().minLength(3).optional(),
      description: vine.string().minLength(5).optional(),
    })
    try {
      const payload = await vine.validate({ schema, data: request.all() })
      const routine = await Routine.find(params.id)
      if (!routine) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Rutina no encontrada.'
        })
      }
      routine.merge(payload)
      await routine.save()
      return response.ok({
        status: 'success',
        data: routine,
        msg: 'Rutina actualizada correctamente.'
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        data: error.messages ?? {},
        msg: 'Datos inválidos. Verifique los campos ingresados.'
      })
    }
  }

  // Eliminar rutina
  public async destroy({ params, response }: HttpContext) {
    const routine = await Routine.find(params.id)
    if (!routine) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'Rutina no encontrada.'
      })
    }
    await routine.delete()
    return response.ok({
      status: 'success',
      data: { id: params.id },
      msg: 'Rutina eliminada correctamente.'
    })
  }
}
