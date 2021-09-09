import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import {createServer} from 'http';
import {Server} from 'colyseus';
import {PrivateRoom} from './rooms/private.room';
import {WebSocketTransport} from '@colyseus/ws-transport';
import {SocialColyseusApp} from '@social-colyseus/server';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const server = createServer(app);

const gameServer = new Server({
    transport: new WebSocketTransport({
        server,
    }),
});

const socialApp = new SocialColyseusApp(gameServer, {
    database: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        pass: process.env.DB_PASS,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
    },
});
app.use('/', express.static('src/static'));
app.use(socialApp.httpHandler(['/']));
socialApp.defineRoom('privateRoom', PrivateRoom);

gameServer.listen(5567, '0.0.0.0').finally();
