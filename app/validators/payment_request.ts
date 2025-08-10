import vine from '@vinejs/vine'

export const storePaymentRequestValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    paymentMethodId: vine.number(),
    externalReference: vine.string().trim().minLength(3),
    amount: vine.number(),
    currency: vine.string().trim().maxLength(3).minLength(3),
    status: vine.enum(['pending', 'completed', 'failed']),
    description: vine.string().maxLength(255).optional(),
    metadata: vine.string().optional(),
  })
)

export const updatePaymentRequestValidator = vine.compile(
  vine.object({
    userId: vine.number().optional(),
    paymentMethodId: vine.number().optional(),
    externalReference: vine.string().trim().minLength(3).optional(),
    amount: vine.number().optional(),
    currency: vine.string().trim().maxLength(3).minLength(3).optional(),
    status: vine.enum(['pending', 'completed', 'failed']).optional(),
    description: vine.string().maxLength(255).optional(),
    metadata: vine.string().optional(),
  })
)
