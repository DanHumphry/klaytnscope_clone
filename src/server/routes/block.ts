import express from 'express';
import { Query } from 'express-serve-static-core';

import { Networks } from '../../socket/index.declare';
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
        const blocks = wss.rooms[network].blockFinder.blockArray;
        res.json({
            result: blocks.slice((+page - 1) * +limit, +page * +limit).reverse(),
            total: blocks.length,
            page: +page,
            limit: +limit,
        });
    }
});

router.get('/txs', (req: TypedRequestQuery<{ limit: string; page: string; network: Networks }>, res, next) => {
    const { limit = defaultValue.limit, page = defaultValue.page, network } = req.query;

    if (!network) res.status(400).json({ message: 'require network' });

    const values = Object.values(Networks);

    if (!values.includes(network)) res.status(400).json({ message: 'wrong network' });
    else {
        const txs = wss.rooms[network].blockFinder.txsArray;
        res.json({
            result: txs.slice((+page - 1) * +limit, +page * +limit).reverse(),
            total: txs.length,
            page: +page,
            limit: +limit,
        });
    }
});

export default router;
