import axios from 'axios';
import cx from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { ClientMessageType, Block, Txs, TableTitle } from 'socket/index.declare';
import { HOST_SERVER } from 'utils/variables';
import {convertToAge, convertToKlayByFixed, numberWithCommas} from 'utils/commonJS';
import useClientStorage from 'hooks/socket/useClientStorage';
import css from './index.module.scss';

const Block = () => {
    const [network] = useClientStorage(ClientMessageType.network);

    const { blockNumber } = useRouter().query;

    const [_block, _setBlock] = useState<Block>({
        [TableTitle.block]: 0,
        [TableTitle.age]: 0,
        [TableTitle.totalTx]: 0,
        [TableTitle.proposer]: '',
        [TableTitle.reward]: '',
        [TableTitle.size]: 0,
        gasUsed: '',
        proposerName: '',
        txs: [],
        hash : '',
        parentHash : ''
    });

    useEffect(() => {
        if (typeof blockNumber === 'string') {
            axios
            .get(`${HOST_SERVER}/block/${blockNumber}?network=${network.selected}`)
            .then((res) => _setBlock(res.data.result))
            .catch(console.error);
        }
    }, [blockNumber])

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
                <div className={cx(css.DetailInfoTemplate, css.BlockDetailOverview)}>
                    <h3 className={css.templateHeader}>
                        Overview
                        <div className={cx('Tooltip', css.templateHeader__tooltip)}>
                            <span></span>
                            {/*{아래 툴팁임 나중에 작업}*/}
                            {/*<div className={css.tooltip__bottom}>*/}
                            {/*    Information shown may*/}
                            {/*    <br />*/}
                            {/*    not be up to date.*/}
                            {/*    <br />*/}
                            {/*    Reload page to update.*/}
                            {/*</div>*/}
                        </div>
                    </h3>
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
                                <span className={css.__hash}>
                                    {_block.hash}
                                </span>

                                <button className="Button withCopyButtonTitle withCopyButton__button" type="button">
                                    <span>COPY</span>
                                </button>
                            </div>
                        </div>
                        <div className={css.row}>
                            <div className={css.row__label}>Parent Hash</div>
                            <div className={css.row__value}>
                                <Link href={`block/${blockNumber && +blockNumber + 1}`}>
                                    <a>
                                        <span className={cx(css.__hash, css.__parentHash)}>
                                            {_block.parentHash}
                                        </span>
                                    </a>
                                </Link>

                                <button className="Button withCopyButtonTitle withCopyButton__button" type="button">
                                    <span className="">COPY</span>
                                </button>
                            </div>
                        </div>
                        <div className={css.row}>
                            <div className={css.row__label}>Total TXs</div>
                            <div className={css.row__value}>{_block.txs.length} TXs</div>
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
                                            <span className="BlockReward__txFee">{convertToKlayByFixed(+_block.gasUsed * 250000000000 + '')}</span>)
                                        </div>
                                        {/*{아래 툴팁 나중에 일괄 처리 예정}*/}
                                        {/*<div className="Tooltip__tooltip Tooltip__tooltip--bottom">*/}
                                        {/*    <ul>*/}
                                        {/*        <li>To Council Reward (34%)</li>*/}
                                        {/*        <li>3.28476176</li>*/}
                                        {/*    </ul>*/}
                                        {/*    <ul>*/}
                                        {/*        <li>To Proof of Contribution (54%)</li>*/}
                                        {/*        <li>5.21697456</li>*/}
                                        {/*    </ul>*/}
                                        {/*    <ul>*/}
                                        {/*        <li>To Klaytn Improvement Reserve (12%)</li>*/}
                                        {/*        <li>1.15932768</li>*/}
                                        {/*    </ul>*/}
                                        {/*</div>*/}
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

                <div className={css.BlockCommitteeInfo}>
                    <h3 className={css.__header}>Committee</h3>
                    <div className={css.__proposer}>
                        <div className={css.__label}>Block Proposer</div>
                        <div className={css.__value}>
                            <div className="CommitteeNodeInfo">
                                <div className={css.CroppedTxWithLink}>
                                    <div className={css.isLabel}>
                                        <div className={css.addressTooltip}>
                                            <div className={css.CroppedTxWithLink__text}>GC:Ground X</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={css.DetailPageTableTemplate}>
                    <div className={css.TapTemplate}>
                        <div className={css.Tap__header}>
                            <div className={cx(css.tap__item, css.tap__active)} role="button">
                                Transactions
                            </div>
                            <div className={css.tap__item} role="button">
                                Internal Transactions
                            </div>
                        </div>
                        <div className={css.Tap__contents}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Block;
