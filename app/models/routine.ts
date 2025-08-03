// app/models/routine.ts
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import RoutineExercise from './routine_exercise.js'
import UserRutine from './user_rutine.js'

export default class Routine extends BaseModel {
      static table = 'routine'

  @column({ isPrimary: true })
  declare id: bigint

  @column()
  declare name: string

  @column()
  declare description: string | null

  @hasMany(() => RoutineExercise)
  declare routineExercises: HasMany<typeof RoutineExercise>

  @hasMany(() => UserRutine)
  declare userRutines: HasMany<typeof UserRutine>
}
