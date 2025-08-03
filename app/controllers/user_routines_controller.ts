import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import UserRutine from '#models/user_rutine'
import Routine from '#models/routine'
import User from '#models/user'

export default class UserRoutinesController {

  public async store({ request, response }: HttpContext) {
    try {
      const schema = vine.object({
        user_id: vine.number(),
        routine_id: vine.number(),
        day: vine.string().trim().toLowerCase(),
      })

      const data = await vine.validate({
        schema,
        data: request.body(),
      })

      const user = await User.find(data.user_id)
      const routine = await Routine.find(data.routine_id)

      if (!user || !routine) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Usuario o rutina no encontrados.',
        })
      }

      const assignment = await UserRutine.create({
        userId: data.user_id,
        routineId: data.routine_id,
        day: data.day,
      })

      return response.created({
        status: 'success',
        data: assignment,
        msg: 'Rutina asignada correctamente al usuario.',
      })
    } catch (error) {
        console.log(error)
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'Datos inválidos. Verifique los campos ingresados.',
      })
    }
  }

  public async indexByUser({ params, response }: HttpContext) {
    try {
      const { user_id } = params

      const assignments = await UserRutine.query().where('user_id', user_id)

      return response.ok({
        status: 'success',
        data: assignments,
        msg: 'Lista de rutinas asignadas obtenida correctamente.',
      })
    } catch {
      return response.internalServerError({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.',
      })
    }
  }

  public async indexAuth({ auth, response }: HttpContext) {
    try {
      const user = await auth.use('jwt').authenticate()

      const assignments = await UserRutine.query().where('user_id', user.id)

      return response.ok({
        status: 'success',
        data: assignments,
        msg: 'Asignación de rutina obtenida correctamente.',
      })
    } catch {
      return response.internalServerError({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.',
      })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const schema = vine.object({
        day: vine.string().optional(),
        routine_id: vine.number().optional(),
      })

      const data = await vine.validate({
        schema,
        data: request.body(),
      })

      const assignment = await UserRutine.find(params.id)
      if (!assignment) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Usuario o rutina no encontrados.',
        })
      }

      if (data.day) assignment.day = data.day
      if (data.routine_id) assignment.routineId = data.routine_id

      await assignment.save()

      return response.ok({
        status: 'success',
        data: assignment,
        msg: 'Asignación de rutina actualizada correctamente.',
      })
    } catch {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'Datos inválidos. Verifique los campos ingresados.',
      })
    }
  }
}
