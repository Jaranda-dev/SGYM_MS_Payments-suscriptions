
import { BaseModel, column } from '@adonisjs/lucid/orm'
import SoftDelete from './Traits/soft_delete.js'

export default class UserAddress extends SoftDelete(BaseModel) {
   static table = 'user_address' 
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
