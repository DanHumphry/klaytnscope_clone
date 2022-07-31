import cx from 'classnames';
import css from 'components/root/index.module.scss';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBlockHeader } from 'redux/action/actions';
import { RootState } from 'redux/reducers';
import { Block, Txs } from 'socket/index.declare';
import { convertToAge, convertToKlayByFixed } from 'utils/commonJS';

const RecentBlocks = () => {
    const dispatch = useDispatch();
    const { wss, blockHeader } = useSelector((state: RootState) => state.networkReducer);

    const [blocks, setBlocks] = useState<{ blocks: Block[]; txs: Txs[] }>({
        blocks: [],
        txs: [],
    });

    useEffect(() => {
        if (!wss) return;

        setBlocks({ blocks: wss.blocks.slice(-11), txs: wss.txs.slice(-11) });

        wss.addEvent('newBlockHeader', () => {
            dispatch(setBlockHeader({ blockHeader: wss.blocks[wss.blocks.length - 1] }));
        });

        return () => {
            wss.removeEvent('newBlockHeader');
        };
    }, []);

    useEffect(() => {
        if (!wss || !blockHeader) return;

        setBlocks({ blocks: wss.blocks.slice(-11), txs: wss.txs.slice(-11) });
    }, [blockHeader]);

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
                                        <div className={css.Table__tr} key={item.number}>
                                            <div className={cx(css.Table__td, css.MainList__table__number)}>
                                                <span className={css.numberData}>{item.number}</span>
                                            </div>
                                            <div className={cx(css.Table__td, css.MainList__table__timestamp)}>
                                                <span className={css.TimeDelta}>{convertToAge(item.timestamp)}</span>
                                            </div>
                                            <div className={cx(css.Table__td, css.MainList__table__totalTx)}>
                                                <span className={css.numberData}>{item.txs.length}</span>
                                            </div>
                                            <div className={cx(css.Table__td, css.MainList__table__proposer)}>
                                                <div
                                                    className={cx(
                                                        css.CroppedTxWithLink,
                                                        css.CroppedTxWithLink__address,
                                                    )}
                                                >
                                                    <a href="/contract/0x5cb1a7dccbd0dc446e3640898ede8820368554c8">
                                                        {item.proposerName}
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
                                                <span className={css.numberData}>
                                                    {convertToKlayByFixed(item.reward)}
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
