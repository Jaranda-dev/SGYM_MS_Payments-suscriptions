import router from '@adonisjs/core/services/router'
import MembershipsController from '#controllers/memberships_controller'

router.group(() => {
  router.get('/', [MembershipsController, 'index'])
  router.post('/', [MembershipsController, 'store'])
  router.get('/:id', [MembershipsController, 'show'])
  router.put('/:id', [MembershipsController, 'update'])
  router.delete('/:id', [MembershipsController, 'destroy'])
})
.prefix('/memberships')

