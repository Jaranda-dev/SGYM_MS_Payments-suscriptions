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

// -------------------------
// Usuarios
// -------------------------

// Listar usuarios
router.get('/users', async (ctx) => usersController.index(ctx))

// Crear usuario
router.post('/users', async (ctx) => usersController.store(ctx))

// Obtener usuario por ID
router.get('/users/:id', async (ctx) => usersController.show(ctx))

// Actualizar usuario
router.put('/users/:id', async (ctx) => usersController.update(ctx))

// Eliminar usuario
router.delete('/users/:id', async (ctx) => usersController.destroy(ctx))

// -------------------------
// Perfiles
// -------------------------

// Crear perfil
router.post('/users/profile', async (ctx) => profilesController.store(ctx))

// Obtener perfil
router.get('/users/:id/profile', async (ctx) => profilesController.show(ctx))

// Actualizar perfil
router.put('/users/:id/profile', async (ctx) => profilesController.update(ctx))

// Eliminar perfil
router.delete('/users/:id/profile', async (ctx) => profilesController.destroy(ctx))

// -------------------------
// Ocupación
// -------------------------

// Listar ocupación (con filtros opcionales)
router.get('/occupancy', async (ctx) => occupanciesController.index(ctx))

// Registrar ocupación
router.post('/occupancy', async (ctx) => occupanciesController.store(ctx))



router.get('/roles', (ctx) => roles.index(ctx))
router.get('/roles/:id', (ctx) => roles.show(ctx))
router.post('/roles', (ctx) => roles.store(ctx))
router.put('/roles/:id', (ctx) => roles.update(ctx))
router.delete('/roles/:id', (ctx) => roles.destroy(ctx))




router.get('/permissions', async (ctx) => permissions.index(ctx))
router.get('/permissions/:id', async (ctx) => permissions.show(ctx))
router.post('/permissions', async (ctx) => permissions.store(ctx))
router.put('/permissions/:id', async (ctx) => permissions.update(ctx))
router.delete('/permissions/:id', async (ctx) => permissions.destroy(ctx))



router.post('/roles/:role_id/permissions', async (ctx) => rolePerms.assign(ctx))
router.delete('/roles/:role_id/permissions/:permission_id', async (ctx) => rolePerms.remove(ctx))



router.get('/profiles/:profile_id/addresses', async (ctx) => addresses.index(ctx))
router.post('/profiles/:profile_id/addresses', async (ctx) => addresses.store(ctx))
router.get('/addresses/:id', async (ctx) => addresses.show(ctx))
router.put('/addresses/:id', async (ctx) => addresses.update(ctx))
router.delete('/addresses/:id', async (ctx) => addresses.destroy(ctx))
