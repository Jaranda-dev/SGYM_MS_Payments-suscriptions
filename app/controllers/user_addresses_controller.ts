import type { HttpContext } from '@adonisjs/core/http'
import UserAddress from '#models/user_address'

export default class UserAddressesController {
  // Listar direcciones por perfil
  public async index({ params, response }: HttpContext) {
    const profileId = Number(params.profile_id)
    if (isNaN(profileId)) {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'El parámetro profile_id es inválido o no fue proporcionado.'
      })
    }

    const addresses = await UserAddress.query().where('profile_id', profileId)

    return response.ok({
      status: 'success',
      data: addresses,
      msg: 'Direcciones obtenidas correctamente.'
    })
  }

  // Crear nueva dirección
  public async store({ params, request, response }: HttpContext) {
    const profileId = Number(params.profile_id)
    if (isNaN(profileId)) {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'El parámetro profile_id es inválido o no fue proporcionado.'
      })
    }

    const payload = request.only(['street', 'city', 'state', 'country', 'postal_code'])
    const missing = ['street', 'city', 'state', 'country', 'postal_code'].filter(key => !payload[key])

    if (missing.length) {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: `Faltan campos obligatorios: ${missing.join(', ')}.`
      })
    }

    const address = await UserAddress.create({
      profileId,
      street: payload.street,
      city: payload.city,
      state: payload.state,
      country: payload.country,
      postalCode: payload.postal_code
    })

    return response.created({
      status: 'success',
      data: {
        id: address.id,
        profile_id: profileId,
        street: address.street,
        city: address.city,
        state: address.state,
        country: address.country,
        postal_code: address.postalCode
      },
      msg: 'Dirección registrada correctamente.'
    })
  }

  // Mostrar una dirección por ID
  public async show({ params, response }: HttpContext) {
    const id = Number(params.id)
    if (isNaN(id)) {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'El parámetro id es inválido o no fue proporcionado.'
      })
    }

    const address = await UserAddress.find(id)

    if (!address) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'Dirección no encontrada.'
      })
    }

    return response.ok({
      status: 'success',
      data: {
        id: address.id,
        profile_id: address.profileId,
        street: address.street,
        city: address.city,
        state: address.state,
        country: address.country,
        postal_code: address.postalCode
      },
      msg: 'Dirección obtenida correctamente.'
    })
  }

  // Actualizar dirección
  public async update({ params, request, response }: HttpContext) {
    const id = Number(params.id)
    if (isNaN(id)) {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'El parámetro id es inválido o no fue proporcionado.'
      })
    }

    const address = await UserAddress.find(id)

    if (!address) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'Dirección no encontrada.'
      })
    }

    const payload = request.only(['street', 'city', 'state', 'country', 'postal_code'])

    address.merge({
      street: payload.street ?? address.street,
      city: payload.city ?? address.city,
      state: payload.state ?? address.state,
      country: payload.country ?? address.country,
      postalCode: payload.postal_code ?? address.postalCode
    })

    await address.save()

    return response.ok({
      status: 'success',
      data: {
        id: address.id,
        profile_id: address.profileId,
        street: address.street,
        city: address.city,
        state: address.state,
        country: address.country,
        postal_code: address.postalCode
      },
      msg: 'Dirección actualizada correctamente.'
    })
  }

  // Eliminar dirección
  public async destroy({ params, response }: HttpContext) {
    const id = Number(params.id)
    if (isNaN(id)) {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'El parámetro id es inválido o no fue proporcionado.'
      })
    }

    const address = await UserAddress.find(id)

    if (!address) {
      return response.notFound({
        status: 'error',
        data: {},
        msg: 'Dirección no encontrada.'
      })
    }

    await address.delete()

    return response.ok({
      status: 'success',
      data: { id: address.id },
      msg: 'Dirección eliminada correctamente.'
    })
  }
}
