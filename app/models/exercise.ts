// app/models/exercise.ts
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import RoutineExercise from './routine_exercise.js'

export default class Exercise extends BaseModel {
    static table = 'exercise'

  @column({ isPrimary: true })
  declare id: bigint

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare equipmentType: 'machine' | 'dumbbell' | 'other'

  @column()
  declare videoUrl: string | null

  @hasMany(() => RoutineExercise)
  declare routineExercises: HasMany<typeof RoutineExercise>
}
