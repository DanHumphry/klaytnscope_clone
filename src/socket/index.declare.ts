import { WebSocket } from 'ws';

export enum Networks {
    Baobab = 'Baobab',
    Cypress = 'Cypress',
}

export enum ServerMessageType {
    connected = 'connected',
    initBlocks = 'initBlocks',
    newBlock = 'newBlock',
    health = 'health',
}

export enum ClientMessageType {
    enterRooms = 'enterRooms',
    leaveRooms = 'leaveRooms',
    network = 'network',
    health = 'health',
}

export interface ReceivedServerInitValues {
    [ServerMessageType.initBlocks]: {
        blocks: Block[];
        txs: Txs[];
    };
    [ServerMessageType.newBlock]: Block | undefined;
    [ServerMessageType.health]: { status: number };
}

export const receivedServerInitValues: ReceivedServerInitValues = {
    [ServerMessageType.initBlocks]: {
        blocks: [],
        txs: [],
    },
    [ServerMessageType.newBlock]: undefined,
    [ServerMessageType.health]: { status: 3 },
};

export interface ClientInitValues {
    [ClientMessageType.network]: {
        selected: Networks;
        all: Networks[];
    };
}

export const clientInitValues: ClientInitValues = {
    [ClientMessageType.network]: {
        selected: Networks.Baobab,
        // selected: (typeof window !== 'undefined' && (localStorage.getItem('network') as Networks)) || Networks.Baobab,
        all: Object.values(Networks),
    },
};

export enum TableTitle {
    block = 'BLOCK #',
    age = 'AGE',
    totalTx = 'TOTAL TXS',
    proposer = 'BLOCK PROPOSER',
    reward = 'REWARD(KLAY)',
    size = 'SIZE(BYTE)',

    txHash = 'TX HASH',
    fromTo = 'FROM TO',
    methodSig = 'METHOD',
    txType = 'TX TYPE',
    amount = 'AMOUNT(KLAY)',
    txFee = 'TX FEE(KLAY)',
}

export interface Block {
    [TableTitle.block]: number;
    [TableTitle.age]: number;
    [TableTitle.totalTx]: number;
    [TableTitle.proposer]: string;
    [TableTitle.reward]: string;
    [TableTitle.size]: number;
    gasUsed: string;
    proposerName: string;
    txs: Txs[];
    hash: string;
    parentHash: string;
}

export interface Txs {
    [TableTitle.block]: number;
    [TableTitle.age]: number;
    txHash: string;
    from: string;
    to: string;
    status: number;
    txCategory: string;
    fromName: string;
    toName: string;
    value: string;
    gasUsed: string;
    method: string;
}

export const instanceOfBlock = (object: any): object is Block => {
    return TableTitle.totalTx in object;
};

export const instanceOfTxs = (object: any): object is Txs => {
    return 'txHash' in object;
};

export interface CLIENT_PACKET_LAYER {
    type: ClientMessageType;
    network: Networks;
    data: any;
}

export interface SERVER_PACKET_LAYER {
    type: ServerMessageType;
    network: Networks;
    data: any;
}

export interface WebSocket_uuid extends WebSocket {
    _uuid: string;
}
