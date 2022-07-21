import cx from 'classnames';
import type { NextPage } from 'next';
import Link from 'next/link';
import css from './index.module.scss';

const Home: NextPage = () => {
    return (
        <main className={css.Home}>
            <div className={css.Home__mainPage}>
                <div className={css.Home__mainPage__search}>
                    <div className={css.SearchInput__container}>
                        <div className={css.SearchInput}>
                            <input
                                type="string"
                                placeholder="You can search for block number, account address, transaction hash, token name, or token symbol"
                                autoComplete="off"
                            />
                        </div>
                        <button className={css.SearchButton} type="button">
                            submit button
                        </button>
                    </div>
                </div>
                <div className={css.Home__mainIndicators}>
                    <div className={css.BlockHeightIndicator}>
                        <div className={css.main__inner__box}>
                            <h2 className={css.main__box__title}>Block Height</h2>
                            <div className={css.blockHeight_view}>
                                <img src="https://baobab.scope.klaytn.com/icons/icon-block-nor.svg" />
                                #96847887
                            </div>
                            <p className={css.blockHeight_message}>
                                Klaytn builds consensus among reputable enterprises across the world.
                            </p>
                        </div>
                    </div>
                    <div className={css.NetworkPerformanceIndicator}>
                        <div className={css.main__inner__box}></div>
                    </div>
                    <div className={css.MainList__graph}>
                        <div className={css.main__inner__box}></div>
                    </div>
                </div>
                <div className={css.Home__mainBottom__list}>
                    <div className={css.MainListBox}>
                        <div className={css.MainList}>
                            <header className={css.ListTemplate__header}>
                                <h2 className={css.ListTemplate__title}>Recent Blocks</h2>
                            </header>

                            <div className={css.ListTemplate__content__isMain}>
                                <div className={css.MainList__table}>
                                    <div className={css.Table}>
                                        <div className={css.Table__thead}>
                                            <div className={cx(css.Table__th, css.MainList__table__number)}>
                                                Block #
                                            </div>
                                            <div className={cx(css.Table__th, css.MainList__table__timestamp)}>Age</div>
                                            <div className={cx(css.Table__th, css.MainList__table__totalTx)}>
                                                Total TXs
                                            </div>
                                            <div className={cx(css.Table__th, css.MainList__table__proposer)}>
                                                Block Proposer
                                            </div>
                                            <div
                                                className={cx(
                                                    css.Table__th,
                                                    css.Table__th__right,
                                                    css.MainList__table__reward,
                                                )}
                                            >
                                                <div className={css.BlockList__unitHeader}>
                                                    Reward<span>(KLAY)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={css.Table__tbody}>
                                            <div className={css.Table__tr}>
                                                <div className={cx(css.Table__td, css.MainList__table__number)}>
                                                    <span className={css.numberData}>96847887</span>
                                                </div>
                                                <div className={cx(css.Table__td, css.MainList__table__timestamp)}>
                                                    <span className={css.TimeDelta}>18 secs ago</span>
                                                </div>
                                                <div className={cx(css.Table__td, css.MainList__table__totalTx)}>
                                                    <span className={css.numberData}>0</span>
                                                </div>
                                                <div className={cx(css.Table__td, css.MainList__table__proposer)}>
                                                    <div
                                                        className={cx(
                                                            css.CroppedTxWithLink,
                                                            css.CroppedTxWithLink__address,
                                                        )}
                                                    >
                                                        <a href="/contract/0x5cb1a7dccbd0dc446e3640898ede8820368554c8">
                                                            GC: Baobab GroundX 3
                                                        </a>
                                                    </div>
                                                </div>
                                                <div
                                                    className={cx(
                                                        css.Table__td,
                                                        css.Table__td__right,
                                                        css.MainList__table__reward,
                                                    )}
                                                >
                                                    <span className={css.numberData}>NULL</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={css.ListTemplate__bottom}>
                                <Link href={'/blocks'}>
                                    <a className={css.ListTemplate__moreButton}>view all</a>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className={css.MainListBox}>
                        <div className={css.MainList}>
                            <header className={css.ListTemplate__header}>
                                <h2 className={css.ListTemplate__title}>Recent Transactions</h2>
                            </header>

                            <div className={css.ListTemplate__content__isMain}>
                                <div className={css.MainList__table}>
                                    <div className={css.Table}>
                                        <div className={css.Table__thead}>
                                            <div className={cx(css.Table__th, css.MainList__table__txHash)}>
                                                TX Hash
                                            </div>
                                            <div className={cx(css.Table__th, css.MainList__table__timestamp_th)}>
                                                Age
                                            </div>
                                            <div className={cx(css.Table__th, css.MainList__table__fromTo)}>
                                                <div className={css.TxList__fromToTh}>
                                                    <span className={css.FromTo__header}>From</span>
                                                    <span className={css.FromTo__arrow}></span>
                                                    <span className={css.FromTo__header}>To</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={css.Table__tbody}>
                                            <div className={css.Table__tr}>
                                                <div className={cx(css.Table__td, css.MainList__table__txHash)}>
                                                    <div className={css.CroppedTxWithLink}>
                                                        <a href="/tx/0x274b61716313d24f20ef1d5f3fd32cec03bcd90207fa9cdbe9544b0377aac8ef">
                                                            0x274b61716313d24f20ef1d5f3fd32cec03bcd90207fa9cdbe9544b0377aac8ef
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className={cx(css.Table__td, css.MainList__table__timestamp_th)}>
                                                    <span className={css.TimeDelta}>18 secs ago</span>
                                                </div>
                                                <div className={cx(css.Table__td, css.MainList__table__fromTo)}>
                                                    <div className={css.FromTo}>
                                                        <span className="FromTo__from">
                                                            <div className={css.CroppedTxWithLink}>
                                                                <a
                                                                    className="CroppedTxWithLink__link CroppedTxWithLink__link--success"
                                                                    href="/account/0x393c0c47b9a6b3f226456a7162086579decc8ae3"
                                                                >
                                                                    0x393c0c47b9a6b3f226456a7162086579decc8ae3
                                                                </a>
                                                            </div>
                                                        </span>
                                                        <span
                                                            className={cx(css.FromTo__arrow, css.white__arrow)}
                                                        ></span>
                                                        <span className="FromTo__to">
                                                            <div className={css.CroppedTxWithLink}>
                                                                <a
                                                                    className="CroppedTxWithLink__link CroppedTxWithLink__link--success"
                                                                    href="/account/0x9e0112a06d12fab3302d72bae44f19f300095907"
                                                                >
                                                                    0x9e0112a06d12fab3302d72bae44f19f300095907
                                                                </a>
                                                            </div>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={css.ListTemplate__bottom}>
                                <Link href={'/txs'}>
                                    <a className={css.ListTemplate__moreButton}>view all</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;
