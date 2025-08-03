import type { HttpContext } from '@adonisjs/core/http'
import UserDiet from '#models/user_diet'
import User from '#models/user'
import Diet from '#models/diet'

import { storeUserDietValidator } from '#validators/store_user_diet'
import { updateUserDietValidator } from '#validators/update_user_diet'

export default class UserDietsController {
  /**
   * Crear asignación
   * POST /user_diet
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(storeUserDietValidator)

      /* Verificamos que usuario y dieta existan */
      const [user, diet] = await Promise.all([
        User.find(data.user_id),
        Diet.find(data.diet_id),
      ])

      if (!user || !diet) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Usuario o dieta no encontrados.',
        })
      }

      const assignment = await UserDiet.create({
        userId: data.user_id,
        dietId: data.diet_id,
        day: data.day,
      })

      return response.created({
        status: 'success',
        data: assignment,
        msg: 'Dieta asignada exitosamente.',
      })
    } catch (error) {
      if (error.isVineException) {
        return response.badRequest({
          status: 'error',
          data: {},
          msg: 'Datos inválidos. Verifique los campos ingresados.',
        })
      }
      console.error(error)
      return response.status(500).json({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.',
      })
    }
  }

  /**
   * Actualizar asignación
   * PUT /user_diet/:id
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const assignment = await UserDiet.find(params.id)
      if (!assignment) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Asignación no encontrada.',
        })
      }

      const data = await request.validateUsing(updateUserDietValidator)

      if (data.diet_id) {
        const diet = await Diet.find(data.diet_id)
        if (!diet) {
          return response.notFound({
            status: 'error',
            data: {},
            msg: 'Dieta no encontrada.',
          })
        }
        assignment.dietId = data.diet_id
      }

      if (data.day) assignment.day = data.day
      await assignment.save()

      return response.ok({
        status: 'success',
        data: assignment,
        msg: 'Dieta actualizada correctamente.',
      })
    } catch (error) {
      if (error.isVineException) {
        return response.badRequest({
          status: 'error',
          data: {},
          msg: 'Datos inválidos. Verifique los campos ingresados.',
        })
      }
      console.error(error)
      return response.status(500).json({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.',
      })
    }
  }

  /**
   * Eliminar asignación
   * DELETE /user_diet/:id
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const assignment = await UserDiet.find(params.id)
      if (!assignment) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Asignación no encontrada.',
        })
      }
      await assignment.delete()
      return response.ok({
        status: 'success',
        data: null,
        msg: 'Dieta eliminada correctamente.',
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
}
