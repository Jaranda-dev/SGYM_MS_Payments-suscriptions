import { BaseModel, column } from '@adonisjs/lucid/orm'


export default class Membership extends BaseModel {
  static table = 'membership'
  
  @column({ isPrimary: true }) declare id: number
  @column() declare name: string
  @column() declare durationDays: number
  @column() declare price: number
}
