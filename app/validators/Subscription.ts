import vine from '@vinejs/vine'

export const storeSubscriptionValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    membershipId: vine.number(),
    startDate: vine.date(),
    endDate: vine.date(),
    status: vine.enum(['active', 'cancelled', 'expired']),
    isRenewable: vine.boolean().optional(),
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
