import vine from '@vinejs/vine'

export const storeUserPromotionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    userId: vine.number(),
    promotionId: vine.number()
  })

)

export const updateUserPromotionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).optional(),
    userId: vine.number().optional(),
    promotionId: vine.number().optional()
  })

)





