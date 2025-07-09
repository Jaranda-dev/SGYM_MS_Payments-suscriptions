import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Routine extends BaseModel {
  static table = 'routine'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'everyday'

  @column()
  declare name: string

  @column()
  declare description?: string

  @column({ columnName: 'user_id' })
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
