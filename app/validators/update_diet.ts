import vine from '@vinejs/vine'

export const updateDietValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    description: vine.string().optional(),
  })
)
