import cx from 'classnames';
import CopyButton from 'components/button/copyButton';
import Link from 'next/link';
import React from 'react';

import css from 'pages/block/index.module.scss';
import { ReturnTXS } from 'pages/txs';
import { Block, TableTitle } from 'socket/index.declare';
import { convertToAge, convertToKlayByFixed, numberWithCommas } from 'utils/commonJS';

interface _Block extends Omit<Block, 'txs'> {
    txs: ReturnTXS;
}

const OverView = ({ _block, blockNumber }: { _block: _Block; blockNumber: string }) => {
    return (
        <div className={cx(css.DetailInfoTemplate, css.BlockDetailOverview)}>
            <h3 className={css.templateHeader}>Overview</h3>
            <div className={css.templateContent}>
                <div className={css.row}>
                    <div className={css.row__label}>Time</div>
                    <div className={css.row__value}>
                        {convertToAge(_block.AGE)}
                        {/*{아래 time 수정 필요}*/}
                        <span className={css.__time}>(Aug 19, 2022 23:13:44 / Local)</span>
                    </div>
                </div>
                <div className={css.row}>
                    <div className={css.row__label}>Hash</div>
                    <div className={css.row__value}>
                        <span className={css.__hash}>{_block.hash}</span>

                        <CopyButton data={_block.hash} />
                    </div>
                </div>
                <div className={css.row}>
                    <div className={css.row__label}>Parent Hash</div>
                    <div className={css.row__value}>
                        <Link href={`block/${blockNumber && +blockNumber + 1}`}>
                            <a>
                                <span className={cx(css.__hash, css.__parentHash)}>{_block.parentHash}</span>
                            </a>
                        </Link>
                        <CopyButton data={_block.parentHash} />
                    </div>
                </div>
                <div className={css.row}>
                    <div className={css.row__label}>Total TXs</div>
                    <div className={css.row__value}>{_block.txs.result?.length} TXs</div>
                </div>
                <div className={css.row}>
                    <div className={css.row__label}>Block Reward</div>
                    <div className={css.row__value}>
                        <div className={css.__BlockReward}>
                            <div className="Tooltip">
                                <div className={css.__valueUnit}>
                                    <span className={css.__value}>
                                        <span>{convertToKlayByFixed(_block[TableTitle.reward])}</span>
                                    </span>
                                    <span className={css.__uint}>KLAY</span>
                                    <a></a>
                                </div>
                                <div className={css.__rewardDetail}>
                                    (Minted<span className="BlockReward__reward"> 9.6</span> + TX Fee{' '}
                                    <span className="BlockReward__txFee">
                                        {convertToKlayByFixed(+_block.gasUsed * 250000000000 + '')}
                                    </span>
                                    )
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={css.row}>
                    <div className={css.row__label}>Block Size</div>
                    <div className={css.row__value}>{numberWithCommas(_block[TableTitle.size])} bytes</div>
                </div>
            </div>
        </div>
    );
};

export default OverView;
