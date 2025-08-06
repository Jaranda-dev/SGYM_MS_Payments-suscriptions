import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PaymentMethod extends BaseModel {
  static table = 'payment_method'

  @column({ isPrimary: true }) declare id: number
  @column() declare name: string // e.g., "card", "paypal", "stripe", etc.
}
