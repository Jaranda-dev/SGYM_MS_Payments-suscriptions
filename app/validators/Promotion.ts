import vine from '@vinejs/vine'

export const storePromotionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    discount: vine.number().min(0),
    membershipId: vine.number(),
  })
)

export const updatePromotionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).optional(),
    discount: vine.number().min(0).optional(),
    membershipId: vine.number().optional(),
  })
)
