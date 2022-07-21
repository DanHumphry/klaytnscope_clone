import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import cx from 'classnames';
import Link from 'next/link';

import css from './index.module.scss';

const menu = [
    {
        name: 'Blocks',
        href: '/blocks',
    },
    {
        name: 'Transactions',
        href: '/txs',
    },
];

type SideBarProps = {
    selectedPath: string;
    setSelectedPath: React.Dispatch<React.SetStateAction<string>>;
};

const SideBar = ({ selectedPath, setSelectedPath }: SideBarProps) => {
    const path = useRouter().pathname;

    useEffect(() => {
        setSelectedPath(path);
    }, [path]);

    return (
        <div className={css.Layout_sidebar}>
            <div className={css.Sidebar__inner}>
                <h1 className={css.Sidebar__logo}>
                    <Link href={'/'}>
                        <a>
                            <img src="https://scope.klaytn.com/images/klaytnscope-logo.svg" alt="Klaytn Scope" />
                        </a>
                    </Link>
                </h1>
                <nav className={css.SidebarNav}>
                    <ul>
                        {menu.map((item) => {
                            return (
                                <li
                                    key={item.name}
                                    className={cx(
                                        css.SidebarLink,
                                        selectedPath === item.href && css.SidebarLink__active,
                                    )}
                                >
                                    <Link href={item.href}>
                                        <a className={css.SidebarLink__anchor}>
                                            <div className={css.SidebarLink__linkName}>{item.name}</div>
                                        </a>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default SideBar;
