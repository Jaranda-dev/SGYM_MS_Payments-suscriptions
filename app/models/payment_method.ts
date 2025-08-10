import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import PaymentRequest from './payment_request.js'
import UserPaymentMethod from './user_payment_method.js'

export default class PaymentMethod extends BaseModel {
  static table = 'payment_method'

  @column({ isPrimary: true }) declare id: number
  @column() declare code: string
  @column() declare name: string
  @column() declare description: string
  @column() declare isActive: boolean

  @hasMany(() => PaymentRequest) declare paymentRequests: HasMany<typeof PaymentRequest>
  @hasMany(() => UserPaymentMethod) declare userMethods: HasMany<typeof UserPaymentMethod>
}
