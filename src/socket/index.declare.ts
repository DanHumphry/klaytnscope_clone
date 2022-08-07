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

export interface ClientInitValues {
    [ClientMessageType.network]: {
        selected: Networks;
        all: Networks[];
    };
}

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
