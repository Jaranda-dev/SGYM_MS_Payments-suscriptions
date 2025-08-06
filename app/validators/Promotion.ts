import vine from '@vinejs/vine'

export const storePromotionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    discount: vine.number().min(0).optional(),
    startDate: vine.date().optional(),
    endDate: vine.date().optional()
  })

)

export const updatePromotionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).optional(),
    discount: vine.number().min(0).optional(),
    startDate: vine.date().optional(),
    endDate: vine.date().optional()
  })

)





