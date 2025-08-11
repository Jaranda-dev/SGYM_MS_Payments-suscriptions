import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Subscription from './subscription.js'
import Promotion from './promotion.js'

export default class Membership extends BaseModel {
  static table = 'membership'

  @column({ isPrimary: true }) declare id: number
  @column() declare name: string
  @column({ columnName: 'duration_days' }) declare durationDays: number
  @column() declare price: number
  @column() declare stripePriceId: string
  @column() declare stripeProductId: string
  @hasMany(() => Subscription) declare subscriptions: HasMany<typeof Subscription>
  @hasMany(() => Promotion) declare promotions: HasMany<typeof Promotion>
}
