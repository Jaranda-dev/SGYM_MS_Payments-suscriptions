import vine from '@vinejs/vine'

export const storeUserPaymentMethodValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    paymentMethodId: vine.string(),
    customerId: vine.string().trim().minLength(3),
    brand: vine.string().trim().minLength(2),
    last4: vine.string().trim().minLength(4).maxLength(4),
    expMonth: vine.string().trim().minLength(1).maxLength(2),
    expYear: vine.number().min(2020),
    isDefault: vine.boolean().optional(),
  })
)

export const updateUserPaymentMethodValidator = vine.compile(
  vine.object({
    userId: vine.number().optional(),
    paymentMethodId: vine.string().optional(),
    customerId: vine.string().trim().minLength(3).optional(),
    brand: vine.string().trim().minLength(2).optional(),
    last4: vine.string().trim().minLength(4).maxLength(4).optional(),
    expMonth: vine.string().trim().minLength(1).maxLength(2).optional(),
    expYear: vine.number().min(2020).optional(),
    isDefault: vine.boolean().optional(),
  })
)
