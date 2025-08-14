import type { HttpContext } from '@adonisjs/core/http'
import StripeService from '#services/stripe_service'



export default class StripeWebhooksController  {
  public async handle({ request, response }: HttpContext) {
    try {
      const signature = request.header('stripe-signature')
      if (!signature) {
        return response.badRequest({ error: 'Falta la firma de Stripe' })
      }

      const rawBody = request.raw()
      if (!rawBody) {
        return response.badRequest({ error: 'El cuerpo de la solicitud está vacío' })
      }
      const bufferBody = Buffer.from(rawBody, 'utf8')
      await StripeService.handleWebhook(bufferBody, signature)

      return response.ok({ received: true })
    } catch (error) {
      console.error(error)
      return response.badRequest({ error: 'Webhook inválido' })
    }
  }
}
