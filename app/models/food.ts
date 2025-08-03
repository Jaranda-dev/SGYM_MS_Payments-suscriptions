import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import DietFood from './diet_food.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Food extends BaseModel {
  static table = 'food'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare grams: number

  @column()
  declare calories: number

  @column()
  declare other_info?: string

  @hasMany(() => DietFood)
declare dietFoods: HasMany<typeof DietFood>

}
