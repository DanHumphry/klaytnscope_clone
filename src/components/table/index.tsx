import cx from 'classnames';
import css from 'components/table/index.module.scss';
import Link from 'next/link';
import React from 'react';
import { Block, Txs, TableTitle } from 'socket/index.declare';
import { convertToAge, convertToKlayByFixed } from 'utils/commonJS';

interface TableProps {
    data: Block<TableTitle>[];
    table: {
        width: number;
        title: TableTitle;
    }[];
}

const Index = ({ data, table }: TableProps) => {
    return (
        <div className={css.ListTemplate__common}>
            <header className={css.ListTemplate__header}>
                <h2 className={css.ListTemplate__title}>Blocks</h2>
            </header>
            <div className={css.MainList}>
                <div className={css.ListTemplate__content__isMain}>
                    <div className={css.MainList__table}>
                        <div className={css.Table}>
                            <div className={css.Table__thead}>
                                {table.map((item) => {
                                    return (
                                        <div className={css.Table__th} style={{ width: `${item.width}%` }}>
                                            {item.title}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className={css.Table__tbody}>
                                {data.map((item) => {
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

export default Index;
