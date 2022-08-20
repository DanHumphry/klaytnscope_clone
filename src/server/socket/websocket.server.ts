import Caver, { TransactionForRPC } from 'caver-js';
import { Server } from 'http';
import { v4 as uuidv4 } from 'uuid';
import Web3 from 'web3';
import { BlockHeader } from 'web3-eth';
import { WebSocketServer } from 'ws';
import {
    Block,
    CLIENT_PACKET_LAYER,
    ClientMessageType,
    Networks,
    SERVER_PACKET_LAYER,
    ServerMessageType,
    TableTitle,
    WebSocket_uuid,
} from '../../socket/index.declare';

import { Queue } from '../../utils/commonJS';
import { committee } from '../../utils/variables';

const cypressWSEN = 'wss://public-node-api.klaytnapi.com/v1/cypress/ws';
const baobabWSEN = 'wss://api.baobab.klaytn.net:8652';

class WebSocketServerModel {
    private readonly wss: WebSocketServer;

    private readonly rooms: Record<Networks, Network>;

    constructor(option: { server: Server }) {
        this.wss = new WebSocketServer({ server: option.server });
        this.rooms = {
            Baobab: {
                blockFinder: new BlockFinder({ url: baobabWSEN, network: Networks.Baobab }, this.wss),
                clients: new Map(),
            },
            Cypress: {
                blockFinder: new BlockFinder({ url: cypressWSEN, network: Networks.Cypress }, this.wss),
                clients: new Map(),
            },
        };

        this.initServerEventHandler();
    }

    public getBlockFinder = (network: Networks): BlockFinder => {
        return this.rooms[network].blockFinder;
    };

    private initServerEventHandler = () => {
        this.wss.on('connection', (ws: WebSocket_uuid) => {
            ws['_uuid'] = uuidv4();

            this.initClientEventHandlers(ws).open();
            this.initClientEventHandlers(ws).close();
            this.initClientEventHandlers(ws).message();
            this.initClientEventHandlers(ws).error();

            const _packet = {
                type: 'connected',
                data: ws._uuid,
            };

            ws.send(JSON.stringify(_packet));
        });

        this.wss.on(ServerMessageType.newBlock, (network: Networks) => {
            this.broadcastByNetwork(
                ServerMessageType.newBlock,
                network,
                this.rooms[network].blockFinder.getBlockHeader(),
            );
        });
    };

    private sendMessage = (ws: WebSocket_uuid, type: ServerMessageType, data: any, network: Networks): void => {
        if (ws.readyState !== ws.OPEN) throw new Error('** WebSocket is Close **');

        const _packet: SERVER_PACKET_LAYER = { type, network, data };

        ws.send(JSON.stringify(_packet));
    };

    private enterRooms = (ws: WebSocket_uuid, data: CLIENT_PACKET_LAYER) => {
        this.rooms[data.network].clients.set(ws._uuid, ws);
        this.sendMessage(
            ws,
            ServerMessageType.initBlocks,
            {
                blocks: this.rooms[data.network].blockFinder.getBlocks(),
                txs: this.rooms[data.network].blockFinder.getTxs(),
            },
            data.network,
        );
    };

    private leaveRooms = (ws: WebSocket_uuid) => {
        for (const network of Object.values(this.rooms)) network.clients.delete(ws._uuid);
    };

    private setNetwork = (ws: WebSocket_uuid, data: CLIENT_PACKET_LAYER) => {
        this.leaveRooms(ws);
        this.enterRooms(ws, data);
    };

    private broadcastByNetwork = (type: ServerMessageType, network: Networks, data: Block | undefined) => {
        const _packet: SERVER_PACKET_LAYER = { type, network, data };

        for (const client of Array.from(this.rooms[network].clients.values())) {
            client.send(JSON.stringify(_packet));
        }
    };

    private initClientEventHandlers = (ws: WebSocket_uuid) => {
        return {
            message: () =>
                ws.on('message', async (data: any) => {
                    const _data: CLIENT_PACKET_LAYER = JSON.parse(data);

                    switch (_data.type) {
                        case ClientMessageType.enterRooms:
                            this.enterRooms(ws, _data);
                            break;
                        case ClientMessageType.leaveRooms:
                            this.leaveRooms(ws);
                            break;
                        case ClientMessageType.network:
                            this.setNetwork(ws, _data);
                            break;
                        case ClientMessageType.health:
                            this.sendMessage(ws, ServerMessageType.health, this.rooms[_data.network].blockFinder.health, _data.network);
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

                    for (const network of Object.values(this.rooms)) {
                        network.clients.delete(ws._uuid);
                    }
                }),

            error: () =>
                ws.on('error', (err: Error) => {
                    console.log(`client error`);
                }),
        };
    };
}

class BlockFinder {
    private readonly network: Networks;
    private readonly wss: WebSocketServer;

    protected readonly caver: Caver;

    public health:{status : number} = {status : 3};

    private blockArray: Block[] = [];
    private txsArray: TransactionForRPC[] | any = [];

    private collectorTimeoutObj: NodeJS.Timeout | null = null;
    private collectorInterval: number = 0;

    private blockNumberQueue: Queue = new Queue();

    constructor(provider: { url: string; network: Networks }, wss: WebSocketServer) {
        this.network = provider.network;
        this.wss = wss;

        this.caver = new Caver(provider.url);

        this.initialize(provider.url);
    }

    public getBlocks = (): Block[] => this.blockArray;
    public getTxs = (): TransactionForRPC[] | any => this.txsArray;
    public getBlockHeader = (): Block | undefined => this.blockArray[this.blockArray.length - 1];

    private initialize = async (wsProvider: string) => {
        const web3 = new Web3(wsProvider);

        const compareBlockNumber = async () => {
            if (this.blockArray.length === 0) {
                setTimeout(compareBlockNumber, 1000);
                return;
            }

            const currentBlockNumber = await web3.eth.getBlockNumber();
            const thisBlockHeader = this.blockArray[this.blockArray.length - 1][TableTitle.block];

            const dif = Math.abs(currentBlockNumber - thisBlockHeader);
            
            this.health.status = dif > 60 ? 3 : dif > 10 ? 2 : 1;
        }

        setInterval(compareBlockNumber, 10000);

        await compareBlockNumber();
        web3.eth.subscribe('newBlockHeaders').on('data', this.blockListener).on('error', console.error);
    };

    private blockListener = (block: BlockHeader): void => {
        this.blockNumberQueue.enqueue(block.number);

        if (!this.collectorTimeoutObj) this.collectorTimeoutObj = setTimeout(this.collector, this.collectorInterval);
    };

    private collector = async (): Promise<void> => {
        if (this.blockNumberQueue.getLength() === 0) {
            this.collectorTimeoutObj = null;
            return;
        }

        const blockNumber = this.blockNumberQueue.dequeue();

        try {
            const receipts = await this.caver.klay.getBlockWithConsensusInfo(blockNumber);
            const { number, timestamp, transactions, originProposer, gasUsed, size } = receipts as any;

            const txs = [];

            for (const tx of transactions) {
                const { transactionHash, status, from, type, to, value } = tx;
                const val = {
                    txHash: transactionHash,
                    timestamp: +timestamp,
                    from: from,
                    to: to || '',
                    status: +status,
                    txCategory: type,
                    fromName: '',
                    toName: '',
                    value: value,
                };

                txs.push(val);
                this.txsArray.push(val);
            }

            const proposerIdx = committee[0].indexOf(originProposer);

            const block: Block = {
                [TableTitle.block]: +number,
                [TableTitle.age]: +timestamp,
                [TableTitle.totalTx]: transactions.length,
                [TableTitle.proposer]: originProposer,
                [TableTitle.reward]: 9.6 * 10 ** 18 + 250000000000 * gasUsed + '',
                [TableTitle.size]: +size,
                gasUsed: gasUsed,
                proposerName: proposerIdx === -1 ? '' : committee[1][proposerIdx],
                txs: txs,
            };

            this.blockArray.push(block);
            this.wss.emit('newBlock', this.network);
        } catch (e: any) {
            if (e.message.indexOf('the block does not exist')) {
                this.collectorInterval += 100;
                this.blockNumberQueue.unShift(blockNumber);
            } else console.error(e);
        } finally {
            if (this.blockNumberQueue.getLength() !== 0) {
                this.collectorTimeoutObj = setTimeout(this.collector, this.collectorInterval);
            } else this.collectorTimeoutObj = null;
        }
    };
}



export interface Network {
    blockFinder: BlockFinder;
    clients: Map<string, WebSocket_uuid>;
}

export default WebSocketServerModel;
