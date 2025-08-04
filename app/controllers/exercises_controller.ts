import type { HttpContext } from '@adonisjs/core/http'
import Exercise from '#models/exercise'
import vine from '@vinejs/vine'

export default class ExercisesController {
  // Listar todos los ejercicios
  async index({ response }: HttpContext) {
    const exercises = await Exercise.all()
    return response.ok({
      status: 'success',
      data: exercises,
      msg: 'Lista de ejercicios obtenida correctamente',
    })
  }

  // Obtener ejercicio por ID
  async show({ params, response }: HttpContext) {
    const exercise = await Exercise.find(params.id)

    if (!exercise) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'Ejercicio no encontrado',
      })
    }

    return response.ok({
      status: 'success',
      data: exercise,
      msg: 'Ejercicio obtenido correctamente',
    })
  }

  // Crear ejercicio
  async store({ request, response }: HttpContext) {
    const schema = vine.object({
      name: vine.string().minLength(3),
      description: vine.string().minLength(5),
      equipment_type: vine.enum(['machine', 'dumbbell', 'other']),
      video_url: vine.string().url().optional(),
    })

    try {
      const payload = await vine.validate({ schema, data: request.all() })

      const exercise = await Exercise.create(payload)

      return response.created({
        status: 'success',
        data: exercise,
        msg: 'Ejercicio creado correctamente',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        data: error.messages ?? {},
        msg: 'Error al validar los datos del ejercicio',
      })
    }
  }

  // Actualizar ejercicio
  async update({ request, response, params }: HttpContext) {
    const schema = vine.object({
      name: vine.string().minLength(3).optional(),
      description: vine.string().minLength(5).optional(),
      equipment_type: vine.enum(['machine', 'dumbbell', 'other']).optional(),
      video_url: vine.string().url().optional(),
    })

    try {
      const payload = await vine.validate({ schema, data: request.all() })

      const exercise = await Exercise.find(params.id)

      if (!exercise) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Ejercicio no encontrado',
        })
      }

      exercise.merge(payload)
      await exercise.save()

      return response.ok({
        status: 'success',
        data: exercise,
        msg: 'Ejercicio actualizado correctamente',
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        data: error.messages ?? {},
        msg: 'Error al validar los datos',
      })
    }
  }

  // Eliminar ejercicio
  async destroy({ params, response }: HttpContext) {
    const exercise = await Exercise.find(params.id)

    if (!exercise) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'Ejercicio no encontrado',
      })
    }

    await exercise.delete()

    return response.ok({
      status: 'success',
      data: {},
      msg: 'Ejercicio eliminado correctamente',
    })
  }
}
