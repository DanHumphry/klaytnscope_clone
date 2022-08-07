import cx from 'classnames';
import css from 'components/table/index.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReturnBlocks } from 'pages/blocks';
import React, { useEffect, useState } from 'react';
import { TableTitle } from 'socket/index.declare';
import { convertToAge, convertToKlayByFixed, numberWithCommas } from 'utils/commonJS';

interface TableProps {
    data: ReturnBlocks;
    table: Table[];
}

interface Table {
    width: number;
    th: TableTitle;
    style?: React.CSSProperties;
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
                return (
                    <div
                        className={css.Table__th}
                        style={item.style ? { ...item.style, width: `${item.width}%` } : { width: `${item.width}%` }}
                        key={item.th}
                    >
                        {item.th}
                    </div>
                );
            })}
        </div>
    );
};

const TableBody = ({ data, table }: TableProps) => {
    return (
        <div className={css.Table__tbody}>
            {data.result.map((item, index) => {
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
                                            <span className={css.numberData}>{item[TableTitle.block]}</span>
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
                                            <div className={cx(css.CroppedTxWithLink, css.CroppedTxWithLink__address)}>
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
                                            style={{ width: `${row.width}%` }}
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
                                            style={{ width: `${row.width}%` }}
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
            })}
        </div>
    );
};

const Paginator = ({ data }: { data: ReturnBlocks }) => {
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
