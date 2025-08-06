import router from '@adonisjs/core/services/router'
import MembershipsController from '#controllers/memberships_controller'
import CustomersController from '#controllers/customers_controller'
import PaymentMethodsController from '#controllers/payment_methods_controller'
import SubscriptionsController from '#controllers/subscriptions_controller'
import PaymentRequestsController from '#controllers/payment_requests_controller'
import PaymentsController from '#controllers/payments_controller'
import PromotionsController from '#controllers/promotions_controller'
import UserPaymentMethodsController from '#controllers/user_payment_methods_controller'
import UserPromotionsController from '#controllers/user_promotions_controller'

router.group(() => {
  router.get('/', [MembershipsController, 'index'])
  router.post('/', [MembershipsController, 'store'])
  router.get('/:id', [MembershipsController, 'show'])
  router.put('/:id', [MembershipsController, 'update'])
  router.delete('/:id', [MembershipsController, 'destroy'])
})
.prefix('/memberships')



router.group(() => {
  router.post('/add-payment-method', [CustomersController, 'addPaymentMethod'])
  router.get('/add-payment-method', [CustomersController, 'renderAddPaymentMethodForm'])
  router.post('/setup-intent', [CustomersController, 'setupIntent'])
  router.post('/', [CustomersController, 'create'])
  router.get('/retrieve-by-user-id', [CustomersController, 'retrieveByUserId'])
}).prefix('/customers')

router.group(() => {
  router.get('/', [PaymentMethodsController, 'index'])
  router.post('/', [PaymentMethodsController, 'store'])
  router.get('/:id', [PaymentMethodsController, 'show'])
  router.put('/:id', [PaymentMethodsController, 'update'])
  router.delete('/:id', [PaymentMethodsController, 'destroy'])
}).prefix('/payment-methods')

router.group(() => {
  router.get('/', [SubscriptionsController, 'index'])
  router.post('/', [SubscriptionsController, 'store'])
  router.get('/:id', [SubscriptionsController, 'show'])
  router.put('/:id', [SubscriptionsController, 'update'])
  router.delete('/:id', [SubscriptionsController, 'destroy'])
}).prefix('/subscriptions')

router.group(() => {
  router.get('/', [PaymentRequestsController, 'index'])
  router.post('/', [PaymentRequestsController, 'store'])
  router.get('/:id', [PaymentRequestsController, 'show'])
  router.put('/:id', [PaymentRequestsController, 'update'])
  router.delete('/:id', [PaymentRequestsController, 'destroy'])
}).prefix('/payment-requests')


router.group(() => {
  router.get('/', [PaymentsController, 'index'])
  router.post('/', [PaymentsController, 'store'])
  router.get('/:id', [PaymentsController, 'show'])
  router.put('/:id', [PaymentsController, 'update'])
  router.delete('/:id', [PaymentsController, 'destroy'])
}).prefix('/payments')

router.group(() => {
  router.get('/', [PromotionsController, 'index'])
  router.post('/', [PromotionsController, 'store'])
  router.get('/:id', [PromotionsController, 'show'])
  router.put('/:id', [PromotionsController, 'update'])
  router.delete('/:id', [PromotionsController, 'destroy'])
}).prefix('/promotions')

router.group(() => {
  router.get('/', [UserPaymentMethodsController, 'index'])
  router.post('/', [UserPaymentMethodsController, 'store'])
  router.get('/:id', [UserPaymentMethodsController, 'show'])
  router.put('/:id', [UserPaymentMethodsController, 'update'])
  router.delete('/:id', [UserPaymentMethodsController, 'destroy'])
}).prefix('/user-payment-methods')

router.group(() => {
  router.get('/', [UserPromotionsController, 'index'])
  router.post('/', [UserPromotionsController, 'store'])
  router.get('/:id', [UserPromotionsController, 'show'])
  router.put('/:id', [UserPromotionsController, 'update'])
  router.delete('/:id', [UserPromotionsController, 'destroy'])
}).prefix('/user-promotions')

