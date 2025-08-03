import vine from '@vinejs/vine'

export const storeDietValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    description: vine.string().optional(),
  })
)
