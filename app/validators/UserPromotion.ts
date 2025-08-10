import vine from '@vinejs/vine'

export const storeUserPromotionValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    promotionId: vine.number(),
  })
)

export const updateUserPromotionValidator = vine.compile(
  vine.object({
    userId: vine.number().optional(),
    promotionId: vine.number().optional(),
  })
)
