import { FastifyReply, FastifyRequest } from "fastify"
import { ZodObject, ZodRawShape } from "zod"

export class ZodValidationHandler<T extends ZodRawShape> {
  constructor(private schema: ZodObject<T>) {}

  async bodyHandle(request: FastifyRequest, reply: FastifyReply) {
    const result = this.schema.safeParse(request.body)

    if (!result.success) {
      return reply.status(400).send({
        message: "Invalid request",
        issues: result.error.issues,
      })
    }

    request.body = result.data
  }

  async queryHandle(request: FastifyRequest, reply: FastifyReply) {
    const result = this.schema.safeParse(request.query)
    if (!result.success) {
      return reply.status(400).send({
        message: "Invalid query",
        issues: result.error.issues,
      })
    }

    request.query = result.data
  }
}
