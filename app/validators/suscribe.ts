
import vine from '@vinejs/vine'

export const storeSuscribe = vine.compile(
  vine.object({
    PaymentMethodId: vine.number(),
  
    PromotionId: vine.number().optional(),
    MembershipId: vine.number(),
    isRenewable: vine.boolean().optional(),
  })
)



