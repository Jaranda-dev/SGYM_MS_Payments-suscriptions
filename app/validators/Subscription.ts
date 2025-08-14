import vine from '@vinejs/vine'

export const storeSubscriptionValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    membershipId: vine.number(),
    paymentMethodId: vine.number().optional(),
  })
)

export const updateSubscriptionValidator = vine.compile(
  vine.object({
    userId: vine.number().optional(),
    membershipId: vine.number().optional(),
    startDate: vine.date().optional(),
    endDate: vine.date().optional(),
    status: vine.enum(['active', 'cancelled', 'expired']).optional(),
    isRenewable: vine.boolean().optional(),
  })
)
