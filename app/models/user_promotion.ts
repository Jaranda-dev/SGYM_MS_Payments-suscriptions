import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Promotion from './promotion.js'
import SoftDelete from './Traits/soft_delete.js'

export default class UserPromotion extends SoftDelete(BaseModel) {
  static table = 'user_promotion'

  @column({ isPrimary: true }) declare id: number
  @column() declare userId: number
  @column() declare promotionId: number

  @belongsTo(() => User) declare user: BelongsTo<typeof User>
  @belongsTo(() => Promotion) declare promotion: BelongsTo<typeof Promotion>
}
