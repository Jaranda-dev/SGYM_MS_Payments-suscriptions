import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import PaymentMethod from './payment_method.js'
import Payment from './payment.js'

export default class PaymentRequest extends BaseModel {
  static table = 'payment_request'

  @column({ isPrimary: true }) declare id: number
  @column() declare userId: number
  @column() declare paymentMethodId: number
  @column() declare externalReference: string
  @column() declare amount: number
  @column() declare currency: string
  @column() declare status: string
  @column() declare description: string
  @column() declare metadata: string
  @column.dateTime() declare createdAt: DateTime
  @column.dateTime() declare updatedAt: DateTime

  @belongsTo(() => User) declare user: BelongsTo<typeof User>
  @belongsTo(() => PaymentMethod) declare paymentMethod: BelongsTo<typeof PaymentMethod>
  @hasMany(() => Payment) declare payments: HasMany<typeof Payment>
}
