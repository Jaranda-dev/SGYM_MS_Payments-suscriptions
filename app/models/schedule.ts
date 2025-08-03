import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import User from '#models/user'

export default class Schedule extends BaseModel {
    static table = 'schedule'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare startTime: string

  @column()
  declare endTime: string


  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
