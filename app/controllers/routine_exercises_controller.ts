import type { HttpContext } from '@adonisjs/core/http'
import RoutineExercise from '#models/routine_exercise'
import Routine from '#models/routine'
import Exercise from '#models/exercise'

export default class RoutineExercisesController {
  // POST /routine-exercises
  public async store({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.use('jwt').authenticate()
      const { routine_id, exercise_id } = request.only(['routine_id', 'exercise_id'])

      const routine = await Routine.query()
        .where('id', routine_id)
        .andWhere('user_id', user.id)
        .first()

      const exercise = await Exercise.find(exercise_id)

      if (!routine || !exercise) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Rutina o ejercicio no encontrada.',
        })
      }

      const routineExercise = await RoutineExercise.create({
        routineId: routine.id,
        exerciseId: exercise.id,
      })

      return response.created({
        status: 'success',
        data: {
          id: routineExercise.id,
          routine_id: routine.id,
          exercise_id: exercise.id,
        },
        msg: 'Ejercicio asignado a la rutina correctamente.',
      })
    } catch {
      return response.internalServerError({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.',
      })
    }
  }

public async index({ auth, params, response }: HttpContext) {
  try {
    console.log('▶ Iniciando consulta de ejercicios de la rutina')

    const user = await auth.use('jwt').authenticate()
    console.log('✅ Usuario autenticado:', user.id)

    const routineId = params.id
    console.log('🔍 Buscando rutina con ID:', routineId)

    const routine = await Routine.query()
      .where('id', routineId)
      .andWhere('user_id', user.id)
      .first()

    if (!routine) {
      console.warn('⚠ Rutina no encontrada para el usuario:', user.id)
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'Rutina no encontrada.',
      })
    }

    console.log('✅ Rutina encontrada:', routine.id)

    const exercises = await Exercise.query()
      .from('exercise') // Aquí está el cambio clave
      .join('routine_exercise', 'exercise.id', 'routine_exercise.exercise_id')
      .where('routine_exercise.routine_id', routine.id)
      .select(
        'exercise.id as exercise_id',
        'name',
        'description',
        'equipment_type',
        'video_url'
      )

    console.log(`✅ Se encontraron ${exercises.length} ejercicios para la rutina ${routine.id}`)

    return response.ok({
      status: 'success',
      data: exercises,
      msg: 'Ejercicios de la rutina obtenidos correctamente.',
    })
  } catch (error) {
    console.error('💥 Error inesperado:', error)

    return response.internalServerError({
      status: 'error',
      data: {},
      msg: 'Error inesperado del servidor.',
    })
  }
}



  // DELETE /routine-exercises/:id
  public async destroy({ response, params }: HttpContext) {
    try {
      const relation = await RoutineExercise.find(params.id)

      if (!relation) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Relacion no encontrada.',
        })
      }

      await relation.delete()

      return response.ok({
        status: 'success',
        data: { id: relation.id },
        msg: 'Ejercicio eliminado de la rutina correctamente.',
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
