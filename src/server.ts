import { IContext } from './interfaces/context.interface';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import environments from './config/environment';
import {ApolloServer, PubSub} from 'apollo-server-express';
import schema from './schema';
import expressPlayground from 'graphql-playground-middleware-express';
import Database from './lib/database';

// iniciar la lectura de las variables de entorno
if (process.env.NODE_ENV !== 'production'){
    const env= environments;
    console.log(env);
    
}


async function init() {
    const app = express();
    const pubsub = new PubSub();
    app.use(cors());
    app.use(compression());

    const database = new Database();
    const db = await database.init();

    const context = async ({ req, connection }: IContext) => {
        const token = req ? req.headers.authorization : connection.authorization;
        return { db, token, pubsub };
    };
    
    const server = new ApolloServer({
        schema,
        introspection: true,
        context
    });

    server.applyMiddleware({app});

    app.get('/', expressPlayground({
        endpoint: '/graphql'
    }));
    
    const httpServer = createServer(app);
    server.installSubscriptionHandlers(httpServer);
    const PORT = process.env.PORT || 2002;
    httpServer.listen(
        {
            port: PORT
        },
        () => {
            console.log(`'http://localhost:${PORT}/graphql, API MEANG - GREASER'`);
            console.log(`'ws://localhost:${PORT}/graphql, API MEANG - GREASER'`);
        }

    );
}

init();
