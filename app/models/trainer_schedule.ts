import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TrainerSchedule extends BaseModel {
  static table = 'trainer_schedule'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare trainerId: number

  @column.date()
  declare date: DateTime

  @column()
  declare startTime: string

  @column()
  declare endTime: string

}
