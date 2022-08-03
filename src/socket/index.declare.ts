import { WebSocket } from 'ws';

export enum Networks {
    Baobab = 'Baobab',
    Cypress = 'Cypress',
}

export enum TableTitle {
    block = 'BLOCK #',
    age = 'AGE',
    totalTx = 'TOTAL TXS',
    proposer = 'BLOCK PROPOSER',
    reward = 'REWARD(KLAY)',
    size = 'SIZE(BYTE)',
}

export interface Block<TableTitle> {
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

export interface PACKET_LAYAR {
    type: string;

    network: Networks;
    prevNetwork?: Networks;

    data: any;
}

export interface WebSocket_uuid extends WebSocket {
    _uuid: string;
}
