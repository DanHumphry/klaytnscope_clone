import cx from 'classnames';

import css from 'components/table/index.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReturnBlocks } from 'pages/blocks';
import { ReturnTXS } from 'pages/txs';
import React, { useEffect, useState } from 'react';
import { instanceOfBlock, instanceOfTxs, TableTitle } from 'socket/index.declare';
import { convertToAge, convertToKlayByFixed, numberWithCommas } from 'utils/commonJS';

interface TableProps {
    title?: string;
    data: ReturnBlocks | ReturnTXS;
    table: Table[];
}

interface Table {
    width: number;
    th: TableTitle;
    style?: React.CSSProperties;
}

const Index = ({ title, data, table }: TableProps) => {
    return (
        <div className={css.ListTemplate__common}>
            <header className={css.ListTemplate__header}>
                <h2 className={css.ListTemplate__title}>{title || ''}</h2>
            </header>
            <div className={css.MainList}>
                <div className={css.ListTemplate__content__isMain}>
                    <div className={css.MainList__table}>
                        <div className={css.Table}>
                            <TableHead table={table} />
                            <TableBody data={data} table={table} />
                        </div>
                        <Paginator data={data} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const TableHead = ({ table }: { table: Table[] }) => {
    return (
        <div className={css.Table__thead}>
            {table.map((item) => {
                if (item.th === 'FROM TO') {
                    return (
                        <div className={css.Table__th} style={{ ...item.style, width: `${item.width}%` }} key={item.th}>
                            <div className={css.__fromToTh}>
                                <span className={css.__from}>From</span>
                                <span className={css.__arrow}></span>
                                <span className={css.__to}>To</span>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className={css.Table__th} style={{ ...item.style, width: `${item.width}%` }} key={item.th}>
                            {item.th}
                        </div>
                    );
                }
            })}
        </div>
    );
};

const TableBody = ({ data, table }: TableProps) => {
    return (
        <div className={css.Table__tbody}>
            {data.result.map((item, index) => {
                if (instanceOfBlock(item)) {
                    return (
                        <div className={css.Table__tr} key={item[TableTitle.block]}>
                            {table.map((row, idx) => {
                                switch (row.th) {
                                    case TableTitle.block:
                                        return (
                                            <div
                                                className={css.Table__td}
                                                style={{ width: `${row.width}%` }}
                                                key={`${index}${idx}`}
                                            >
                                                <Link href={`/block/${item[TableTitle.block]}`}>
                                                    <span className={cx(css.numberData, css.blockNumber)}>
                                                        {item[TableTitle.block]}
                                                    </span>
                                                </Link>
                                            </div>
                                        );
                                    case TableTitle.age:
                                        return (
                                            <div
                                                className={css.Table__td}
                                                style={{ width: `${row.width}%` }}
                                                key={`${index}${idx}`}
                                            >
                                                <AgeComponent timestamp={item[TableTitle.age]} />
                                            </div>
                                        );
                                    case TableTitle.totalTx:
                                        return (
                                            <div
                                                className={css.Table__td}
                                                style={{ width: `${row.width}%` }}
                                                key={`${index}${idx}`}
                                            >
                                                <span className={css.numberData}>{item[TableTitle.totalTx]}</span>
                                            </div>
                                        );

                                    case TableTitle.proposer:
                                        return (
                                            <div
                                                className={css.Table__td}
                                                style={{ width: `${row.width}%` }}
                                                key={`${index}${idx}`}
                                            >
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
                                        );
                                    case TableTitle.reward:
                                        return (
                                            <div
                                                className={cx(css.Table__td, css.Table__td__right)}
                                                style={{ ...row.style, width: `${row.width}%` }}
                                                key={`${index}${idx}`}
                                            >
                                                <span className={css.numberData}>
                                                    {convertToKlayByFixed(item[TableTitle.reward])}
                                                </span>
                                            </div>
                                        );
                                    case TableTitle.size:
                                        return (
                                            <div
                                                className={cx(css.Table__td, css.Table__td__right)}
                                                style={{ ...row.style, width: `${row.width}%` }}
                                                key={`${index}${idx}`}
                                            >
                                                <span className={css.TimeDelta}>
                                                    {numberWithCommas(item[TableTitle.size])}
                                                </span>
                                            </div>
                                        );

                                    default:
                                        return;
                                }
                            })}
                        </div>
                    );
                } else if (instanceOfTxs(item)) {
                    return (
                        <div className={css.Table__tr} key={item.txHash}>
                            {table.map((row, idx) => {
                                switch (row.th) {
                                    case TableTitle.txHash:
                                        return (
                                            <div
                                                className={css.Table__td}
                                                style={{ width: `${row.width}%` }}
                                                key={`${index}${idx}`}
                                            >
                                                <div className={cx(css.CroppedTxWithLink)}>
                                                    <a href={`/tx/${item.txHash}`}>{item.txHash}</a>
                                                </div>
                                            </div>
                                        );
                                    case TableTitle.block:
                                        return (
                                            <div
                                                className={css.Table__td}
                                                style={{ width: `${row.width}%` }}
                                                key={`${index}${idx}`}
                                            >
                                                <Link href={`/block/${item[TableTitle.block]}`}>
                                                    <span className={cx(css.numberData, css.blockNumber)}>
                                                        {item[TableTitle.block]}
                                                    </span>
                                                </Link>
                                            </div>
                                        );
                                    case TableTitle.age:
                                        return (
                                            <div
                                                className={css.Table__td}
                                                style={{ width: `${row.width}%` }}
                                                key={`${index}${idx}`}
                                            >
                                                <AgeComponent timestamp={item[TableTitle.age]} />
                                            </div>
                                        );

                                    case TableTitle.fromTo:
                                        return (
                                            <div
                                                className={css.Table__td}
                                                style={{ width: `${row.width}%` }}
                                                key={`${index}${idx}`}
                                            >
                                                <div className={css.FromTo}>
                                                    <span className="FromTo__from">
                                                        <div className={css.CroppedTxWithLink}>
                                                            <Link href={`/account/${item.from}`}>
                                                                <a>{item.from}</a>
                                                            </Link>
                                                        </div>
                                                    </span>
                                                    <span className={cx(css.FromTo__arrow, css.black__arrow)}></span>
                                                    <span className="FromTo__to">
                                                        <div className={css.CroppedTxWithLink}>
                                                            <Link href={`/account/${item.to}`}>
                                                                <a>{item.to}</a>
                                                            </Link>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    case TableTitle.methodSig:
                                        return (
                                            <div
                                                className={css.Table__td}
                                                style={{ width: `${row.width}%` }}
                                                key={`${index}${idx}`}
                                            >
                                                {''}
                                            </div>
                                        );
                                    case TableTitle.txType:
                                        return (
                                            <div
                                                className={css.Table__td}
                                                style={{ width: `${row.width}%` }}
                                                key={`${index}${idx}`}
                                            >
                                                <span className={css.txType}>{item.txCategory}</span>
                                            </div>
                                        );
                                    case TableTitle.amount:
                                        return (
                                            <div
                                                className={css.Table__td}
                                                style={{ ...row.style, width: `${row.width}%` }}
                                                key={`${index}${idx}`}
                                            >
                                                <span className={css.rewardData}>
                                                    {convertToKlayByFixed(+item.value + '')}
                                                </span>
                                            </div>
                                        );

                                    case TableTitle.txFee:
                                        return (
                                            <div
                                                className={css.Table__td}
                                                style={{ ...row.style, width: `${row.width}%` }}
                                                key={`${index}${idx}`}
                                            >
                                                {convertToKlayByFixed(+item.gasUsed * 250000000000 + '')}
                                            </div>
                                        );

                                    default:
                                        return;
                                }
                            })}
                        </div>
                    );
                }
            })}
        </div>
    );
};

const Paginator = ({ data }: { data: ReturnBlocks | ReturnTXS }) => {
    const endPage = data.total > data.limit ? Math.floor(data.total / data.limit) + 1 : 1;
    const router = useRouter();

    return (
        <div className={css.Paginator}>
            <ul>
                <li>
                    <Link href={`${router.pathname}?page=1`}>
                        <a className={data.page === 1 ? css.disabledLink : undefined}>
                            <img src="https://scope.klaytn.com/icons/newpath-2.svg" />
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href={`${router.pathname}?page=${data.page - 1}`}>
                        <a className={data.page === 1 ? css.disabledLink : undefined}>
                            <img src="https://scope.klaytn.com/icons/icon-direction-page.svg" />
                        </a>
                    </Link>
                </li>
                <li>
                    <div>
                        <input type="text" placeholder={`${data.page}`} />
                        <p> / </p>
                        <p>{endPage}</p>
                    </div>
                </li>
                <li>
                    <Link href={`${router.pathname}?page=${data.page + 1}`}>
                        <a className={data.page === endPage ? css.disabledLink : undefined}>
                            <img src="https://scope.klaytn.com/icons/icon-direction-page.svg" />
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href={`${router.pathname}?page=${endPage}`}>
                        <a className={data.page === endPage ? css.disabledLink : undefined}>
                            <img src="https://scope.klaytn.com/icons/newpath-2.svg" />
                        </a>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

const AgeComponent = ({ timestamp }: { timestamp: number }) => {
    const [age, setAge] = useState<string>(convertToAge(timestamp));

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        function tick() {
            setAge(convertToAge(timestamp));
            timeout = setTimeout(tick, 1000);
        }

        timeout = setTimeout(tick, 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return <span className={css.TimeDelta}>{age}</span>;
};

export default Index;
