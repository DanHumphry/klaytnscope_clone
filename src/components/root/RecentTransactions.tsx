import cx from 'classnames';
import css from 'components/root/index.module.scss';
import useServerStorage from 'hooks/socket/useServerStorage';
import React from 'react';
import { ServerMessageType } from 'socket/index.declare';
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
                                {[...blocks.txs].reverse().map((item) => {
                                    return (
                                        <div className={css.Table__tr} key={item.txHash}>
                                            <div className={cx(css.Table__td, css.MainList__table__txHash)}>
                                                <div className={css.CroppedTxWithLink}>
                                                    <a href="/tx/0x274b61716313d24f20ef1d5f3fd32cec03bcd90207fa9cdbe9544b0377aac8ef">
                                                        {item.txHash}
                                                    </a>
                                                </div>
                                            </div>
                                            <div className={cx(css.Table__td, css.MainList__table__timestamp_th)}>
                                                <span className={css.TimeDelta}>{convertToAge(item.timestamp)}</span>
                                            </div>
                                            <div className={cx(css.Table__td, css.MainList__table__fromTo)}>
                                                <div className={css.FromTo}>
                                                    <span className="FromTo__from">
                                                        <div className={css.CroppedTxWithLink}>
                                                            <a
                                                                className="CroppedTxWithLink__link CroppedTxWithLink__link--success"
                                                                href="/account/0x393c0c47b9a6b3f226456a7162086579decc8ae3"
                                                            >
                                                                {item.from}
                                                            </a>
                                                        </div>
                                                    </span>
                                                    <span className={cx(css.FromTo__arrow, css.white__arrow)}></span>
                                                    <span className="FromTo__to">
                                                        <div className={css.CroppedTxWithLink}>
                                                            <a
                                                                className="CroppedTxWithLink__link CroppedTxWithLink__link--success"
                                                                href="/account/0x9e0112a06d12fab3302d72bae44f19f300095907"
                                                            >
                                                                {item.to}
                                                            </a>
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

export default RecentTransactions;
