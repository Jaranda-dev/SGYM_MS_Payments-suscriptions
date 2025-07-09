import type { HttpContext } from '@adonisjs/core/http'
import Exercise from '#models/exercise'

export default class ExercisesController {
  // GET /exercises
  public async index({ response }: HttpContext) {
    try {
      const exercises = await Exercise.all()
      return response.ok({
        status: 'success',
        data: exercises,
        msg: 'Lista de ejercicios obtenida correctamente.',
      })
    } catch {
      return response.internalServerError({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.',
      })
    }
  }

  // GET /exercises/:id
  public async show({ params, response }: HttpContext) {
    try {
      const exercise = await Exercise.find(params.id)
      if (!exercise) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Ejercicio no encontrado.',
        })
      }

      return response.ok({
        status: 'success',
        data: exercise,
        msg: 'Ejercicio obtenido correctamente.',
      })
    } catch {
      return response.internalServerError({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.',
      })
    }
  }

  // POST /exercises
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'description', 'equipment_type', 'video_url'])
      const exercise = await Exercise.create(data)

      return response.created({
        status: 'success',
        data: exercise,
        msg: 'Ejercicio creado exitosamente.',
      })
    } catch {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'Datos inválidos. Verifique los campos ingresados.',
      })
    }
  }

  // PUT /exercises/:id
  public async update({ params, request, response }: HttpContext) {
    try {
      const exercise = await Exercise.find(params.id)
      if (!exercise) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Ejercicio no encontrado.',
        })
      }

      const data = request.only(['name', 'description', 'equipment_type', 'video_url'])
      exercise.merge(data)
      await exercise.save()

      return response.ok({
        status: 'success',
        data: exercise,
        msg: 'Ejercicio actualizado correctamente.',
      })
    } catch {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'Datos inválidos. Verifique los campos ingresados.',
      })
    }
  }

  // DELETE /exercises/:id
  public async destroy({ params, response }: HttpContext) {
    try {
      const exercise = await Exercise.find(params.id)
      if (!exercise) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Ejercicio no encontrado.',
        })
      }

      await exercise.delete()

      return response.ok({
        status: 'success',
        data: { id: exercise.id },
        msg: 'Ejercicio eliminado correctamente.',
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
