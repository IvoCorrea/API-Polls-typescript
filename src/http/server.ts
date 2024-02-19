import fastify from "fastify"
import cookie from "@fastify/cookie"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"
import { createPoll } from "./routes/create-polls"
import { getPoll } from "./routes/get-polls"
import { votePoll } from "./routes/vote-on-polls"

const app = fastify()
const prisma = new PrismaClient

app.register(cookie, {
    secret: "NLW-Ivo",
    hook: "onRequest",
})
app.register(createPoll)
app.register(getPoll)
app.register(votePoll)

app.listen({ port:3333 }).then(() => {
    console.log('http server running')
})
