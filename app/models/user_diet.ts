// app/models/user_diet.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import User from '#models/user'
import Diet from '#models/diet'

export default class UserDiet extends BaseModel {
  static table = 'user_diet'      // Tu tabla real

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'diet_id' })
  declare dietId: number

  @column()
  declare day:
    | 'monday' | 'tuesday' | 'wednesday'
    | 'thursday' | 'friday' | 'saturday'
    | 'sunday' | 'everyday'

  /* ───── Relaciones ───── */
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Diet)
  declare diet: BelongsTo<typeof Diet>
}
