import type { HttpContext } from '@adonisjs/core/http'
import { availableStaffValidator } from '#validators/available_staff'
import Role from '#models/role'
import User from '#models/user'
import TrainerSchedule from '#models/trainer_schedule'
import NutritionistSchedule from '#models/nutritionist_schedule'

export default class StaffController {
  public async getAvailable({ request, response }: HttpContext) {
    const { role, date, start_time, end_time } = await request.validateUsing(availableStaffValidator)
    console.log('🔍 Parámetros recibidos:', { role, date, start_time, end_time })

    // 1. Obtener el ID del rol
    const roleRecord = await Role.findByOrFail('name', role)
    console.log('✅ Rol encontrado:', roleRecord)

    // 2. Buscar usuarios con ese rol que trabajen ese día y en ese rango
    const users = await User
      .query()
      .from('user as u')
      .where('u.role_id', roleRecord.id)
      .whereExists((subQuery) => {
        subQuery.from('schedule')
          .whereRaw('schedule.user_id = u.id')
          .where('start_time', '<=', start_time)
          .where('end_time', '>=', end_time)
      })

    console.log(`👥 Usuarios con rol '${role}' disponibles según horario:`, users.map(u => u.id))

    const available = []

    // 3. Determinar el modelo y columna según el rol
    const ScheduleModel = role === 'trainer' ? TrainerSchedule : NutritionistSchedule
    const scheduleColumn = role === 'trainer' ? 'trainer_id' : 'nutritionist_id'

    // 4. Verificar conflictos por usuario
    for (const user of users) {
      console.log(`⏳ Verificando conflictos para el usuario ${user.id}...`)
      const hasConflict = await ScheduleModel.query()
        .where(scheduleColumn, user.id)
        .andWhere('date', date)
        .andWhere((query) => {
          query
            .whereBetween('start_time', [start_time, end_time])
            .orWhereBetween('end_time', [start_time, end_time])
            .orWhereRaw('? BETWEEN start_time AND end_time', [start_time])
            .orWhereRaw('? BETWEEN start_time AND end_time', [end_time])
        })
        .first()
        console.log(`🔎 Conflicto para el usuario ${user.id}:`, hasConflict?.toJSON())
      console.log(`🔎 Conflicto encontrado para el usuario ${user.id}:`, !!hasConflict)

      if (!hasConflict) {
        available.push(user)
        console.log(`✅ Usuario ${user.id} agregado como disponible`)
      }
    }

    console.log(`📦 Usuarios disponibles finales:`, available.map(u => u.id))

    return response.ok({
      status: 'success',
      data: available,
      msg: `Lista de ${role === 'trainer' ? 'entrenadores' : 'nutriólogos'} disponibles`,
    })
  }
}
