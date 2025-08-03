import type { HttpContext } from '@adonisjs/core/http'
import NutritionistSchedule from '#models/nutritionist_schedule'
import { storeNutritionistScheduleValidator, updateNutritionistScheduleValidator } from '#validators/nutritionist_schedule'

export default class NutritionistSchedulesController {
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(storeNutritionistScheduleValidator)

    const schedule = await NutritionistSchedule.create(payload)

    return response.created({
      status: 'success',
      data: schedule,
      msg: 'Cita con nutriólogo creada exitosamente.',
    })
  }

  async index({ request, response }: HttpContext) {
    const nutritionist_id = request.qs().nutritionist_id
    const date = request.qs().date

    const query = NutritionistSchedule.query()

    if (nutritionist_id) query.where('nutritionist_id', nutritionist_id)
    if (date) query.where('date', date)

    const results = await query

    return response.ok({
      status: 'success',
      data: results,
      msg: 'Citas encontradas correctamente.',
    })
  }

  async show({ params, response }: HttpContext) {
    const schedule = await NutritionistSchedule.find(params.id)

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
      msg: 'Cita encontrada correctamente.',
    })
  }

  async update({ request, response, params }: HttpContext) {
    const schedule = await NutritionistSchedule.find(params.id)

    if (!schedule) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'Cita no encontrada.',
      })
    }

    const payload = await request.validateUsing(updateNutritionistScheduleValidator)

    schedule.merge(payload)
    await schedule.save()

    return response.ok({
      status: 'success',
      data: schedule,
      msg: 'Cita actualizada correctamente.',
    })
  }

  async destroy({ response, params }: HttpContext) {
    const schedule = await NutritionistSchedule.find(params.id)

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
      msg: 'Cita eliminada correctamente.',
    })
  }

  async indexByUserAuth({ auth, response }: HttpContext) {
    const userId = auth.user!.id

    const appointments = await NutritionistSchedule.query().where('user_id', userId)

    return response.ok({
      status: 'success',
      data: appointments,
      msg: 'Citas del usuario obtenidas correctamente.',
    })
  }

  async indexByNutritionistAuth({ auth, response }: HttpContext) {
    const nutritionistId = auth.user!.id

    const appointments = await NutritionistSchedule.query().where('nutritionist_id', nutritionistId)

    return response.ok({
      status: 'success',
      data: appointments,
      msg: 'Citas del nutriólogo obtenidas correctamente.',
    })
  }
}
