// app/controllers/diet_foods_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Diet from '#models/diet'
import Food from '#models/food'
import DietFood from '#models/diet_food'
import { createDietFoodValidator } from '#validators/create_diet_food'

export default class DietFoodsController {
  public async store({ request, params, response }: HttpContext) {
    try {
      const { diet_id } = params
      const payload = await request.validateUsing(createDietFoodValidator)

      const diet = await Diet.find(diet_id)
      if (!diet) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Dieta no encontrada.',
        })
      }

      const insertedFoods = []

      for (const foodId of payload.food_ids) {
        const food = await Food.find(foodId)
        if (!food) {
          return response.notFound({
            status: 'error',
            data: {},
            msg: 'Dietao alimento no encontrado.',
          })
        }

        const dietFood = await DietFood.firstOrCreate({
          dietId: diet.id,
          foodId: food.id,
        })

        insertedFoods.push(dietFood)
      }

      return response.created({
        status: 'success',
        data: insertedFoods,
        msg: 'Alimentos agregados correctamente a la dieta.',
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.',
      })
    }
  }

  public async index({ params, response }: HttpContext) {
    try {
      const diet = await Diet.find(params.diet_id)
      if (!diet) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Dieta no encontrada.',
        })
      }

      await diet.load('dietFoods', (query) => {
        query.preload('food')
      })

      return response.ok({
        status: 'success',
        data: diet.dietFoods,
        msg: 'Alimentos de la dieta obtenidos correctamente.',
      })
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.',
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const dietFood = await DietFood.find(params.diet_food_id)
      if (!dietFood) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Relacion no encontrada.',
        })
      }

      await dietFood.delete()

      return response.ok({
        status: 'success',
        data: {
          id: dietFood.id,
        },
        msg: 'Alimento eliminado de la dieta correctamente.',
      })
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor.',
      })
    }
  }
}
