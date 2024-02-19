import z from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import { randomUUID } from "crypto"

export async function votePoll(app: FastifyInstance) {

    app.post('/polls/:pollId/votes', async (request, reply) => {
        const voteOnPollBody = z.object({
            pollOptionId: z.string().uuid(),
            title: z.string()
        })

        const voteOnPollParams = z.object({
            pollId: z.string().uuid(),
        })

        const { pollOptionId, title } = voteOnPollBody.parse(request.body)
        const { pollId } = voteOnPollParams.parse(request.params)

        let { sessionId } = request.cookies

        if (sessionId) {
            const userPreviousVoteOnPoll = await prisma.vote.findUnique({
                where: {
                    sessionId_pollId: {
                        sessionId,
                        pollId,
                    }
                }
            })

            if (userPreviousVoteOnPoll) {
                return reply.status(400).send({message: 'you already voted on this poll'})
            }
        }

        if (!sessionId) {

            sessionId = randomUUID()

            reply.setCookie("sessionID", sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                signed: true,
                httpOnly: true,
            })
        }

        try {
            await prisma.vote.create({
                data: {
                    sessionId,
                    pollId,
                    pollOptionId,
                }
            })
        } catch (error) {
            console.error(error)
        }

        return reply.status(201).send({message: `You have voted on the option: ${title}`})
    })
}