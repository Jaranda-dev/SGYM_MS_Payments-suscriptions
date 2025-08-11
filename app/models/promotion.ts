import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Membership from './membership.js'
import UserPromotion from './user_promotion.js'
import SoftDelete from './Traits/soft_delete.js'

export default class Promotion extends SoftDelete(BaseModel) {
  static table = 'promotion'

  @column({ isPrimary: true }) declare id: number
  @column() declare name: string
  @column() declare discount: number
  @column({ columnName: 'membership_id' }) declare membershipId: number
  @column() declare stripeCouponId: string


  @belongsTo(() => Membership) declare membership: BelongsTo<typeof Membership>
  @hasMany(() => UserPromotion) declare userPromotions: HasMany<typeof UserPromotion>
}
