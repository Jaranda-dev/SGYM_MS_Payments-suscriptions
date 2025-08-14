import type { HttpContext } from '@adonisjs/core/http'
import StripeService from '#services/stripe_service'



export default class StripeWebhooksController  {
  public async handle({ request, response }: HttpContext) {
    try {
      const signature = request.header('stripe-signature')
      if (!signature) {
        return response.badRequest({ error: 'Falta la firma de Stripe' })
      }

      // Usa el body crudo tal cual lo recibes
      const rawBody = request.raw()
      if (!rawBody) {
        return response.badRequest({ error: 'El cuerpo de la solicitud está vacío' })
      }

      // Si rawBody ya es un Buffer, pásalo directo. Si es string, pásalo directo.
      await StripeService.handleWebhook(rawBody, signature)

      return response.ok({ received: true })
    } catch (error) {
      console.error(error)
      return response.badRequest({ error: 'Webhook inválido' })
    }
  }
}
