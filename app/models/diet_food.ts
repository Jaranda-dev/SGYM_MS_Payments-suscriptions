// app/models/diet_food.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Diet from './diet.js'
import Food from './food.js'

export default class DietFood extends BaseModel {
    static table = 'diet_food'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare dietId: number

  @column()
  declare foodId: number

  @belongsTo(() => Diet)
  declare diet: BelongsTo<typeof Diet>

  @belongsTo(() => Food)
  declare food: BelongsTo<typeof Food>
}
