import useServerStorage from 'hooks/socket/useServerStorage';
import React from 'react';
import type { NextPage } from 'next';

import BlockHeader from 'components/root/BlockHeader';
import RecentBlocks from 'components/root/RecentBlocks';
import RecentTransactions from 'components/root/RecentTransactions';
import SearchInput from 'components/root/SearchInput';
import css from 'components/root/index.module.scss';
import { ServerMessageType } from 'socket/index.declare';

const Home: NextPage = () => {
    const newBlock = useServerStorage(ServerMessageType.newBlock);

    return (
        <React.Fragment>
            <main className={css.Home}>
                <div className={css.Home__mainPage}>
                    <SearchInput />
                    <BlockHeader />
                    <div className={css.Home__mainBottom__list}>
                        <RecentBlocks />
                        <RecentTransactions />
                    </div>
                </div>
            </main>
        </React.Fragment>
    );
};

export default Home;
