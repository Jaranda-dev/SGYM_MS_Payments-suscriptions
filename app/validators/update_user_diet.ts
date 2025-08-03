// app/validators/update_user_diet_validator.ts
import vine from '@vinejs/vine'

export const updateUserDietValidator = vine.compile(
  vine.object({
    diet_id: vine.number().positive().optional(),
    day: vine.enum([
      'monday', 'tuesday', 'wednesday',
      'thursday', 'friday', 'saturday',
      'sunday', 'everyday',
    ]).optional(),
  })
)
