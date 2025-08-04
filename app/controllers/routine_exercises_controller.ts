import type { HttpContext } from '@adonisjs/core/http'
import RoutineExercise from '#models/routine_exercise'
import Routine from '#models/routine'
import Exercise from '#models/exercise'
import vine from '@vinejs/vine'

export default class RoutineExercisesController {
  /**
   * Asignar ejercicio a rutina
   * POST /routine-exercises
   */
public async store({ request, response }: HttpContext) {
  try {
    const validator = vine.compile(
      vine.object({
        routine_id: vine.number().positive(),
        exercise_id: vine.number().positive(),
      })
    )

    const payload = request.only(['routine_id', 'exercise_id'])
    const data = await validator.validate(payload)

    const routine = await Routine.find(data.routine_id)
    const exercise = await Exercise.find(data.exercise_id)

    if (!routine || !exercise) {
      return response.status(404).json({
        status: 'error',
        data: {},
        msg: 'Rutina o ejercicio no encontrada.',
      })
    }

    const relation = await RoutineExercise.create({
      routineId: data.routine_id,
      exerciseId: data.exercise_id,
    })

    return response.status(201).json({
      status: 'success',
      data: {
        id: relation.id,
        routine_id: relation.routineId,
        exercise_id: relation.exerciseId,
      },
      msg: 'Ejercicio asignado a la rutina correctamente.',
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


  /**
   * Listar ejercicios de una rutina
   * GET /routines/:id/exercises
   */
  public async index({ params, response }: HttpContext) {
    try {
      const routineId = Number(params.id)
      const routine = await Routine.find(routineId)

      if (!routine) {
        return response.status(404).json({
          status: 'error',
          data: {},
          msg: 'Rutina no encontrada.'
        })
      }

      const relations = await RoutineExercise.query()
        .where('routine_id', routineId)
        .preload('exercise')

    

      return response.status(200).json({
        status: 'success',
        data:relations,
        msg: 'Ejercicios de la rutina obtenidos correctamente.'
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.'
      })
    }
  }

  /**
   * Quitar ejercicio de una rutina
   * DELETE /routine-exercises/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const relation = await RoutineExercise.find(params.id)

      if (!relation) {
        return response.status(404).json({
          status: 'error',
          data: {},
          msg: 'Relación no encontrada.'
        })
      }

      await relation.delete()

      return response.status(200).json({
        status: 'success',
        data: {
          id: relation.id
        },
        msg: 'Ejercicio eliminado de la rutina correctamente.'
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.'
      })
    }
  }
}
