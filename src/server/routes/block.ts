import express from 'express';
import { Query } from 'express-serve-static-core';

import { Networks, TableTitle, Block, Txs } from '../../socket/index.declare';
import { committee } from '../../utils/variables';
import { wss } from '../app';

const router = express();

enum defaultValue {
    limit = 25,
    page = 1,
}

export interface TypedRequestQuery<T extends Query> extends Express.Request {
    query: T;
}

router.get('/', (req: TypedRequestQuery<{ limit: string; page: string; network: Networks }>, res, next) => {
    const { limit = defaultValue.limit, page = defaultValue.page, network } = req.query;

    if (!network) res.status(400).json({ message: 'require network' });

    const values = Object.values(Networks);

    if (!values.includes(network)) res.status(400).json({ message: 'wrong network' });
    else {
        try {
            const blocks = wss.getBlockFinder(network).getBlocks();
            const _result = [...blocks].reverse().slice((+page - 1) * +limit, +page * +limit);

            res.json({
                result: _result,
                total: blocks.length,
                page: +page,
                limit: +limit,
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'internal error' });
        }
    }
});

router.get('/txs', (req: TypedRequestQuery<{ limit: string; page: string; network: Networks }>, res, next) => {
    const { limit = defaultValue.limit, page = defaultValue.page, network } = req.query;

    if (!network) res.status(400).json({ message: 'require network' });

    const values = Object.values(Networks);

    if (!values.includes(network)) res.status(400).json({ message: 'wrong network' });
    else {
        try {
            const txs = wss.getBlockFinder(network).getTxs();
            const _result = [...txs].reverse().slice((+page - 1) * +limit, +page * +limit);

            res.json({
                result: _result,
                total: txs.length,
                page: +page,
                limit: +limit,
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'internal error' });
        }
    }
});

router.get('/:blockNumber', async (req, res, next) => {
    const { blockNumber } = req.params;
    const { network } = req.query as any;

    if (!blockNumber || !network) return res.status(400).json({ message: 'invalid qurey & params' });

    try {
        const caver = wss.getBlockFinder(network).getCaver();

        const receipts = await caver.klay.getBlockWithConsensusInfo(blockNumber);

        const { number, timestamp, transactions, originProposer, gasUsed, size, hash, parentHash } = receipts as any;

        const txs: Txs[] = [];

        for (const tx of transactions) {
            const { transactionHash, status, from, type, to, value, gasUsed, input } = tx;
            const val: Txs = {
                [TableTitle.block]: +blockNumber,
                txHash: transactionHash,
                [TableTitle.age]: +timestamp,
                from: from,
                to: to || '',
                status: +status,
                txCategory: type,
                fromName: '',
                toName: '',
                value: value || '0',
                gasUsed: gasUsed,
                method: input?.slice(0, 10),
            };

            txs.push(val);
        }

        const proposerIdx = committee[0].indexOf(originProposer);

        const block: Block = {
            [TableTitle.block]: +number,
            [TableTitle.age]: +timestamp,
            [TableTitle.totalTx]: transactions.length,
            [TableTitle.proposer]: originProposer,
            [TableTitle.reward]: 9.6 * 10 ** 18 + 250_000_000_000 * gasUsed + '',
            [TableTitle.size]: +size,
            gasUsed: gasUsed,
            proposerName: proposerIdx === -1 ? '' : committee[1][proposerIdx],
            txs: txs,
            hash: hash,
            parentHash: parentHash,
        };

        res.status(200).json({ result: block });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'internal error' });
    }
});

router.get('/txs/:txHash', async (req, res, next) => {
    const { txHash } = req.params;
    const { network } = req.query as any;

    if (!txHash || !network) return res.status(400).json({ message: 'invalid qurey & params' });

    try {
        const caver = wss.getBlockFinder(network).getCaver();

        const receipts = await caver.rpc.klay.getTransactionReceipt(txHash);

        const { blockNumber, transactionHash, status, from, type, to, value, gasUsed, input } = receipts as any;
        const { timestamp } = await caver.rpc.klay.getBlockByNumber(blockNumber);

        const tx: Txs = {
            [TableTitle.block]: +blockNumber,
            txHash: transactionHash,
            [TableTitle.age]: +timestamp,
            from: from,
            to: to || '',
            status: +status,
            txCategory: type,
            fromName: '',
            toName: '',
            value: value || '0',
            gasUsed: gasUsed,
            method: input.slice(0, 10),
        };

        res.status(200).json({ result: tx });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'internal error' });
    }
});

export default router;
