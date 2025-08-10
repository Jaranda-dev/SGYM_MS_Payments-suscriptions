import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Membership from './membership.js'
import Payment from './payment.js'

export default class Subscription extends BaseModel {
  static table = 'subscription'

  @column({ isPrimary: true }) declare id: number
  @column() declare userId: number
  @column() declare membershipId: number
  @column() declare status: 'active' | 'expired' | 'canceled'
  @column() declare isRenewable: boolean
  @column.date() declare startDate: DateTime
  @column.date() declare endDate: DateTime
  @column.date() declare canceledAt: DateTime

  @belongsTo(() => User) declare user: BelongsTo<typeof User>
  @belongsTo(() => Membership) declare membership: BelongsTo<typeof Membership>
  @hasMany(() => Payment) declare payments: HasMany<typeof Payment>
}
