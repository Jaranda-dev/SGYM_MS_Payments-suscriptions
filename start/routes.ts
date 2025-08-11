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
import { middleware } from './kernel.js'

router.group(() => {
  router.get('/', [MembershipsController, 'index']).use(middleware.checkPermission(['view_memberships']))
  router.post('/', [MembershipsController, 'store']).use(middleware.checkPermission(['create_memberships']))
  router.get('/:id', [MembershipsController, 'show']).use(middleware.checkPermission(['view_memberships']))
  router.put('/:id', [MembershipsController, 'update']).use(middleware.checkPermission(['edit_memberships']))
  router.delete('/:id', [MembershipsController, 'destroy']).use(middleware.checkPermission(['delete_memberships']))
})
.prefix('/memberships').use(middleware.auth())



router.group(() => {
  router.post('/add-payment-method', [CustomersController, 'addPaymentMethod']).use(middleware.checkPermission(['create_payment_methods']))
  router.post('/setup-intent', [CustomersController, 'setupIntent']).use(middleware.checkPermission(['create_payment_methods']))
  router.post('/', [CustomersController, 'create']).use(middleware.checkPermission(['create_customers']))
  router.get('/retrieve-by-user-id', [CustomersController, 'retrieveByUserId']).use(middleware.checkPermission(['view_customers']))
}).prefix('/payment-gateway').use(middleware.auth())

router.group(() => {
  router.get('/', [PaymentMethodsController, 'index']).use(middleware.checkPermission(['view_payment_methods']))
  router.post('/', [PaymentMethodsController, 'store']).use(middleware.checkPermission(['create_payment_methods']))
  router.get('/:id', [PaymentMethodsController, 'show']).use(middleware.checkPermission(['view_payment_methods']))
  router.put('/:id', [PaymentMethodsController, 'update']).use(middleware.checkPermission(['edit_payment_methods']))
  router.delete('/:id', [PaymentMethodsController, 'destroy']).use(middleware.checkPermission(['delete_payment_methods']))
}).prefix('/payment-methods').use(middleware.auth())

router.group(() => {
  router.get('/', [SubscriptionsController, 'index']).use(middleware.checkPermission(['view_subscriptions']))
  router.post('/', [SubscriptionsController, 'store']).use(middleware.checkPermission(['create_subscriptions']))
  router.get('/:id', [SubscriptionsController, 'show']).use(middleware.checkPermission(['view_subscriptions']))
  router.put('/:id', [SubscriptionsController, 'update']).use(middleware.checkPermission(['edit_subscriptions']))
  router.delete('/:id', [SubscriptionsController, 'destroy']).use(middleware.checkPermission(['delete_subscriptions']))
  router.get('/user/subscriptions', [SubscriptionsController, 'getByUser']).use(middleware.checkPermission(['view_subscriptions_user']))
  router.post('/user/subscribe', [SubscriptionsController, 'subscribe']).use(middleware.checkPermission(['create_subscriptions_user']))
}).prefix('/subscriptions').use(middleware.auth())

router.group(() => {
  router.get('/', [PaymentRequestsController, 'index']).use(middleware.checkPermission(['view_payment_requests']))
  router.post('/', [PaymentRequestsController, 'store']).use(middleware.checkPermission(['create_payment_requests']))
  router.get('/:id', [PaymentRequestsController, 'show']).use(middleware.checkPermission(['view_payment_requests']))
  router.put('/:id', [PaymentRequestsController, 'update']).use(middleware.checkPermission(['edit_payment_requests']))
  router.delete('/:id', [PaymentRequestsController, 'destroy']).use(middleware.checkPermission(['delete_payment_requests']))
}).prefix('/payment-requests').use(middleware.auth())


router.group(() => {
  router.get('/', [PaymentsController, 'index']).use(middleware.checkPermission(['view_payments']))
  router.post('/', [PaymentsController, 'store']).use(middleware.checkPermission(['create_payments']))
  router.get('/:id', [PaymentsController, 'show']).use(middleware.checkPermission(['view_payments']))
  router.put('/:id', [PaymentsController, 'update']).use(middleware.checkPermission(['edit_payments']))
  router.delete('/:id', [PaymentsController, 'destroy']).use(middleware.checkPermission(['delete_payments']))
  router.get('/user/payments', [PaymentsController, 'getPaymentsByUser']).use(middleware.checkPermission(['view_payments_user']))
}).prefix('/payments').use(middleware.auth())

router.group(() => {
  router.get('/', [PromotionsController, 'index']).use(middleware.checkPermission(['view_promotions']))
  router.post('/', [PromotionsController, 'store']).use(middleware.checkPermission(['create_promotions']))
  router.get('/:id', [PromotionsController, 'show']).use(middleware.checkPermission(['view_promotions']))
  router.put('/:id', [PromotionsController, 'update']).use(middleware.checkPermission(['edit_promotions']))
  router.delete('/:id', [PromotionsController, 'destroy']).use(middleware.checkPermission(['delete_promotions']))
  router.get('/membership/:id', [PromotionsController, 'getPromotionByMembership']).use(middleware.checkPermission(['view_promotions_membership']))
}).prefix('/promotions').use(middleware.auth())

router.group(() => {
  router.get('/', [UserPaymentMethodsController, 'index']).use(middleware.checkPermission(['view_user_payment_methods']))
  router.post('/', [UserPaymentMethodsController, 'store']).use(middleware.checkPermission(['create_user_payment_methods']))
  router.get('/:id', [UserPaymentMethodsController, 'show']).use(middleware.checkPermission(['view_user_payment_methods']))
  router.put('/:id', [UserPaymentMethodsController, 'update']).use(middleware.checkPermission(['edit_user_payment_methods']))
  router.delete('/:id', [UserPaymentMethodsController, 'destroy']).use(middleware.checkPermission(['delete_user_payment_methods']))
  router.post('/createby/payment-method-id', [UserPaymentMethodsController, 'storeByPaymentMethodId']).use(middleware.checkPermission(['create_user_payment_methods']))
  router.get('/user/default', [UserPaymentMethodsController, 'getDefault']).use(middleware.checkPermission(['view_user_payment_methods_default']))
  router.get('/user/methods', [UserPaymentMethodsController, 'getByUser']).use(middleware.checkPermission(['view_user_payment_methods_user']))
}).prefix('/user-payment-methods').use(middleware.auth())

router.group(() => {
  router.get('/', [UserPromotionsController, 'index']).use(middleware.checkPermission(['view_user_promotions']))
  router.post('/', [UserPromotionsController, 'store']).use(middleware.checkPermission(['create_user_promotions']))
  router.get('/:id', [UserPromotionsController, 'show']).use(middleware.checkPermission(['view_user_promotions']))
  router.put('/:id', [UserPromotionsController, 'update']).use(middleware.checkPermission(['edit_user_promotions']))
  router.delete('/:id', [UserPromotionsController, 'destroy']).use(middleware.checkPermission(['delete_user_promotions']))
}).prefix('/user-promotions').use(middleware.auth())

