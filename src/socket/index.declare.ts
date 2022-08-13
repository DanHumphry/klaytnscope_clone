import { WebSocket } from 'ws';

export enum Networks {
    Baobab = 'Baobab',
    Cypress = 'Cypress',
}

export enum ServerMessageType {
    connected = 'connected',
    initBlocks = 'initBlocks',
    newBlock = 'newBlock',
}

export enum ClientMessageType {
    enterRooms = 'enterRooms',
    leaveRooms = 'leaveRooms',
    network = 'network',
}

export interface ReceivedServerInitValues {
    [ServerMessageType.initBlocks]: {
        blocks: Block[];
        txs: Txs[];
    };
    [ServerMessageType.newBlock]: Block | undefined;
}

export const receivedServerInitValues: ReceivedServerInitValues = {
    [ServerMessageType.initBlocks]: {
        blocks: [],
        txs: [],
    },
    [ServerMessageType.newBlock]: undefined,
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
}

export interface Txs {
    txHash: string;
    timestamp: number;
    from: string;
    to: string;
    status: number;
    txCategory: string;
    fromName: string;
    toName: string;
    value: string;
}

export const instanceOfBlock = (object: any): object is Block => {
    return TableTitle.totalTx in object;
};

export const instanceOfTxs = (object: any): object is Txs => {
    return TableTitle.txHash in object;
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
