import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Promotion from './promotion.js'
import SoftDelete from './Traits/soft_delete.js'
import { DateTime as LuxonDateTime } from 'luxon'

export default class UserPromotion extends SoftDelete(BaseModel) {
  static table = 'user_promotion'

  @column({ isPrimary: true }) declare id: number
  @column() declare userId: number
  @column() declare promotionId: number
@column.dateTime({ columnName: 'applied_at' })
declare appliedAt: LuxonDateTime

@column.dateTime({ columnName: 'expired_at' })
declare expiredAt: LuxonDateTime
  @belongsTo(() => User) declare user: BelongsTo<typeof User>
  @belongsTo(() => Promotion) declare promotion: BelongsTo<typeof Promotion>
}
