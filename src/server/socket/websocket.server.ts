import { Server } from 'http';
import { BlockHeader } from 'web3-eth';
import { WebSocketServer } from 'ws';
import Caver, { TransactionForRPC, TransactionReceipt } from 'caver-js';
import Web3 from 'web3';
import { v4 as uuidv4 } from 'uuid';

import { Queue } from '../../utils/commonJS';
import { committee } from '../../utils/variables';
import { Block, Networks, PACKET_LAYAR, WebSocket_uuid } from '../../socket/index.declare';

const cypressWSEN = 'wss://public-node-api.klaytnapi.com/v1/cypress/ws';
const baobabWSEN = 'wss://api.baobab.klaytn.net:8652';

class WebSocketServerModel {
    private readonly wss: WebSocketServer;

    public rooms: Record<Networks, Network>;

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

        this.wss.on('newBlock', (network: Networks) => {
            this.broadcastByNetwork('newBlock', network, this.rooms[network].blockFinder.blockHeader);
        });
    };

    private sendMessage = (ws: WebSocket_uuid, type: string, data: any, network: Networks): void => {
        if (ws.readyState !== ws.OPEN) throw new Error('** WebSocket is Close **');

        const _packet: PACKET_LAYAR = { type, network, data };

        ws.send(JSON.stringify(_packet));
    };

    private enterRooms = (ws: WebSocket_uuid, data: PACKET_LAYAR) => {
        this.rooms[data.network].clients.set(ws._uuid, ws);
        this.sendMessage(
            ws,
            'initBlocks',
            {
                blocks: this.rooms[data.network].blockFinder.blockArray.slice(-11),
                txs: this.rooms[data.network].blockFinder.blockArray
                    .map((item) => item.txs)
                    .flat()
                    .slice(-11),
            },
            data.network,
        );
    };

    private leaveRooms = (ws: WebSocket_uuid, data: PACKET_LAYAR) => {
        if (data.prevNetwork) this.rooms[data.prevNetwork].clients.delete(ws._uuid);
        else {
            for (const network of Object.values(this.rooms)) {
                network.clients.delete(ws._uuid);
            }
        }
    };

    private setNetwork = (ws: WebSocket_uuid, data: PACKET_LAYAR) => {
        this.leaveRooms(ws, data);
        this.enterRooms(ws, data);
    };

    private broadcastByNetwork = (type: string, network: Networks, data: Block | undefined) => {
        const _packet: PACKET_LAYAR = { type, network, data };

        for (const client of Array.from(this.rooms[network].clients.values())) {
            client.send(JSON.stringify(_packet));
        }
    };

    private initClientEventHandlers = (ws: WebSocket_uuid) => {
        return {
            message: () =>
                ws.on('message', async (data: any) => {
                    const _data: PACKET_LAYAR = JSON.parse(data);

                    switch (_data.type) {
                        case 'enterRooms':
                            this.enterRooms(ws, _data);
                            break;
                        case 'leaveRooms':
                            this.leaveRooms(ws, _data);
                            break;
                        case 'setNetwork':
                            this.setNetwork(ws, _data);
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
    private network: Networks;
    private wss: WebSocketServer;

    public blockArray: Block[] = [];
    public txsArray: TransactionForRPC[] | any = [];
    public blockHeader: Block | undefined = undefined;
    protected collectorTimeoutObj: NodeJS.Timeout | null = null;
    private collectorInterval: number = 0;
    protected blockWithConsensusInfoQueue: Queue = new Queue();

    protected caver: Caver;

    constructor(provider: { url: string; network: Networks }, wss: WebSocketServer) {
        this.network = provider.network;
        this.wss = wss;

        this.caver = new Caver(provider.url);

        this.initialize(provider.url);
    }

    protected initialize = (wsProvider: string) => {
        const web3 = new Web3(wsProvider);

        setInterval(() => {
            web3.eth.getBlockNumber().catch(console.error);
        }, 10000);

        web3.eth.subscribe('newBlockHeaders').on('data', this.blockListener).on('error', console.error);
    };

    private blockListener = (block: BlockHeader): void => {
        this.blockWithConsensusInfoQueue.enqueue(block.number);

        if (!this.collectorTimeoutObj) this.collectorTimeoutObj = setTimeout(this.collector, this.collectorInterval);
    };

    private collector = async (): Promise<void> => {
        if (this.blockWithConsensusInfoQueue.getLength() === 0) {
            this.collectorTimeoutObj = null;
            return;
        }

        const blockNumber = this.blockWithConsensusInfoQueue.dequeue();

        try {
            const receipts = await this.caver.klay.getBlockWithConsensusInfo(blockNumber);
            const { number, timestamp, transactions, originProposer, gasUsed } = receipts as any;

            const txs = [];

            for (const tx of transactions) {
                const { transactionHash, status, from, type, to } = tx;
                const val = {
                    txHash: transactionHash,
                    timestamp: +timestamp,
                    from: from,
                    to: to || '',
                    status: +status,
                    txCategory: type,
                    fromName: '',
                    toName: '',
                };

                txs.push(val);
                this.txsArray.push(val);
            }

            const proposerIdx = committee[0].indexOf(originProposer);

            const block = {
                number: +number,
                timestamp: +timestamp,
                totalTx: transactions.length,
                proposer: originProposer,
                reward: 9.6 * 10 ** 18 + 250000000000 * gasUsed + '',
                gasUsed: gasUsed,
                proposerName: proposerIdx === -1 ? '' : committee[1][proposerIdx],
                txs: txs,
            };

            this.blockHeader = block;
            this.blockArray.push(block);
            this.wss.emit('newBlock', this.network);
        } catch (e: any) {
            if (e.message.indexOf('the block does not exist')) {
                this.collectorInterval += 100;
                this.blockWithConsensusInfoQueue.unShift(blockNumber);
            } else console.error(e);
        } finally {
            if (this.blockWithConsensusInfoQueue.getLength() !== 0) {
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
