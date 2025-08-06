import vine from '@vinejs/vine'

export const storePaymentValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    paymentRequestId: vine.number(),
    paymentMethodId: vine.number(),
    amount: vine.number(),
    status: vine.enum(['success', 'failed'])
  })

)

export const updatePaymentValidator = vine.compile(
  vine.object({
    userId: vine.number().optional(),
    paymentRequestId: vine.number().optional(),
    paymentMethodId: vine.number().optional(),
    amount: vine.number().optional(),
    status: vine.enum(['success', 'failed']).optional()
  })

)





