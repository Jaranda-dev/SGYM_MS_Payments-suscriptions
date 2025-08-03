import vine from '@vinejs/vine'

export const storeScheduleValidator = vine.compile(
  vine.object({
    user_id: vine.number().positive(),
    start_time: vine.string().regex(/^\d{2}:\d{2}$/),
    end_time: vine.string().regex(/^\d{2}:\d{2}$/),
  })
)

export default storeScheduleValidator
