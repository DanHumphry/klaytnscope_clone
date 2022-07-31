import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

import blockRouter from './routes/block';
import WebSocketServerModel from './socket/websocket.server';

const app = express();

app.use(
    cors({
        methods: ['GET', 'POST'],
        origin: true,
        credentials: true,
    }),
);

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use('/block', blockRouter);

app.get('/', function (req: any, res: { send: (arg0: string) => void }) {
    res.send('Websocket Server root endpoint');
});

const httpServer = http.createServer(app);
export const wss: WebSocketServerModel = new WebSocketServerModel({
    server: httpServer,
});

httpServer.listen(3001, async function () {
    console.log('Websocket Server On');
});
