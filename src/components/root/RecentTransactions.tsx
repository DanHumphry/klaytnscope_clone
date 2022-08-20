import cx from 'classnames';
import css from 'components/root/index.module.scss';
import useServerStorage from 'hooks/socket/useServerStorage';
import Link from 'next/link';
import React from 'react';
import { ServerMessageType, TableTitle } from 'socket/index.declare';
import { convertToAge } from 'utils/commonJS';

const RecentTransactions = () => {
    const blocks = useServerStorage(ServerMessageType.initBlocks);

    return (
        <div className={css.MainListBox}>
            <div className={css.MainList}>
                <header className={css.ListTemplate__header}>
                    <h2 className={css.ListTemplate__title}>Recent Transactions</h2>
                </header>

                <div className={css.ListTemplate__content__isMain}>
                    <div className={css.MainList__table}>
                        <div className={css.Table}>
                            <div className={css.Table__thead}>
                                <div className={cx(css.Table__th, css.MainList__table__txHash)}>TX Hash</div>
                                <div className={cx(css.Table__th, css.MainList__table__timestamp_th)}>Age</div>
                                <div className={cx(css.Table__th, css.MainList__table__fromTo)}>
                                    <div className={css.TxList__fromToTh}>
                                        <span className={css.FromTo__header}>From</span>
                                        <span className={css.FromTo__arrow}></span>
                                        <span className={css.FromTo__header}>To</span>
                                    </div>
                                </div>
                            </div>

                            <div className={css.Table__tbody}>
                                {[...blocks.txs]
                                    .slice(-11)
                                    .reverse()
                                    .map((item) => {
                                        return (
                                            <div className={css.Table__tr} key={item.txHash}>
                                                <div className={cx(css.Table__td, css.MainList__table__txHash)}>
                                                    <div className={css.CroppedTxWithLink}>
                                                        <Link href={`/tx/${item.txHash}`}>
                                                            <a>{item.txHash}</a>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className={cx(css.Table__td, css.MainList__table__timestamp_th)}>
                                                    <span className={css.TimeDelta}>
                                                        {convertToAge(item[TableTitle.age])}
                                                    </span>
                                                </div>
                                                <div className={cx(css.Table__td, css.MainList__table__fromTo)}>
                                                    <div className={css.FromTo}>
                                                        <span className="FromTo__from">
                                                            <div className={css.CroppedTxWithLink}>
                                                                <Link href={`/account/${item.from}`}>
                                                                    <a>{item.from}</a>
                                                                </Link>
                                                            </div>
                                                        </span>
                                                        <span
                                                            className={cx(css.FromTo__arrow, css.white__arrow)}
                                                        ></span>
                                                        <span className="FromTo__to">
                                                            <div className={css.CroppedTxWithLink}>
                                                                <Link href={`/account/${item.to}`}>
                                                                    <a>{item.to}</a>
                                                                </Link>
                                                            </div>
                                                        </span>
                                                    </div>
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

export default React.memo(RecentTransactions);
