import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import PaymentRequest from './payment_request.js'
import PaymentMethod from './payment_method.js'

export default class Payment extends BaseModel {

  static table = 'payment'

  @column({ isPrimary: true }) declare id: number
  @column() declare userId: number
  @column() declare paymentRequestId: number
  @column() declare paymentMethodId: number
  @column() declare amount: number
  @column() declare status: 'success' | 'failed'

  @belongsTo(() => User) declare user: BelongsTo<typeof User>
  @belongsTo(() => PaymentRequest) declare paymentRequest: BelongsTo<typeof PaymentRequest>
  @belongsTo(() => PaymentMethod) declare paymentMethod: BelongsTo<typeof PaymentMethod>
}
