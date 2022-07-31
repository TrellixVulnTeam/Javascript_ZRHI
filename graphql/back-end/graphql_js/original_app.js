const {ApolloServer} = require('apollo-server-express');
const {ApolloServerPluginDrainHttpServer} = require('apollo-server-core');
const express = require('express');
const http = require('http');
const {WebSocketServer} = require('ws');
const {useServer} = require('graphql-ws/lib/use/ws');
const typeDefs = require('./type_defs/Schema');
const resolvers = require('./resolvers/resolvers');
const {makeExecutableSchema} = require('@graphql-tools/schema');
const cors = require('cors')
const router = require('./routes/index')

async function startApolloServer(typeDefs, resolvers) {
    try {
        /********************************************************************/
        // Required logic for integrating with Express
        const app = express();
        app.use(cors())

        // Hide the fact this is an express server
        // app.disable('x-powered-by')
        //
        // //parses incoming requests with JSON payloads
        // app.use(express.json({strict: true}))

        // routes
        // app.use('/', router)

        /* IF REQUESTS FALL THROUGH HERE WE SERVE TWO CUSTOM MESSAGES FOR 404 AND 500 */
        // Custom 404
        // app.use((req, res, next) => {
        //     res.status(404).send("Sorry can't find that!")
        // })
        //
        // // Custom 500
        // app.use((err, req, res, next) => {
        //     console.error(err.stack)
        //     res.status(500).send('Something broke!')
        // })

        /********************************************************************/
        const httpServer = http.createServer(app);

        // SCHEMA
        const schema = makeExecutableSchema({typeDefs, resolvers})

        // Create Web Socket
        const wsServer = new WebSocketServer({
            server: httpServer,
            path: '/graphql'
        });

        //  console.log(`webSock: ${JSON.stringify(wsServer, null, 1)}`);

        const serverCleanup = useServer({schema}, wsServer);

        // Same ApolloServer initialization as before, plus the drain plugin.
        const server = new ApolloServer({
            schema,
            plugins: [
                ApolloServerPluginDrainHttpServer({httpServer}),
                {
                    async serverWillStart() {
                        return {
                            async drainServer() {
                                await serverCleanup.dispose();
                            }
                        }
                    }
                }
            ],
        });

        await server.start()
        server.applyMiddleware({app});

        const PORT = 4000;
        // Now that our HTTP server is fully set up, we can listen to it.
        httpServer.listen(PORT, () => {
            console.log(
                `App started on port ${PORT}`
            )
            console.log(
                `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
            );
            console.log(
                `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
            );
        });
    } catch (error) {
        console.error('ERR', error)
    }
}


startApolloServer(typeDefs, resolvers).then(r => {
});