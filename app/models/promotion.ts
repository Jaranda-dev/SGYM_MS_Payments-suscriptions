import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import UserPromotion from './user_promotion.js'

export default class Promotion extends BaseModel {
  static table = 'promotion'

  @column({ isPrimary: true }) declare id: number
  @column() declare name: string
  @column() declare discount: number
  @column() declare startDate: DateTime
  @column() declare endDate: DateTime

  @hasMany(() => UserPromotion) declare userPromotions: HasMany<typeof UserPromotion>

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
