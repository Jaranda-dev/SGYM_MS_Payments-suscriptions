// app/models/routine_exercise.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Routine from './routine.js'
import Exercise from './exercise.js'

export default class RoutineExercise extends BaseModel {
    static table = 'routine_exercise'
  @column({ isPrimary: true })
  declare id: bigint

  @column()
  declare routineId: bigint

  @column()
  declare exerciseId: bigint

  @belongsTo(() => Routine)
  declare routine: BelongsTo<typeof Routine>

  @belongsTo(() => Exercise)
  declare exercise: BelongsTo<typeof Exercise>
}
