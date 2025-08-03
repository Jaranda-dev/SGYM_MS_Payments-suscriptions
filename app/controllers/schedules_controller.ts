import type { HttpContext } from '@adonisjs/core/http'
import Schedule from '#models/schedule'
import StoreScheduleValidator from '#validators/store_schedule'
import UpdateScheduleValidator from '#validators/update_schedule'

export default class ScheduleController {
  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(StoreScheduleValidator)
      const schedule = await Schedule.create(payload)

      return response.created({
        status: 'success',
        data: schedule,
        msg: 'Horario creado exitosamente.',
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          status: 'error',
          data: {},
          msg: 'Datos inválidos. Verifique los campos ingresados.',
        })
      }
      console.log(error)
      return response.internalServerError({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor',
      })
    }
  }

  async index({ request, response }: HttpContext) {
    try {
      const userId = request.qs().user_id
      const query = Schedule.query()
      if (userId) {
        query.where('user_id', userId)
      }

      const data = await query

      return response.ok({
        status: 'success',
        data,
        msg: 'Horarios obtenidos correctamente.',
      })
    } catch {
      return response.internalServerError({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor',
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const schedule = await Schedule.find(params.id)
      if (!schedule) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Cita no encontrada.',
        })
      }

      return response.ok({
        status: 'success',
        data: schedule,
        msg: 'Horario encontrado correctamente.',
      })
    } catch {
      return response.internalServerError({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor',
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const schedule = await Schedule.find(params.id)
      if (!schedule) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Cita no encontrada.',
        })
      }

      const payload = await request.validateUsing(UpdateScheduleValidator)

      schedule.merge(payload)
      await schedule.save()

      return response.ok({
        status: 'success',
        data: schedule,
        msg: 'Horario actualizado correctamente.',
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          status: 'error',
          data: {},
          msg: 'Datos inválidos. Verifique los campos ingresados.',
        })
      }

      return response.internalServerError({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor',
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const schedule = await Schedule.find(params.id)
      if (!schedule) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Cita no encontrada.',
        })
      }

      await schedule.delete()

      return response.ok({
        status: 'success',
        data: { id: schedule.id },
        msg: 'Horario eliminado correctamente.',
      })
    } catch {
      return response.internalServerError({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor',
      })
    }
  }
}
