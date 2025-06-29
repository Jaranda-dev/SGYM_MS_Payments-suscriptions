import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Occupancy extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime()
  declare recordedAt: DateTime

  @column()
  declare level: 'low' | 'medium' | 'high'

  @column()
  declare peopleCount: number | null

}
