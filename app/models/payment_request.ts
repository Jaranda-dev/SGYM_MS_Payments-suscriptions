import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Subscription from './subscription.js'

export default class PaymentRequest extends BaseModel {
  static table = 'payment_request'

  @column({ isPrimary: true }) declare id: number
  @column() declare userId: number
  @column() declare subscriptionId: number
  @column() declare amount: number
  @column() declare currency: string
  @column() declare status: 'pending' | 'completed' | 'failed'

  @belongsTo(() => User) declare user: BelongsTo<typeof User>
  @belongsTo(() => Subscription) declare subscription: BelongsTo<typeof Subscription>
}
