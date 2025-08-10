import type { HttpContext } from '@adonisjs/core/http'

import StripeService from "#services/stripe_service";


export default class CustomersController {
    /**
     * Creates a new customer in Stripe.
     * @param {HttpContext} ctx - The HTTP context.
     * @param {string} email - The email of the customer.
     * @param {string} name - The name of the customer.
     * @returns {Promise<any>} - The created customer object.
     */
     async create({ request }: HttpContext) {
        const email = request.input('email')
        const name = request.input('name')
        const user_id = request.input('user_id')

        if (!email || !name || !user_id) {
            throw new Error('Email, name, and user_id are required to create a customer.')
        }

        return await StripeService.createCustomer(email, name, user_id)
    }

    /**
     * Retrieves a customer by user ID.
     * @param {HttpContext} ctx - The HTTP context.
     * @param {number} user_id - The user ID associated with the customer.
     * @returns {Promise<any>} - The customer object if found, otherwise null.
     */
     async retrieveByUserId({ request }: HttpContext) {
        const user_id = request.input('user_id')

        if (!user_id) {
            throw new Error('user_id is required to retrieve a customer.')
        }

        return await StripeService.retrieveCustomerByUserId(user_id)
    }

     async addPaymentMethod({ request }: HttpContext) {
        const { customerId, paymentMethodId } = request.only(['customerId', 'paymentMethodId'])
        await StripeService.addPaymentMethod(customerId, paymentMethodId)
        return { success: true }
    }

     async setupIntent({ response  ,auth}: HttpContext) {
        try {
            const user = auth.user
            if (!user) {
                return response.unauthorized({
                    status: 'error',
                    msg: 'User not authenticated.',
                })
            }
            const userCustomer = await StripeService.retrieveCustomerByUserId(user.id)
            if (!userCustomer) {
                return response.notFound({
                    status: 'error',
                    msg: 'Customer not found for the authenticated user.',
                })
            }

            const setupIntent = await StripeService.SetupIntent(['card'], userCustomer.id, String(user.id))
            return response.ok({
                status: 'success',
                data: { client_secret: setupIntent.client_secret },
            msg: 'Setup intent created successfully.',
          })
        }
        catch (error) {
          return response.internalServerError({
            status: 'error',
            msg: 'Error creating setup intent.',
            data: error.message || error,
          })
        }
      }

}