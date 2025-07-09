import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Exercise from '#models/exercise'
import Routine from '#models/routine'

export default class RoutineExercise extends BaseModel {
  static table = 'routine_exercise'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'exercise_id' })
  declare exerciseId: number

  @column({ columnName: 'routine_id' })
  declare routineId: number

  @belongsTo(() => Exercise)
  declare exercise: BelongsTo<typeof Exercise>

  @belongsTo(() => Routine)
  declare routine: BelongsTo<typeof Routine>
}
