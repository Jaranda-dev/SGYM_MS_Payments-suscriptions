import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import PaymentMethod from './payment_method.js'
import { DateTime } from 'luxon'

export default class UserPaymentMethod extends BaseModel {
  static table = 'user_payment_method'

  @column({ isPrimary: true }) declare id: number
  @column() declare userId: number
  @column() declare paymentMethodId: string
  @column() declare customerId: string
  @column() declare brand: string
  @column({ columnName: 'last4' }) declare last4: string
  @column() declare expMonth: string
  @column() declare expYear: number
  @column() declare isDefault: boolean

 @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User) declare user: BelongsTo<typeof User>
  @belongsTo(() => PaymentMethod) declare paymentMethod: BelongsTo<typeof PaymentMethod>
}
