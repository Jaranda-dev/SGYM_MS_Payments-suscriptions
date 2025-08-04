
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class RolePermission extends BaseModel {
   static table = 'role_permission'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roleId: number

  @column()
  declare permissionId: number
}
