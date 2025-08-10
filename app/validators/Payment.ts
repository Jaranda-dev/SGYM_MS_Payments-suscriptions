import vine from '@vinejs/vine'

export const storePaymentValidator = vine.compile(
  vine.object({
    paymentRequestId: vine.number(),
    subscriptionId: vine.number(),
    amount: vine.number(),
    paymentDate: vine.date(),
    concept: vine.string().maxLength(200).optional(),
    status: vine.enum(['pending', 'processing', 'success', 'failed', 'canceled']),
  })
)

export const updatePaymentValidator = vine.compile(
  vine.object({
    paymentRequestId: vine.number().optional(),
    subscriptionId: vine.number().optional(),
    amount: vine.number().optional(),
    paymentDate: vine.date().optional(),
    concept: vine.string().maxLength(200).optional(),
    status: vine.enum(['pending', 'processing', 'success', 'failed', 'canceled']).optional(),
  })
)
