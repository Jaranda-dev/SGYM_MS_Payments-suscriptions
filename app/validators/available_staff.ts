import vine from '@vinejs/vine'

export const availableStaffValidator = vine.compile(
  vine.object({
    role: vine.enum(['trainer', 'nutritionist']),
    date: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    start_time: vine.string().regex(/^\d{2}:\d{2}$/),
    end_time: vine.string().regex(/^\d{2}:\d{2}$/),
  })
)
