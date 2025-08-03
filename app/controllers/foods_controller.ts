import type { HttpContext } from '@adonisjs/core/http'
import Food from '#models/food'
import vine from '@vinejs/vine'

const foodSchema = vine.compile(
  vine.object({
    name: vine.string().minLength(1),
    grams: vine.number().positive(),
    calories: vine.number().positive(),
    other_info: vine.string().optional(),
  })
)

export default class FoodsController {
  // Listar alimentos
  public async index({ response }: HttpContext) {
    try {
      const foods = await Food.all()
      return response.status(200).json({
        status: 'success',
        data: foods,
        msg: 'Lista de alimentos obtenida correctamente.',
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ status: 'error', data: {}, msg: 'Error inesperado del servidor.' })
    }
  }

  // Crear alimento
  public async store({ request, response }: HttpContext) {
    try {
      const payload = request.only(['name', 'grams', 'calories', 'other_info'])
      const data = await foodSchema.validate(payload)

      const food = await Food.create(data)

      return response.status(201).json({
        status: 'success',
        data: food,
        msg: 'Alimento creado correctamente.',
      })
    } catch (error) {
      console.error(error)
      if (error.isVine) {
        return response.status(400).json({ status: 'error', data: {}, msg: 'Datos inválidos. Verifique los campos ingresados.' })
      }
      return response.status(500).json({ status: 'error', data: {}, msg: 'Error inesperado del servidor.' })
    }
  }

  // Obtener alimento por ID
  public async show({ params, response }: HttpContext<{ params: { id: string } }>) {
    try {
      const food = await Food.find(params.id)
      if (!food) {
        return response.status(404).json({ status: 'error', data: {}, msg: 'Alimento no encontrado.' })
      }
      return response.status(200).json({ status: 'success', data: food, msg: 'Alimento obtenido correctamente.' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ status: 'error', data: {}, msg: 'Error inesperado del servidor.' })
    }
  }

  // Actualizar alimento
  public async update({ params, request, response }: HttpContext<{ params: { id: string } }>) {
    try {
      const food = await Food.find(params.id)
      if (!food) {
        return response.status(404).json({ status: 'error', data: {}, msg: 'Alimento no encontrado.' })
      }

      const payload = request.only(['name', 'grams', 'calories', 'other_info'])
      const data = await foodSchema.validate(payload)

      food.merge(data)
      await food.save()

      return response.status(200).json({ status: 'success', data: food, msg: 'Alimento actualizado correctamente.' })
    } catch (error) {
      console.error(error)
      if (error.isVine) {
        return response.status(400).json({ status: 'error', data: {}, msg: 'Datos inválidos. Verifique los campos ingresados.' })
      }
      return response.status(500).json({ status: 'error', data: {}, msg: 'Error inesperado del servidor.' })
    }
  }

  // Eliminar alimento
  public async destroy({ params, response }: HttpContext<{ params: { id: string } }>) {
    try {
      const food = await Food.find(params.id)
      if (!food) {
        return response.status(404).json({ status: 'error', data: {}, msg: 'Alimento no encontrado.' })
      }
      await food.delete()
      return response.status(200).json({ status: 'success', data: { id: food.id }, msg: 'Alimento eliminado correctamente.' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ status: 'error', data: {}, msg: 'Error inesperado del servidor.' })
    }
  }
}
