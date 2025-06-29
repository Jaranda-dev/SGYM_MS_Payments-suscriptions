
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserAddress extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare profileId: number

  @column()
  declare street: string

  @column()
  declare city: string

  @column()
  declare state: string

  @column()
  declare country: string

  @column()
  declare postalCode: string
}
