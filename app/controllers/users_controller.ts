import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

export default class UsersController {
  // Listar usuarios
  public async index({ auth,response }: HttpContext) {
       const user = await auth.authenticate()
       if (user.roleId !== 1) {
    return response.ok({
      status: 'success',
      data: 
        {
          id: user.id,
          email: user.email,
          role_id: user.roleId,
          is_active: user.isActive,
          last_access: user.lastAccess,
        }
      ,
      msg: 'Datos del usuario autenticado.',
    })
  }
    const users = await User.query().select('id', 'email', 'role_id', 'is_active', 'last_access')

    return response.ok({
      status: 'success',
      data: users,
      msg: 'Lista de usuarios obtenida correctamente.'
    })
  }

  // Crear usuario
  public async store({ request, response }: HttpContext) {
    const payload = request.only(['email', 'password', 'password_confirmation', 'role_id'])

    if (payload.password !== payload.password_confirmation) {
      return response.badRequest({ status: 'error', data: {}, msg: 'Las contraseñas no coinciden' })
    }

    const existingUser = await User.findBy('email', payload.email)
    if (existingUser) {
      return response.conflict({ status: 'error', data: {}, msg: 'El correo electrónico ya está registrado.' })
    }

    const user = new User()
    user.email = payload.email
    user.password = payload.password
    user.roleId = payload.role_id
    user.isActive = true
    await user.save()

    return response.created({
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        role_id: user.roleId,
        is_active: user.isActive,
        last_access: user.lastAccess,
        created_at: DateTime.now().toISO(),
      },
      msg: 'Usuario creado exitosamente.'
    })
  }

  
  public async show({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ status: 'error', data: { id: params.id }, msg: 'Usuario no encontrado.' })
    }

    return response.ok({
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        role_id: user.roleId,
        is_active: user.isActive,
        last_access: user.lastAccess,
      },
      msg: 'Datos del usuario obtenidos correctamente.'
    })
  }


  public async update({ params, request, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ status: 'error', data: { id: params.id }, msg: 'Usuario no encontrado.' })
    }

    const data = request.only(['email', 'role_id', 'is_active'])

    if (data.email && data.email !== user.email) {
      const otherUser = await User.findBy('email', data.email)
      if (otherUser && otherUser.id !== user.id) {
        return response.conflict({ status: 'error', data: { email: data.email }, msg: 'El correo electrónico ya está en uso.' })
      }
    }

    user.merge(data)
    await user.save()

    return response.ok({
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        role_id: user.roleId,
        is_active: user.isActive,
        last_access: user.lastAccess,
      },
      msg: 'Usuario actualizado correctamente.'
    })
  }


  public async destroy({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ status: 'error', data: { id: params.id }, msg: 'Usuario no encontrado.' })
    }

    await user.delete()

    return response.ok({
      status: 'success',
      data: { id: user.id },
      msg: 'Usuario eliminado correctamente.'
    })
  }
}
