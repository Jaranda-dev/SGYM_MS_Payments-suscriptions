import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'
import ProfilesController from '#controllers/profiles_controller'
import OccupanciesController from '#controllers/occupancies_controller'
import RolsController from '#controllers/rols_controller'
import PermissionsController from '#controllers/permissions_controller'
import RolePermissionsController from '#controllers/role_permissions_controller'
import UserAddressesController from '#controllers/user_addresses_controller'



// Instancias de controladores
const usersController = new UsersController()
const profilesController = new ProfilesController()
const occupanciesController = new OccupanciesController()
const roles = new RolsController()
const permissions = new PermissionsController()
const rolePerms = new RolePermissionsController()
const addresses = new UserAddressesController()

import { middleware } from './kernel.js'


// -------------------------
// Usuarios
// -------------------------

// Listar usuarios
router.get('/users', async (ctx) => usersController.index(ctx)).use(middleware.auth())

// Crear usuario
router.post('/users', async (ctx) => usersController.store(ctx)).use(middleware.auth())

// Obtener usuario por ID
router.get('/users/:id', async (ctx) => usersController.show(ctx)).use(middleware.auth())

// Actualizar usuario
router.put('/users/:id', async (ctx) => usersController.update(ctx)).use(middleware.auth())


router.delete('/users/:id', async (ctx) => usersController.destroy(ctx)).use(middleware.auth())

// -------------------------
// Perfiles
// -------------------------

// Crear perfil
router.post('/users/profile', async (ctx) => profilesController.store(ctx)).use(middleware.auth())

// Obtener perfil
router.get('/users/:id/profile', async (ctx) => profilesController.show(ctx)).use(middleware.auth())

// Actualizar perfil
router.put('/users/:id/profile', async (ctx) => profilesController.update(ctx)).use(middleware.auth())

// Eliminar perfil
router.delete('/users/:id/profile', async (ctx) => profilesController.destroy(ctx)).use(middleware.auth())

// -------------------------
// Ocupación
// -------------------------

// Listar ocupación (con filtros opcionales)
router.get('/occupancy', async (ctx) => occupanciesController.index(ctx)).use(middleware.auth())

// Registrar ocupación
router.post('/occupancy', async (ctx) => occupanciesController.store(ctx)).use(middleware.auth())



router.get('/roles', (ctx) => roles.index(ctx)).use(middleware.auth())
router.get('/roles/:id', (ctx) => roles.show(ctx)).use(middleware.auth())
router.post('/roles', (ctx) => roles.store(ctx)).use(middleware.auth())
router.put('/roles/:id', (ctx) => roles.update(ctx)).use(middleware.auth())
router.delete('/roles/:id', (ctx) => roles.destroy(ctx)).use(middleware.auth())




router.get('/permissions', async (ctx) => permissions.index(ctx)).use(middleware.auth())
router.get('/permissions/:id', async (ctx) => permissions.show(ctx)).use(middleware.auth())
router.post('/permissions', async (ctx) => permissions.store(ctx)).use(middleware.auth())
router.put('/permissions/:id', async (ctx) => permissions.update(ctx)).use(middleware.auth())
router.delete('/permissions/:id', async (ctx) => permissions.destroy(ctx)).use(middleware.auth())



router.post('/roles/:role_id/permissions', async (ctx) => rolePerms.assign(ctx)).use(middleware.auth())
router.delete('/roles/:role_id/permissions/:permission_id', async (ctx) => rolePerms.remove(ctx)).use(middleware.auth())



router.get('/profiles/:profile_id/addresses', async (ctx) => addresses.index(ctx)).use(middleware.auth())
router.post('/profiles/:profile_id/addresses', async (ctx) => addresses.store(ctx)).use(middleware.auth())
router.get('/addresses/:id', async (ctx) => addresses.show(ctx)).use(middleware.auth())
router.put('/addresses/:id', async (ctx) => addresses.update(ctx)).use(middleware.auth())
router.delete('/addresses/:id', async (ctx) => addresses.destroy(ctx)).use(middleware.auth())
