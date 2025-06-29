import type { HttpContext } from '@adonisjs/core/http'
import Permission from '#models/permission'

export default class PermissionsController {
  // Listar permisos
  public async index({ response }: HttpContext) {
    const permissions = await Permission.all()
    return response.ok({
      status: 'success',
      data: permissions,
      msg: 'Lista de permisos obtenida correctamente.',
    })
  }

  // Obtener permiso por ID
  public async show({ params, response }: HttpContext) {
    const permission = await Permission.find(params.id)

    if (!permission) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'Permiso no encontrado.',
      })
    }

    return response.ok({
      status: 'success',
      data: permission,
      msg: 'Permiso obtenido correctamente.',
    })
  }

  // Crear nuevo permiso
  public async store({ request, response }: HttpContext) {
    const { name, description } = request.only(['name', 'description'])

    if (!name) {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'El nombre del permiso es obligatorio.',
      })
    }

    const exists = await Permission.findBy('name', name)
    if (exists) {
      return response.conflict({
        status: 'error',
        data: {},
        msg: 'Ya existe un permiso con ese nombre.',
      })
    }

    const permission = await Permission.create({ name, description })

    return response.created({
      status: 'success',
      data: permission,
      msg: 'Permiso creado exitosamente.',
    })
  }

  // Actualizar permiso
  public async update({ params, request, response }: HttpContext) {
    const permission = await Permission.find(params.id)

    if (!permission) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'Permiso no encontrado.',
      })
    }

    const { name, description } = request.only(['name', 'description'])

    if (!name) {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'El nombre es obligatorio.',
      })
    }

    const duplicate = await Permission
      .query()
      .where('name', name)
      .whereNot('id', permission.id)
      .first()

    if (duplicate) {
      return response.conflict({
        status: 'error',
        data: {},
        msg: 'Ya existe otro permiso con ese nombre.',
      })
    }

    permission.name = name
    permission.description = description
    await permission.save()

    return response.ok({
      status: 'success',
      data: permission,
      msg: 'Permiso actualizado correctamente.',
    })
  }

  // Eliminar permiso
  public async destroy({ params, response }: HttpContext) {
    const permission = await Permission.find(params.id)

    if (!permission) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'Permiso no encontrado.',
      })
    }

    await permission.delete()

    return response.ok({
      status: 'success',
      data: {},
      msg: 'Permiso eliminado correctamente.',
    })
  }
}
