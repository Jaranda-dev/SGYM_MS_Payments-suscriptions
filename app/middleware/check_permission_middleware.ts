import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#models/user'

export default class CheckPermissionMiddleware {
  async handle(ctx: HttpContext, next: NextFn, guards: string[]) {
    const { auth, response } = ctx

    const requiredPermission = guards[0]

    await auth.use('jwt').authenticate()
    const user = auth.user as User

    await user.preload('role', (roleQuery) => {
      roleQuery.preload('permission')
    })

    const rolePermissions = user.role.permission.map((p) => p.name)

    if (!rolePermissions.includes(requiredPermission)) {
      return response.unauthorized({
        message: 'No tienes permiso para acceder a esta ruta.',
      })
    }

    await next()
  }
}
