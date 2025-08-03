// app/models/user_rutine.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Routine from './routine.js'

export default class UserRutine extends BaseModel {
    static table = 'user_rutine'
  @column({ isPrimary: true })
  declare id: bigint

  @column()
  declare day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'everyday'

  @column()
  declare userId: bigint

  @column()
  declare routineId: bigint

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Routine)
  declare routine: BelongsTo<typeof Routine>
}
