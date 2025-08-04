import type { HttpContext } from '@adonisjs/core/http'
import Profile from '#models/profile'
import { DateTime } from 'luxon'
import User from '#models/user'


export default class ProfilesController {
  // Crear perfil
  public async store({ request, response }: HttpContext) {
    const payload = request.only([
      'user_id',
      'full_name',
      'phone',
      'birth_date',
      'gender',
      'photo_url'
    ])

    // Verificar si el usuario ya tiene un perfil
    const existingProfile = await Profile.findBy('userId', payload.user_id)
    if (existingProfile) {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'El usuario ya tiene un perfil asociado.'
      })
    }

    // Validaciones de los datos proporcionados
    const errors: any = {}

    if (!payload.full_name) {
      errors.full_name = 'El nombre completo es obligatorio.'
    }

    if (payload.phone && !/^\d{10}$/.test(payload.phone)) {
      errors.phone = 'El número de teléfono debe tener 10 dígitos.'
    }

    const birthDate = DateTime.fromISO(payload.birth_date)
    if (!birthDate.isValid) {
      errors.birth_date = 'La fecha de nacimiento debe tener el formato YYYY-MM-DD.'
    }

    if (!['M', 'F', 'Other'].includes(payload.gender)) {
      errors.gender = "El valor debe ser 'M', 'F' o 'Other'."
    }

    if (Object.keys(errors).length > 0) {
      return response.badRequest({
        status: 'error',
        data: errors,
        msg: 'Error de validación en los datos proporcionados.'
      })
    }

    // Crear perfil si las validaciones pasan
    const profile = await Profile.create({
      userId: payload.user_id,
      fullName: payload.full_name,
      phone: payload.phone,
      birthDate,
      gender: payload.gender,
      photoUrl: payload.photo_url
    })

    return response.created({
      status: 'success',
      data: {
        id: profile.id,
        user_id: profile.userId,
        full_name: profile.fullName,
        phone: profile.phone,
        birth_date: profile.birthDate.toISODate(),
        gender: profile.gender,
        photo_url: profile.photoUrl
      },
      msg: 'Perfil creado correctamente.'
    })
  }

  // Obtener perfil
  public async show({ params, response }: HttpContext) {
    const profile = await Profile.findBy('userId', params.id)

    if (!profile) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'No se encontró el perfil para el usuario especificado.'
      })
    }

    return response.ok({
      status: 'success',
      data: {
        user_id: profile.userId,
        full_name: profile.fullName,
        phone: profile.phone,
        birth_date: profile.birthDate.toISODate(),
        gender: profile.gender,
        photo_url: profile.photoUrl
      },
      msg: 'Perfil del usuario obtenido correctamente.'
    })
  }

  // Actualizar perfil
  public async update({ params, request, response }: HttpContext) {
    const profile = await Profile.findBy('userId', params.id)

    if (!profile) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'No se encontró el perfil para el usuario especificado.'
      })
    }

    const payload = request.only([
      'full_name',
      'phone',
      'birth_date',
      'gender',
      'photo_url'
    ])

    const errors: any = {}

    if (!payload.full_name) {
      errors.full_name = 'El nombre completo es obligatorio.'
    }

    if (payload.phone && !/^\d{10}$/.test(payload.phone)) {
      errors.phone = 'El número de teléfono debe tener 10 dígitos.'
    }

    const birthDate = DateTime.fromISO(payload.birth_date)
    if (!birthDate.isValid) {
      errors.birth_date = 'La fecha de nacimiento debe tener el formato YYYY-MM-DD.'
    }

    if (!['M', 'F', 'Other'].includes(payload.gender)) {
      errors.gender = "El valor debe ser 'M', 'F' o 'Other'."
    }

    if (Object.keys(errors).length > 0) {
      return response.badRequest({
        status: 'error',
        data: errors,
        msg: 'Error de validación en los datos proporcionados.'
      })
    }

    profile.fullName = payload.full_name
    profile.phone = payload.phone
    profile.birthDate = birthDate
    profile.gender = payload.gender
    profile.photoUrl = payload.photo_url
    await profile.save()

    return response.ok({
      status: 'success',
      data: {
        user_id: profile.userId,
        full_name: profile.fullName,
        phone: profile.phone,
        birth_date: profile.birthDate.toISODate(),
        gender: profile.gender,
        photo_url: profile.photoUrl,
      
      },
      msg: 'Perfil actualizado correctamente.'
    })
  }

  // Eliminar perfil
  public async destroy({ params, response }: HttpContext) {
    const profile = await Profile.findBy('userId', params.id)

    if (!profile) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'No se encontró el perfil para el usuario especificado.'
      })
    }

    await profile.delete()

    return response.ok({
      status: 'success',
      data: {
        user_id: profile.userId
      },
      msg: 'Perfil eliminado correctamente.'
    })
  }
  
 public async index({ auth, response }: HttpContext) {
    try {
      // Autenticar usuario
      const authUser = await auth.authenticate()
      
      // Cargar rol del usuario autenticado
      const userWithRole = await User.query()
        .where('id', authUser.id)
        .preload('role')
        .firstOrFail()
      
      const roleId = userWithRole.role.id
      
      let profilesQuery = Profile.query()
        .preload('user', (query) => {
          query.preload('role')
        })

      if (roleId === 1) {
        // admin: trae todos
        // profilesQuery ya sin filtro
      } else if (roleId === 2) {
        // manager: todos excepto admin y manager
        profilesQuery = profilesQuery.whereHas('user', (query) => {
          query.whereNotIn('role_id', [1, 2])
        })
      } else if ([3, 6, 4].includes(roleId)) {
        // trainer, nutritionist, receptionist: solo usuarios normales (role_id = 5)
        profilesQuery = profilesQuery.whereHas('user', (query) => {
          query.where('role_id', 5)
        })
      } else {
        // Otros roles: sin acceso
        return response.forbidden({
          status: 'error',
          data: {},
          msg: 'No tiene permiso para acceder a esta lista de perfiles.',
        })
      }
      
      const profiles = await profilesQuery.exec()

      if (profiles.length === 0) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'No se encontraron perfiles para mostrar.',
        })
      }

      // Mapear para respuesta (opcional)
      const data = profiles.map(profile => ({
        user_id: profile.userId,
        full_name: profile.fullName,
        phone: profile.phone,
        birth_date: profile.birthDate?.toISODate(),
        gender: profile.gender,
        photo_url: profile.photoUrl,
      }))

      return response.ok({
        status: 'success',
        data,
        msg: 'Perfiles obtenidos correctamente.',
      })
      
    } catch (error) {
      console.error('Error al obtener perfiles:', error)
      return response.status(500).json({
        status: 'error',
        data: {},
        msg: 'Error inesperado del servidor',
      })
    }
  }
}
