import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Membership from './membership.js'

export default class Subscription extends BaseModel {
  static table = 'subscription'

  @column({ isPrimary: true }) declare id: number
  @column() declare userId: number
  @column() declare membershipId: number
  @column.dateTime() declare startDate: DateTime
  @column.dateTime() declare endDate: DateTime
  @column() declare status: 'active' | 'cancelled' | 'expired'

  @belongsTo(() => User) declare user: BelongsTo<typeof User>
  @belongsTo(() => Membership) declare membership: BelongsTo<typeof Membership>

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
