import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import SoftDelete from './Traits/soft_delete.js'

export default class UserQrCode extends SoftDelete(BaseModel) {


  static table = 'user_qr_code'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare qrToken: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}