import type { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'
import Permission from '#models/permission'
import RolePermission from '#models/role_permission'

export default class RolePermissionsController {
  // Asignar uno o más permisos a un rol
  public async assign({ request, params, response }: HttpContext) {
    const roleId = Number(params.role_id)
    const { permissions } = request.only(['permissions'])

    if (!Array.isArray(permissions) || permissions.some(id => typeof id !== 'number')) {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'El campo "permissions" debe ser un arreglo de IDs numéricos.'
      })
    }

    const role = await Role.find(roleId)
    if (!role) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'Rol no encontrado.'
      })
    }

    // Validar que los permisos existan
    const foundPermissions = await Permission.query().whereIn('id', permissions)
    if (foundPermissions.length !== permissions.length) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'Uno o más permisos no fueron encontrados.'
      })
    }

    // Filtrar permisos ya asignados para evitar duplicados
    const existing = await RolePermission.query()
      .where('role_id', roleId)
      .whereIn('permission_id', permissions)

    const existingIds = existing.map(p => p.permissionId)
    const newPermissions = permissions.filter(id => !existingIds.includes(id))

    if (newPermissions.length === 0) {
      return response.conflict({
        status: 'error',
        data: {},
        msg: 'Todos los permisos ya están asignados al rol.'
      })
    }

    // Crear nuevas relaciones
    await RolePermission.createMany(
      newPermissions.map((id) => ({
        roleId,
        permissionId: id
      }))
    )

    return response.ok({
      status: 'success',
      data: {
        role_id: roleId,
        assigned_permissions: newPermissions
      },
      msg: 'Permisos asignados correctamente al rol.'
    })
  }

  // Eliminar un permiso de un rol
  public async remove({ params, response }: HttpContext) {
    const roleId = Number(params.role_id)
    const permissionId = Number(params.permission_id)

    const relation = await RolePermission.query()
      .where('role_id', roleId)
      .andWhere('permission_id', permissionId)
      .first()

    if (!relation) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'La relación entre el rol y el permiso no fue encontrada.'
      })
    }

    await relation.delete()

    return response.ok({
      status: 'success',
      data: {
        role_id: roleId,
        removed_permission_id: permissionId
      },
      msg: 'Permiso eliminado del rol correctamente.'
    })
  }
}
