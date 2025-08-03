import vine from '@vinejs/vine'

export const storeNutritionistScheduleValidator = vine.compile(
  vine.object({
    user_id: vine.number(),
    nutritionist_id: vine.number(),
    date: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/), // formato YYYY-MM-DD
    start_time: vine.string().regex(/^\d{2}:\d{2}$/),  // formato HH:mm
    end_time: vine.string().regex(/^\d{2}:\d{2}$/),
  })
)

export const updateNutritionistScheduleValidator = vine.compile(
  vine.object({
    date: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    start_time: vine.string().regex(/^\d{2}:\d{2}$/),
    end_time: vine.string().regex(/^\d{2}:\d{2}$/),
  })
)
