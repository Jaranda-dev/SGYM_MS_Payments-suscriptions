import type { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'

export default class RolsController {
  
  public async index({ response }: HttpContext) {
    try {
      const roles = await Role.all()
      return response.ok({
        status: 'success',
        data: roles,
        msg: 'Lista de roles obtenida correctamente.'
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor'
      })
    }
  }

  
  public async show({ params, response }: HttpContext) {
    try {
      const role = await Role.find(params.id)
      if (!role) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Rol no encontrado.'
        })
      }

      return response.ok({
        status: 'success',
        data: role,
        msg: 'Rol obtenido correctamente.'
      })
    } catch {
      return response.internalServerError({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor'
      })
    }
  }


  public async store({ request, response }: HttpContext) {
    const { name, description } = request.only(['name', 'description'])

    if (!name || !description) {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'Datos inválidos. Verifique los campos ingresados.'
      })
    }

    const existing = await Role.findBy('name', name)
    if (existing) {
      return response.conflict({
        status: 'error',
        data: {},
        msg: 'El nombre del rol ya existe.'
      })
    }

    const role = await Role.create({ name, description })

    return response.created({
      status: 'success',
      data: role,
      msg: 'Rol creado exitosamente.'
    })
  }

  
  public async update({ params, request, response }: HttpContext) {
    const { name, description } = request.only(['name', 'description'])

    const role = await Role.find(params.id)
    if (!role) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'Rol no encontrado.'
      })
    }

   
    const existing = await Role.query()
      .where('name', name)
      .andWhereNot('id', role.id)
      .first()

    if (existing) {
      return response.conflict({
        status: 'error',
        data: {},
        msg: 'El nombre del rol ya existe.'
      })
    }

    role.name = name
    role.description = description
    await role.save()

    return response.ok({
      status: 'success',
      data: role,
      msg: 'Rol actualizado correctamente.'
    })
  }

  
  public async destroy({ params, response }: HttpContext) {
    const role = await Role.find(params.id)
    if (!role) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'Rol no encontrado.'
      })
    }

    await role.delete()

    return response.ok({
      status: 'success',
      data: {},
      msg: 'Rol eliminado correctamente.'
    })
  }
}
