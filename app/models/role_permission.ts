
import { BaseModel, column } from '@adonisjs/lucid/orm'
import SoftDelete from './Traits/soft_delete.js'

export default class RolePermission extends SoftDelete(BaseModel) {
   static table = 'role_permission'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roleId: number

  @column()
  declare permissionId: number
}
