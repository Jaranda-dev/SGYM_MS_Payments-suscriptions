import type { HttpContext } from '@adonisjs/core/http'
import Occupancy from '#models/occupancy'
import { DateTime } from 'luxon'

export default class OccupanciesController {
  // POST /occupancy
  public async store({ request, response }: HttpContext) {
    const data = request.only(['recorded_at', 'level', 'people_count'])
    const errors: Record<string, string> = {}

    // Validaciones
    const recordedAt = DateTime.fromISO(data.recorded_at)
    if (!recordedAt.isValid) {
      errors.recorded_at = 'La fecha y hora debe tener el formato ISO (YYYY-MM-DDTHH:mm:ssZ).'
    }

    if (!['low', 'medium', 'high'].includes(data.level)) {
      errors.level = "El nivel debe ser 'low', 'medium' o 'high'."
    }

    if (data.people_count !== undefined && (isNaN(data.people_count) || data.people_count < 0)) {
      errors.people_count = 'La cantidad de personas debe ser un número positivo.'
    }

    if (Object.keys(errors).length > 0) {
      return response.badRequest({
        status: 'error',
        data: errors,
        msg: 'Datos inválidos. Verifique los campos ingresados.',
      })
    }

    const occupancy = await Occupancy.create({
      recordedAt,
      level: data.level,
      peopleCount: data.people_count,
    })

    return response.created({
      status: 'success',
      data: {
        id: occupancy.id,
        recorded_at: occupancy.recordedAt.toISO(),
        level: occupancy.level,
        people_count: occupancy.peopleCount,
      },
      msg: 'Registro de ocupación creado correctamente.',
    })
  }

  // GET /occupancy
  public async index({ request, response }: HttpContext) {
    const startDate = request.input('start_date') // formato: YYYY-MM-DD
    const endDate = request.input('end_date')     // formato: YYYY-MM-DD

    let query = Occupancy.query().orderBy('recorded_at', 'asc')

    if (startDate) {
      const from = DateTime.fromISO(startDate)
      if (from.isValid) {
        query = query.where('recorded_at', '>=', from.toISO())
      }
    }

    if (endDate) {
      const to = DateTime.fromISO(endDate)
      if (to.isValid) {
        query = query.where('recorded_at', '<=', to.endOf('day').toISO())
      }
    }

    const records = await query

    return response.ok({
      status: 'success',
      data: records.map((r) => ({
        id: r.id,
        recorded_at: r.recordedAt.toISO(),
        level: r.level,
        people_count: r.peopleCount,
      })),
      msg: 'Registros de ocupación obtenidos correctamente.',
    })
  }
}
