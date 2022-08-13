import BlockHeader from 'components/root/BlockHeader';
import css from 'components/root/index.module.scss';
import RecentBlocks from 'components/root/RecentBlocks';
import RecentTransactions from 'components/root/RecentTransactions';
import SearchInput from 'components/root/SearchInput';
import type { NextPage } from 'next';
import React from 'react';

const Home: NextPage = () => {
    return (
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
    );
};

export default Home;
