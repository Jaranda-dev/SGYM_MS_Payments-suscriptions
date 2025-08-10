import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import PaymentRequest from './payment_request.js'
import Subscription from './subscription.js'

export default class Payment extends BaseModel {
  static table = 'payment'

  @column({ isPrimary: true }) declare id: number
  @column() declare paymentRequestId: number
  @column() declare subscriptionId: number
  @column() declare amount: number
  @column.date() declare paymentDate: DateTime
  @column() declare concept: string
  @column() declare status: string
  @column.dateTime() declare createdAt: DateTime

  @belongsTo(() => PaymentRequest) declare paymentRequest: BelongsTo<typeof PaymentRequest>
  @belongsTo(() => Subscription) declare subscription: BelongsTo<typeof Subscription>
}
