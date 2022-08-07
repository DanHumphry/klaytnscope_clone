import cx from 'classnames';
import css from 'components/root/index.module.scss';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { ServerMessageType, TableTitle } from 'socket/index.declare';
import { convertToAge, convertToKlayByFixed } from 'utils/commonJS';

const RecentBlocks = () => {
    const wss = useSelector((state: RootState) => state.networkReducer.wss);
    const blocks = wss.getServerValue(ServerMessageType.initBlocks);

    useEffect(() => {
        wss.eventListener(ServerMessageType.newBlock, () => {
            console.log('new Block');
        });

        return () => {
            wss.removeEventListener(ServerMessageType.newBlock);
        };
    }, []);

    return (
        <div className={css.MainListBox}>
            <div className={css.MainList}>
                <header className={css.ListTemplate__header}>
                    <h2 className={css.ListTemplate__title}>Recent Blocks</h2>
                </header>

                <div className={css.ListTemplate__content__isMain}>
                    <div className={css.MainList__table}>
                        <div className={css.Table}>
                            <div className={css.Table__thead}>
                                <div className={cx(css.Table__th, css.MainList__table__number)}>Block #</div>
                                <div className={cx(css.Table__th, css.MainList__table__timestamp)}>Age</div>
                                <div className={cx(css.Table__th, css.MainList__table__totalTx)}>Total TXs</div>
                                <div className={cx(css.Table__th, css.MainList__table__proposer)}>Block Proposer</div>
                                <div className={cx(css.Table__th, css.Table__th__right, css.MainList__table__reward)}>
                                    <div className={css.BlockList__unitHeader}>
                                        Reward<span>(KLAY)</span>
                                    </div>
                                </div>
                            </div>
                            <div className={css.Table__tbody}>
                                {[...blocks.blocks].reverse().map((item) => {
                                    return (
                                        <div className={css.Table__tr} key={item[TableTitle.block]}>
                                            <div className={cx(css.Table__td, css.MainList__table__number)}>
                                                <span className={css.numberData}>{item[TableTitle.block]}</span>
                                            </div>
                                            <div className={cx(css.Table__td, css.MainList__table__timestamp)}>
                                                <span className={css.TimeDelta}>
                                                    {convertToAge(item[TableTitle.age])}
                                                </span>
                                            </div>
                                            <div className={cx(css.Table__td, css.MainList__table__totalTx)}>
                                                <span className={css.numberData}>{item[TableTitle.totalTx]}</span>
                                            </div>
                                            <div className={cx(css.Table__td, css.MainList__table__proposer)}>
                                                <div
                                                    className={cx(
                                                        css.CroppedTxWithLink,
                                                        css.CroppedTxWithLink__address,
                                                    )}
                                                >
                                                    <Link href={`/contract/${item[TableTitle.proposer]}`}>
                                                        {item.proposerName}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div
                                                className={cx(
                                                    css.Table__td,
                                                    css.Table__td__right,
                                                    css.MainList__table__reward,
                                                )}
                                            >
                                                <span className={css.numberData}>
                                                    {convertToKlayByFixed(item[TableTitle.reward])}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecentBlocks;
