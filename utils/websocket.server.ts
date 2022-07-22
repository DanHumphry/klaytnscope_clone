import { ethers } from 'ethers';
import { IncomingMessage } from 'http';
import { Queue } from 'utils/commonJS';
import { WebSocketServer, WebSocket } from 'ws';
import Caver from 'caver-js';

declare interface PACKET_LAYAR {
    type: string;
    data: any;
}

const cypressEN = 'https://public-node-api.klaytnapi.com/v1/cypress';
const cypressWSEN = 'wss://public-node-api.klaytnapi.com/v1/cypress/ws';
const baobabEN = 'https://public-node-api.klaytnapi.com/v1/baobab';
const baobabWSEN = 'wss://public-node-api.klaytnapi.com/v1/baobab/ws';

(async function () {
    const caver = new Caver(baobabWSEN);
    const currentBlockNumber = await caver.klay.getBlockNumber();
    const res = await caver.klay.getBlockWithConsensusInfo(currentBlockNumber);
    console.log(res);

    // const provider = new ethers.providers.WebSocketProvider(baobabWSEN);
    //
    // setInterval(() => {
    //     provider.getBlockNumber();
    // }, 10000);
    //
    // provider.on('block', (e) => {
    //     console.log(e);
    // });
})();

interface Block {
    number: number;
    timestamp: number;
    totalTx: number;
    proposer: string;
    reward: string;
    gasUsed: string;
    proposerName: string;
    txs: {
        txHash: string;
        timestamp: number;
        from: string;
        status: number;
        txCategory: string;
        fromName: string;
        toName: string;
    };
}

class WebSocketServerModel {
    private readonly wss: WebSocketServer = new WebSocketServer({ port: 3001 });

    private block: Block[] = [];
    private queue: Queue = new Queue();

    constructor() {
        this.initServerEventHandler();
    }

    private initServerEventHandler = () => {
        this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
            this.initClientEventHandlers(ws).open();
            this.initClientEventHandlers(ws).close();
            this.initClientEventHandlers(ws).message();
            this.initClientEventHandlers(ws).error();

            const _packet: PACKET_LAYAR = {
                type: 'connected',
                data: 'connected',
            };

            ws.send(JSON.stringify(_packet));
        });
    };

    private pong = (ws: WebSocket, data: PACKET_LAYAR) => {
        const _packet: PACKET_LAYAR = {
            type: 'pong',
            data: data.data,
        };

        ws.send(JSON.stringify(_packet));
    };

    public sendMessage = (ws: WebSocket, type: string, data: any) => {
        if (ws.readyState !== ws.OPEN) {
            console.log('** WebSocket is not Open **');
            new Error('** WebSocket is Close **');
            return;
        }

        const _packet: PACKET_LAYAR = {
            type: type,
            data: data,
        };

        ws.send(JSON.stringify(_packet));
    };

    public broadcast = (_type: string, _data: any) => {
        const _packet: PACKET_LAYAR = {
            type: _type,
            data: _data,
        };
        this.wss?.clients.forEach(function each(client: { send: (arg0: string) => void }) {
            client.send(JSON.stringify(_packet));
        });
    };

    private initClientEventHandlers = (ws: WebSocket) => {
        return {
            message: () =>
                ws.on('message', async (data: any, isBinary: boolean) => {
                    const _data: PACKET_LAYAR = JSON.parse(data);

                    switch (_data.type) {
                        case 'ping':
                            this.pong(ws, _data);
                            break;

                        default:
                            break;
                    }
                }),

            open: () =>
                ws.on('open', () => {
                    console.log(`client open`);
                }),

            close: () =>
                ws.on('close', (code: number, reason: Buffer) => {
                    console.log(`Disconnect Client (${code}) ${reason.toString()}]`);
                }),

            error: () =>
                ws.on('error', (err: Error) => {
                    console.log(`client error`);
                }),
        };
    };
}

export default new WebSocketServerModel();
