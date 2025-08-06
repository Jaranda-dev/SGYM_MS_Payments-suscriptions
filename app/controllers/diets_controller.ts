import type { HttpContext } from '@adonisjs/core/http'
import Diet from '#models/diet'
import { storeDietValidator } from '#validators/store_diet'
import { updateDietValidator } from '#validators/update_diet'
import User from '#models/user'

export default class DietsController {
  async index({ response }: HttpContext) {
    const diets = await Diet.all()
    return response.ok({ status: 'success', data: diets, msg: 'Lista de dietas obtenida correctamente.' })
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(storeDietValidator)
    const diet = await Diet.create(data)
    return response.created({ status: 'success', data: diet, msg: 'Dieta creada correctamente.' })
  }

  async update({ request, response, params }: HttpContext) {
    const data = await request.validateUsing(updateDietValidator)
    const diet = await Diet.find(params.id)

    if (!diet) {
      return response.notFound({ status: 'error', data: {}, msg: 'Dieta no encontrada.' })
    }

    diet.merge(data)
    await diet.save()

    return response.ok({ status: 'success', data: diet, msg: 'Dieta actualizada correctamente.' })
  }

  async show({ response, params }: HttpContext) {
    const diet = await Diet.find(params.id)

    if (!diet) {
      return response.notFound({ status: 'error', data: {}, msg: 'Dieta no encontrada.' })
    }

    return response.ok({ status: 'success', data: diet, msg: 'Dieta obtenida correctamente.' })
  }

  async destroy({ response, params }: HttpContext) {
    const diet = await Diet.find(params.id)

    if (!diet) {
      return response.notFound({ status: 'error', data: {}, msg: 'Dieta no encontrada.' })
    }

    await diet.delete()
    return response.ok({ status: 'success', data: { id: diet.id }, msg: 'Dieta eliminada correctamente.' })
  }

  async myDiets({ auth, response }: HttpContext) {
    console.log('myDiets called')
    const userauth = auth.user!
    const user = await User.find(userauth.id)
    if (!user) {
      return response.notFound({ status: 'error', data: {}, msg: 'Usuario no encontrado.' })
    }
    console.log(user.id)
    await user.load('userDiets')
    await Promise.all(user.userDiets.map(async (ud) => await ud.load('diet')))

    const formatted = user.userDiets.map((ud) => ({
      id: ud.diet.id,
      name: ud.diet.name,
      description: ud.diet.description,
      day: ud.day,
    }))

    return response.ok({ status: 'success', data: formatted, msg: 'Lista de dietas obtenida correctamente.' })
  }
}
