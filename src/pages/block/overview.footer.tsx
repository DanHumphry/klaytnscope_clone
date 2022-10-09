import cx from 'classnames';
import useNavigation from 'hooks/useNavigation';
import css from 'pages/block/index.module.scss';
import React from 'react';

import BlockTable from 'components/table';
import { _Block } from 'pages/block/[blockNumber]';
import { TableTitle } from 'socket/index.declare';

enum _NaviList {
    Txs = 'Transactions',
    ITxs = 'Internal Transactions',
}

const OverviewFooter = ({ _block }: { _block: _Block }) => {
    const [navi, setNavi, origin] = useNavigation(0, [_NaviList.Txs, _NaviList.ITxs]);

    return (
        <div className={css.DetailPageTableTemplate}>
            <div className={css.TapTemplate}>
                <div className={css.Tap__header}>
                    {origin.map((item, index) => {
                        return (
                            <div
                                className={cx(css.tap__item, item === navi && css.tap__active)}
                                role="button"
                                key={item}
                                onClick={() => setNavi(index)}
                            >
                                {item}
                            </div>
                        );
                    })}
                </div>
                <div className={css.Tap__contents}>
                    {navi === _NaviList.Txs && (
                        <BlockTable
                            data={_block.txs}
                            table={[
                                { th: TableTitle.txHash, width: 15 },
                                { th: TableTitle.block, width: 9 },
                                { th: TableTitle.age, width: 10 },
                                { th: TableTitle.fromTo, width: 28 },
                                { th: TableTitle.methodSig, width: 10 },
                                { th: TableTitle.txType, width: 13 },
                                { th: TableTitle.amount, width: 11, style: { textAlign: 'right' } },
                                { th: TableTitle.txFee, width: 11, style: { textAlign: 'right' } },
                            ]}
                            overridingStyle={{ MainList: { padding: '0', boxShadow: 'none' } }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default OverviewFooter;
