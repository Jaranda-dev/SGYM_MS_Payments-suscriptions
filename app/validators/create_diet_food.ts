// app/validators/create_diet_food_validator.ts
import vine from '@vinejs/vine'

export const createDietFoodValidator = vine.compile(
  vine.object({
    food_ids: vine.array(vine.number()).minLength(1),
  })
)
