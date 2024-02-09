import fastify from "fastify"
const app = fastify()

app.get('/hello', async (request, reply) => {
    reply.send('hello')
})

app.listen({ port:3333 }).then(() => {
    console.log('http server running');
})
