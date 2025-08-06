import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import PaymentMethod from './payment_method.js'

export default class UserPaymentMethod extends BaseModel {
  static table = 'user_payment_method'

  @column({ isPrimary: true }) declare id: number
  @column() declare userId: number
  @column() declare paymentMethodId: number
  @column() declare externalId: string // Stripe ID, PayPal token, etc.
  @column() declare brand: string
  @column() declare last4: string

  @belongsTo(() => User) declare user: BelongsTo<typeof User>
  @belongsTo(() => PaymentMethod) declare paymentMethod: BelongsTo<typeof PaymentMethod>
}
