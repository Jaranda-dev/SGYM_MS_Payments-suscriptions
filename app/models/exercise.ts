import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Exercise extends BaseModel {
  static table = 'exercise'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description?: string

  @column()
  declare equipmentType: 'machine' | 'dumbbell' | 'other'

  @column()
  declare videoUrl?: string
}
