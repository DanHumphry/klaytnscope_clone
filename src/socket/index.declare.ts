import { WebSocket } from 'ws';

export enum Networks {
    Baobab = 'Baobab',
    Cypress = 'Cypress',
}

export interface Block {
    number: number;
    timestamp: number;
    totalTx: number;
    proposer: string;
    reward: string;
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
