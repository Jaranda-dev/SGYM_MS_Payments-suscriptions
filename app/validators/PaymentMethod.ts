import vine from '@vinejs/vine'

export const storePaymentMethodValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    code: vine.string().trim().minLength(2),
    description: vine.string().optional(),
    isActive: vine.boolean().optional(),
  })
)

export const updatePaymentMethodValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).optional(),
    code: vine.string().trim().minLength(2).optional(),
    description: vine.string().optional(),
    isActive: vine.boolean().optional(),
  })
)
