import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class NutritionistSchedule extends BaseModel {
  static table = 'nutritionist_schedule'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare nutritionist_id: number

  @column()
  declare date: string

  @column()
  declare start_time: string

  @column()
  declare end_time: string
}
