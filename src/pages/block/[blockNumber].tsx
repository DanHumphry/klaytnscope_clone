import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import OverviewFooter from 'pages/block/overview.footer';
import OverView from 'pages/block/overview';
import { ReturnTXS } from 'pages/txs';
import { ClientMessageType, Block, TableTitle } from 'socket/index.declare';
import { HOST_SERVER } from 'utils/variables';
import useClientStorage from 'hooks/socket/useClientStorage';
import css from './index.module.scss';

export interface _Block extends Omit<Block, 'txs'> {
    txs: ReturnTXS;
}

const index = () => {
    const [network] = useClientStorage(ClientMessageType.network);

    const { blockNumber } = useRouter().query;

    const [_block, _setBlock] = useState<_Block>({
        [TableTitle.block]: 0,
        [TableTitle.age]: 0,
        [TableTitle.totalTx]: 0,
        [TableTitle.proposer]: '',
        [TableTitle.reward]: '0',
        [TableTitle.size]: 0,
        gasUsed: '0',
        proposerName: '',
        txs: {
            limit: 25,
            page: 1,
            result: [],
            total: 0,
        },
        hash: '',
        parentHash: '',
    });

    useEffect(() => {
        if (typeof blockNumber === 'string') {
            axios
                .get(`${HOST_SERVER}/block/${blockNumber}?network=${network.selected}`)
                .then((res) => {
                    _setBlock({
                        ...res.data.result,
                        txs: {
                            ..._block.txs,
                            total: res.data.result.txs.length,
                            result: res.data.result.txs,
                        },
                    });
                })
                .catch(console.error);
        }
    }, [blockNumber]);

    return (
        <div className={css.BlockDetailPage}>
            <header className={css.BlockDetailPage__header}>
                <Link href={`/block/${blockNumber && +blockNumber - 1}`}>
                    <a className={css.moveBlockBtn}>
                        <img src="https://scope.klaytn.com/icons/icon-direction-page.svg" />
                    </a>
                </Link>
                <h2 className={css.title}>Block</h2>
                <span className={css.blockHeight}>#{_block[TableTitle.block]}</span>
                <Link href={`/block/${blockNumber && +blockNumber + 1}`}>
                    <a className={css.moveBlockBtn}>
                        <img src="https://scope.klaytn.com/icons/icon-direction-page.svg" />
                    </a>
                </Link>
            </header>

            <div className={css.BlockDetailPage__content}>
                <OverView _block={_block} blockNumber={typeof blockNumber === 'string' ? blockNumber : ''} />

                <div className={css.BlockCommitteeInfo}>
                    <h3 className={css.__header}>Committee</h3>
                    <div className={css.__proposer}></div>
                </div>

                <OverviewFooter _block={_block} />
            </div>
        </div>
    );
};

export default index;
