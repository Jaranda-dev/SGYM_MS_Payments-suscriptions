import type { HttpContext } from '@adonisjs/core/http'
import Routine from '#models/routine'

export default class RoutinesController {
  // GET /routines
  public async index({ auth, response }: HttpContext) {
    try {
      const user = await auth.use('jwt').authenticate()
      const routines = await Routine.query().where('user_id', user.id)

      return response.ok({
        status: 'success',
        data: routines,
        msg: 'Lista de rutinas obtenida correctamente.',
      })
    } catch {
      return response.internalServerError({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.',
      })
    }
  }

  // GET /routines/:id
  public async show({ auth, params, response }: HttpContext) {
    try {
      const user = await auth.use('jwt').authenticate()
      const routine = await Routine.query()
        .where('id', params.id)
        .andWhere('user_id', user.id)
        .first()

      if (!routine) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Rutina no encontrada.',
        })
      }

      return response.ok({
        status: 'success',
        data: routine,
        msg: 'Rutina obtenida correctamente.',
      })
    } catch {
      return response.internalServerError({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.',
      })
    }
  }

  // POST /routines
  public async store({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.use('jwt').authenticate()
      const payload = request.only(['day', 'name', 'description'])

      const routine = await Routine.create({
        ...payload,
        userId: user.id,
      })

      return response.created({
        status: 'success',
        data: routine,
        msg: 'Rutina creada exitosamente.',
      })
    } catch {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'Datos inválidos. Verifique los campos ingresados.',
      })
    }
  }

  // PUT /routines/:id
  public async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = await auth.use('jwt').authenticate()
      const routine = await Routine.query()
        .where('id', params.id)
        .andWhere('user_id', user.id)
        .first()

      if (!routine) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Rutina no encontrada.',
        })
      }

      const data = request.only(['day', 'name', 'description'])
      routine.merge(data)
      await routine.save()

      return response.ok({
        status: 'success',
        data: routine,
        msg: 'Rutina actualizada correctamente.',
      })
    } catch {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'Datos inválidos. Verifique los campos ingresados.',
      })
    }
  }

  // DELETE /routines/:id
  public async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = await auth.use('jwt').authenticate()
      const routine = await Routine.query()
        .where('id', params.id)
        .andWhere('user_id', user.id)
        .first()

      if (!routine) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Rutina no encontrada.',
        })
      }

      await routine.delete()

      return response.ok({
        status: 'success',
        data: { id: routine.id },
        msg: 'Rutina eliminada correctamente.',
      })
    } catch {
      return response.internalServerError({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.',
      })
    }
  }
}
