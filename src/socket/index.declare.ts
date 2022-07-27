import { WebSocket } from 'ws';

export enum Networks {
    baobab = 'Baobab',
    cypress = 'Cypress',
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

export declare interface Txs {
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
