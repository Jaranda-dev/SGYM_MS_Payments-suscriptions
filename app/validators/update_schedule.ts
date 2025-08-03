import vine from '@vinejs/vine'

export const updateScheduleValidator = vine.compile(
  vine.object({
    start_time: vine.string().regex(/^\d{2}:\d{2}$/),
    end_time: vine.string().regex(/^\d{2}:\d{2}$/),
  })
)

export default updateScheduleValidator
