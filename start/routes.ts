import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'
import ProfilesController from '#controllers/profiles_controller'
import OccupanciesController from '#controllers/occupancies_controller'
import RolsController from '#controllers/rols_controller'
import PermissionsController from '#controllers/permissions_controller'
import RolePermissionsController from '#controllers/role_permissions_controller'
import UserAddressesController from '#controllers/user_addresses_controller'
import ExercisesController from '#controllers/exercises_controller'
const RoutinesController = () => import('#controllers/routines_controller')
const UserRoutineController = () => import('#controllers/user_routines_controller')



// Instancias de controladores
const usersController = new UsersController()
const profilesController = new ProfilesController()
const occupanciesController = new OccupanciesController()
const roles = new RolsController()
const permissions = new PermissionsController()
const rolePerms = new RolePermissionsController()
const addresses = new UserAddressesController()
const exercise = new ExercisesController()


import { middleware } from './kernel.js'
import RoutineExercisesController from '#controllers/routine_exercises_controller'


// -------------------------
// Usuarios
// -------------------------

// Listar usuarios
router.get('/users', async (ctx) => usersController.index(ctx)).use(middleware.auth()).use(middleware.checkPermission(['view_users']))

// Crear usuario
router.post('/users', async (ctx) => usersController.store(ctx)).use(middleware.auth()).use(middleware.checkPermission(['create_users']))

// Obtener usuario por ID
router.get('/users/:id', async (ctx) => usersController.show(ctx)).use(middleware.auth()).use(middleware.checkPermission(['view_users']))

// Actualizar usuario
router.put('/users/:id', async (ctx) => usersController.update(ctx)).use(middleware.auth()).use(middleware.checkPermission(['edit_users']))


router.delete('/users/:id', async (ctx) => usersController.destroy(ctx)).use(middleware.auth()).use(middleware.checkPermission(['delete_users']))

// -------------------------
// Perfiles
// -------------------------

// Crear perfil
router.post('/users/profile', async (ctx) => profilesController.store(ctx)).use(middleware.auth()).use(middleware.checkPermission(['edit_profile']))

// Obtener perfil
router.get('/users/:id/profile', async (ctx) => profilesController.show(ctx)).use(middleware.auth()).use(middleware.checkPermission(['view_profile']))

// Actualizar perfil
router.put('/users/:id/profile', async (ctx) => profilesController.update(ctx)).use(middleware.auth()).use(middleware.checkPermission(['edit_profile']))

// Eliminar perfil
router.delete('/users/:id/profile', async (ctx) => profilesController.destroy(ctx)).use(middleware.auth()).use(middleware.checkPermission(['edit_profile']))

// -------------------------
// Ocupación
// -------------------------

// Listar ocupación (con filtros opcionales)
router.get('/occupancy', async (ctx) => occupanciesController.index(ctx)).use(middleware.auth()).use(middleware.checkPermission(['view_attendance_stats']))

// Registrar ocupación
router.post('/occupancy', async (ctx) => occupanciesController.store(ctx)).use(middleware.auth()).use(middleware.checkPermission(['view_attendance_stats']))



router.get('/roles', (ctx) => roles.index(ctx)).use(middleware.auth()).use(middleware.checkPermission(['view_roles']))
router.get('/roles/:id', (ctx) => roles.show(ctx)).use(middleware.auth()).use(middleware.checkPermission(['view_roles']))
router.post('/roles', (ctx) => roles.store(ctx)).use(middleware.auth()).use(middleware.checkPermission(['create_roles']))
router.put('/roles/:id', (ctx) => roles.update(ctx)).use(middleware.auth()).use(middleware.checkPermission(['manage_roles']))
router.delete('/roles/:id', (ctx) => roles.destroy(ctx)).use(middleware.auth()).use(middleware.checkPermission(['manage_roles']))




router.get('/permissions', async (ctx) => permissions.index(ctx)).use(middleware.auth()).use(middleware.checkPermission(['view_permissions']))
router.get('/permissions/:id', async (ctx) => permissions.show(ctx)).use(middleware.auth()).use(middleware.checkPermission(['view_permissions']))
router.post('/permissions', async (ctx) => permissions.store(ctx)).use(middleware.auth()).use(middleware.checkPermission(['create_permissions']))
router.put('/permissions/:id', async (ctx) => permissions.update(ctx)).use(middleware.auth()).use(middleware.checkPermission(['manage_permissions']))
router.delete('/permissions/:id', async (ctx) => permissions.destroy(ctx)).use(middleware.auth()).use(middleware.checkPermission(['manage_permissions']))



router.post('/roles/:role_id/permissions', async (ctx) => rolePerms.assign(ctx)).use(middleware.auth()).use(middleware.checkPermission(['manage_roles']))
router.delete('/roles/:role_id/permissions/:permission_id', async (ctx) => rolePerms.remove(ctx)).use(middleware.auth()).use(middleware.checkPermission(['manage_roles']))



router.get('/profiles/:profile_id/addresses', async (ctx) => addresses.index(ctx)).use(middleware.auth()).use(middleware.checkPermission(['view_profile']))
router.post('/profiles/:profile_id/addresses', async (ctx) => addresses.store(ctx)).use(middleware.auth()).use(middleware.checkPermission(['edit_profile']))
router.get('/addresses/:id', async (ctx) => addresses.show(ctx)).use(middleware.auth()).use(middleware.checkPermission(['view_profile']))
router.put('/addresses/:id', async (ctx) => addresses.update(ctx)).use(middleware.auth()).use(middleware.checkPermission(['edit_profile']))
router.delete('/addresses/:id', async (ctx) => addresses.destroy(ctx)).use(middleware.auth()).use(middleware.checkPermission(['edit_profile']))


router
  .group(() => {

    router.get('/', async (ctx) => exercise.index(ctx)).use(middleware.checkPermission(['view_exercises']))
    router.get('/:id', async (ctx) => exercise.show(ctx)).use(middleware.checkPermission(['view_exercises']))
    router.post('/', async (ctx) => exercise.store(ctx)).use(middleware.checkPermission(['manage_exercises']))
    router.put('/:id', async (ctx) => exercise.update(ctx)).use(middleware.checkPermission(['manage_exercises']))
    router.delete('/:id', async (ctx) => exercise.destroy(ctx)).use(middleware.checkPermission(['manage_exercises']))
  })
  .prefix('/exercises')
  .use(middleware.auth())





router.group(() => {
  router.get('/', [RoutinesController, 'index']).use(middleware.checkPermission(['view_routines']))
  router.get('/:id', [RoutinesController, 'show']).use(middleware.checkPermission(['view_routines']))
  router.post('/', [RoutinesController, 'store']).use(middleware.checkPermission(['manage_routines']))
  router.put('/:id', [RoutinesController, 'update']).use(middleware.checkPermission(['manage_routines']))
  router.delete('/:id', [RoutinesController, 'destroy']).use(middleware.checkPermission(['manage_routines']))
}).prefix('/routines').use(middleware.auth())





router.group(() => {
  router.post('/', [UserRoutineController, 'store']).use(middleware.checkPermission(['assign_user_routines']))
  router.get('/:user_id', [UserRoutineController, 'indexByUser']).use(middleware.checkPermission(['view_user_routines']))
  router.get('/', [UserRoutineController, 'indexAuth'])
  router.put('/:id', [UserRoutineController, 'update']).use(middleware.checkPermission(['manage_user_routines']))
}).prefix('/user-routines').use(middleware.auth())




const routineExercises = new RoutineExercisesController()

router.group(() => {
  router.post('/routine-exercises', async (ctx) => routineExercises.store(ctx)).use(middleware.checkPermission(['manage_routines']))
  router.get('/routines/:id/exercises', async (ctx) => routineExercises.index(ctx)).use(middleware.checkPermission(['view_routines']))
  router.delete('/routine-exercises/:id', async (ctx) => routineExercises.destroy(ctx)).use(middleware.checkPermission(['manage_routines']))
}).use(middleware.auth())



import FoodsController from '#controllers/foods_controller'


const foodsController = new FoodsController()

router.group(() => {
  router.get('/', async (ctx) => foodsController.index(ctx))
    .use(middleware.checkPermission(['view_foods']))

  router.get('/:id', async (ctx) => foodsController.show(ctx))
    .use(middleware.checkPermission(['view_foods']))

  router.post('/', async (ctx) => foodsController.store(ctx))
    .use(middleware.checkPermission(['manage_foods']))

  router.put('/:id', async (ctx) => foodsController.update(ctx))
    .use(middleware.checkPermission(['manage_foods']))

  router.delete('/:id', async (ctx) => foodsController.destroy(ctx))
    .use(middleware.checkPermission(['manage_foods']))
})
  .prefix('/foods')
  .use(middleware.auth())


  

router.group(() => {
  router.get('/diets', '#controllers/diets_controller.index').use(middleware.auth()).use(middleware.checkPermission(['view_diets']))
  router.post('/diets', '#controllers/diets_controller.store').use(middleware.auth()).use(middleware.checkPermission(['manage_diets']))
  router.put('/diets/:id', '#controllers/diets_controller.update').use(middleware.auth()).use(middleware.checkPermission(['manage_diets']))
  router.get('/diets/:id', '#controllers/diets_controller.show').use(middleware.auth()).use(middleware.checkPermission(['view_diets']))
  router.delete('/diets/:id', '#controllers/diets_controller.destroy').use(middleware.auth()).use(middleware.checkPermission(['manage_diets']))
  router.get('/user_diet', '#controllers/diets_controller.myDiets').use(middleware.auth())
})


import UserDietsController from '#controllers/user_diets_controller'

const userDiets = new UserDietsController()

router
  .group(() => {
    router.post('/user_diet', (ctx) => userDiets.store(ctx))
      .use(middleware.checkPermission(['manage_user_diets']))

    router.put('/user_diet/:id', (ctx) => userDiets.update(ctx))
      .use(middleware.checkPermission(['manage_user_diets']))

    router.delete('/user_diet/:id', (ctx) => userDiets.destroy(ctx))
      .use(middleware.checkPermission(['manage_user_diets']))
  })
  .use(middleware.auth())

  // start/routes.ts

import DietFoodsController from '#controllers/diet_foods_controller'


const dietFoods = new DietFoodsController()

router.group(() => {
  router
    .post('/diets/:diet_id/foods', async (ctx) => dietFoods.store(ctx))
    .use([middleware.auth(), middleware.checkPermission(['manage_diets'])])

  router
    .get('/diets/:diet_id/foods', async (ctx) => dietFoods.index(ctx))
    .use([middleware.auth(), middleware.checkPermission(['view_diets'])])

  router
    .delete('/diets/:diet_id/foods/:diet_food_id', async (ctx) => dietFoods.destroy(ctx))
    .use([middleware.auth(), middleware.checkPermission(['manage_diets'])])
})



import TrainerSchedulesController from '#controllers/trainer_schedules_controller'
import NutritionistSchedulesController from '#controllers/nutritionist_schedules_controller'


const controller = new TrainerSchedulesController()

router.group(() => {
  router.post('/', (ctx) => controller.store(ctx))
    .use(middleware.checkPermission(['create_trainer_schedules']))

  router.get('/', (ctx) => controller.index(ctx))
    .use(middleware.checkPermission(['view_trainer_schedules']))

  router.get('/:id', (ctx) => controller.show(ctx))
    .use(middleware.checkPermission(['view_trainer_schedules']))

  router.put('/:id', (ctx) => controller.update(ctx))
    .use(middleware.checkPermission(['update_trainer_schedules']))

  router.delete('/:id', (ctx) => controller.destroy(ctx))
    .use(middleware.checkPermission(['delete_trainer_schedules']))

  router.get('/user/token', (ctx) => controller.indexByUserAuth(ctx))

  router.get('/trainer/token', (ctx) => controller.indexByTrainerAuth(ctx))
}).prefix('/trainer-schedules').use(middleware.auth())





const nutritionistSchedulesController = new NutritionistSchedulesController()

router.group(() => {
  router.post('/', (ctx) => nutritionistSchedulesController.store(ctx))
   

  router.get('/', (ctx) => nutritionistSchedulesController.index(ctx))
   

  router.get('/:id', (ctx) => nutritionistSchedulesController.show(ctx))


  router.put('/:id', (ctx) => nutritionistSchedulesController.update(ctx))
   

  router.delete('/:id', (ctx) => nutritionistSchedulesController.destroy(ctx))
   

  router.get('/user/token', (ctx) => nutritionistSchedulesController.indexByUserAuth(ctx))
   

  router.get('/nutritionist/token', (ctx) => nutritionistSchedulesController.indexByNutritionistAuth(ctx))

}).prefix('/nutritionist-schedules').use(middleware.auth())


