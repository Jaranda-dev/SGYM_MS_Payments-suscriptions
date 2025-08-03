// app/models/diet.ts
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type {  HasMany } from '@adonisjs/lucid/types/relations'
import DietFood from './diet_food.js'

export default class Diet extends BaseModel {
   static table = 'diet'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @hasMany(() => DietFood)
declare dietFoods: HasMany<typeof DietFood>


}
