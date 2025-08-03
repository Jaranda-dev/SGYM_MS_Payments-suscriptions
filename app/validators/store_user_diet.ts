// app/validators/store_user_diet_validator.ts
import vine from '@vinejs/vine'

export const storeUserDietValidator = vine.compile(
  vine.object({
    diet_id: vine.number().positive(),
    user_id: vine.number().positive(),
    day: vine.enum([
      'monday', 'tuesday', 'wednesday',
      'thursday', 'friday', 'saturday',
      'sunday', 'everyday',
    ]),
  })
)
