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
    public static async create({ request }: HttpContext) {
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
    public static async retrieveByUserId({ request }: HttpContext) {
        const user_id = request.input('user_id')

        if (!user_id) {
            throw new Error('user_id is required to retrieve a customer.')
        }

        return await StripeService.retrieveCustomerByUserId(user_id)
    }

    public static async addPaymentMethod({ request }: HttpContext) {
        const { customerId, paymentMethodId } = request.only(['customerId', 'paymentMethodId'])
        await StripeService.addPaymentMethod(customerId, paymentMethodId)
        return { success: true }
    }

    public static async renderAddPaymentMethodForm({ view }: HttpContext) {
        return view.render('addpayment_method')
    }

    public static async setupIntent({ response }: HttpContext) {
        const setupIntent = await StripeService.SetupIntent()
        console.log('Setup Intent:', setupIntent)
        return response.json({ client_secret: setupIntent.client_secret })
    }
   
}