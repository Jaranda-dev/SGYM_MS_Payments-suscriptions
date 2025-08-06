import vine from '@vinejs/vine'

export const storeUserPaymentMethodValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    paymentMethodId: vine.number(),
    externalId: vine.string().trim().minLength(3),
    brand: vine.string().trim().minLength(3),
    last4: vine.string().trim().minLength(4).maxLength(4)
  })

)

export const updateUserPaymentMethodValidator = vine.compile(
  vine.object({
    userId: vine.number().optional(),
    paymentMethodId: vine.number().optional(),
    externalId: vine.string().trim().minLength(3).optional(),
    brand: vine.string().trim().minLength(3).optional(),
    last4: vine.string().trim().minLength(4).maxLength(4).optional()
  })

)



