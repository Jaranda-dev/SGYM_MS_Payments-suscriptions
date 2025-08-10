import vine from '@vinejs/vine'

export const storeMembershipValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    durationDays: vine.number().positive(),
    price: vine.number().positive(),
  })
)

export const updateMembershipValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).optional(),
    durationDays: vine.number().positive().optional(),
    price: vine.number().positive().optional(),
  })
)
