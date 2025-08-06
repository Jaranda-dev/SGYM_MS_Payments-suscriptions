import vine from '@vinejs/vine'

export const storePaymentMethodValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3)
  })

)

export const updatePaymentMethodValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3)
  })

)




