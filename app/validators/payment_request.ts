import vine from '@vinejs/vine'

export const storePaymentRequestValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    subscriptionId: vine.number(),
    amount: vine.number(),
    currency: vine.string().trim().minLength(3).maxLength(3),
    status: vine.enum(['pending', 'completed', 'failed'])

  })

)

export const updatePaymentRequestValidator = vine.compile(
  vine.object({
    userId: vine.number().optional(),
    subscriptionId: vine.number().optional(),
    amount: vine.number().optional(),
    currency: vine.string().trim().minLength(3).maxLength(3).optional(),
    status: vine.enum(['pending', 'completed', 'failed']).optional()
  })

)




