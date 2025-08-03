import type { HttpContext } from '@adonisjs/core/http'
import TrainerSchedule from '#models/trainer_schedule'
import vine from '@vinejs/vine'

export default class TrainerSchedulesController {

  // Crear cita
  public async store({ request, response }: HttpContext) {
    try {
      const validator = vine.compile(
        vine.object({
          user_id: vine.number().positive(),
          trainer_id: vine.number().positive(),
          date: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          start_time: vine.string().regex(/^\d{2}:\d{2}$/),
          end_time: vine.string().regex(/^\d{2}:\d{2}$/),
        })
      )

      const payload = request.only(['user_id', 'trainer_id', 'date', 'start_time', 'end_time'])
      const data = await validator.validate(payload)

      const schedule = await TrainerSchedule.create({
        userId: data.user_id,
        trainerId: data.trainer_id,
        date: data.date,
        startTime: data.start_time + ':00',
        endTime: data.end_time + ':00',
      })

      return response.status(201).json({
        status: 'success',
        data: schedule,
        msg: 'Cita con entrenador creada exitosamente.',
      })
    } catch (error) {
      console.error(error)
      return response.status(400).json({
        status: 'error',
        data: {},
        msg: 'Datos inválidos. Verifique los campos ingresados.',
      })
    }
  }

  // Listar citas con filtros opcionales
  public async index({ request, response }: HttpContext) {
    try {
      const { trainer_id, user_id, date } = request.qs()

      let query = TrainerSchedule.query()

      if (trainer_id) query = query.where('trainer_id', trainer_id)
      if (user_id) query = query.where('user_id', user_id)
      if (date) query = query.where('date', date)

      const schedules = await query

      return response.status(200).json({
        status: 'success',
        data: schedules,
        msg: 'Citas encontradas correctamente.',
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.',
      })
    }
  }

  // Obtener cita por ID
  public async show({ params, response }: HttpContext) {
    try {
      const schedule = await TrainerSchedule.find(params.id)

      if (!schedule) {
        return response.status(404).json({
          status: 'error',
          data: {},
          msg: 'Cita no encontrada.',
        })
      }

      return response.status(200).json({
        status: 'success',
        data: schedule,
        msg: 'Cita encontrada correctamente.',
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.',
      })
    }
  }

  // Actualizar cita
  public async update({ params, request, response }: HttpContext) {
    try {
      const validator = vine.compile(
        vine.object({
          date: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
          start_time: vine.string().regex(/^\d{2}:\d{2}$/).optional(),
          end_time: vine.string().regex(/^\d{2}:\d{2}$/).optional(),
        })
      )

      const payload = request.only(['date', 'start_time', 'end_time'])
      const data = await validator.validate(payload)

      const schedule = await TrainerSchedule.find(params.id)
      if (!schedule) {
        return response.status(404).json({
          status: 'error',
          data: {},
          msg: 'Cita no encontrada.',
        })
      }

      if (data.date) schedule.date = data.date
      if (data.start_time) schedule.startTime = data.start_time + ':00'
      if (data.end_time) schedule.endTime = data.end_time + ':00'

      await schedule.save()

      return response.status(200).json({
        status: 'success',
        data: schedule,
        msg: 'Cita actualizada correctamente.',
      })
    } catch (error) {
      console.error(error)
      return response.status(400).json({
        status: 'error',
        data: {},
        msg: 'Datos inválidos. Verifique los campos ingresados.',
      })
    }
  }

  // Eliminar cita
  public async destroy({ params, response }: HttpContext) {
    try {
      const schedule = await TrainerSchedule.find(params.id)

      if (!schedule) {
        return response.status(404).json({
          status: 'error',
          data: {},
          msg: 'Cita no encontrada.',
        })
      }

      await schedule.delete()

      return response.status(200).json({
        status: 'success',
        data: { id: schedule.id },
        msg: 'Cita eliminada correctamente.',
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.',
      })
    }
  }

  // Listar citas del usuario autenticado
  public async indexByUserAuth({ auth, response }: HttpContext) {
    try {
      const userId = auth.user?.id
      if (!userId) throw new Error('Usuario no autenticado')

      const schedules = await TrainerSchedule.query()
        .where('user_id', userId)

      return response.status(200).json({
        status: 'success',
        data: schedules,
        msg: 'Citas del usuario obtenidas correctamente.',
      })
    } catch (error) {
      console.error(error)
      return response.status(401).json({
        status: 'error',
        data: {},
        msg: 'No autorizado.',
      })
    }
  }

  // Listar citas asignadas al entrenador autenticado
  public async indexByTrainerAuth({ auth, response }: HttpContext) {
    try {
      const trainerId = auth.user?.id
      if (!trainerId) throw new Error('Entrenador no autenticado')

      const schedules = await TrainerSchedule.query()
        .where('trainer_id', trainerId)

      return response.status(200).json({
        status: 'success',
        data: schedules,
        msg: 'Citas del entrenador obtenidas correctamente.',
      })
    } catch (error) {
      console.error(error)
      return response.status(401).json({
        status: 'error',
        data: {},
        msg: 'No autorizado.',
      })
    }
  }
}
