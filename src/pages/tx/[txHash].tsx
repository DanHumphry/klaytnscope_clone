import axios from 'axios';
import CopyButton from 'components/button/copyButton';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import useClientStorage from 'hooks/socket/useClientStorage';
import { ClientMessageType, TableTitle, Txs } from 'socket/index.declare';
import { HOST_SERVER } from 'utils/variables';
import css from './index.module.scss';

const index = () => {
    const [network] = useClientStorage(ClientMessageType.network);

    const { txHash } = useRouter().query;

    const [_tx, _setTx] = useState<Txs>({
        [TableTitle.block]: 0,
        [TableTitle.age]: 0,
        txHash: '',
        from: '',
        to: '',
        status: 0,
        txCategory: '',
        fromName: '',
        toName: '',
        value: '',
        gasUsed: '',
        method: '',
    });

    useEffect(() => {
        if (typeof txHash === 'string') {
            axios
                .get(`${HOST_SERVER}/block/txs/${txHash}?network=${network.selected}`)
                .then((res) => {
                    _setTx({
                        ...res.data.result,
                    });
                })
                .catch(console.error);
        }
    }, [txHash]);

    return (
        <div className={css.TxDetailPage}>
            <header className={css.TxDetailPage__header}>
                <h2 className={css.TxDetailPage__title}>Transaction</h2>
                <span className={css.TxDetailPage__txHash}>
                    <div className={css.TxHashWithCopyButton}>{_tx.txHash}</div>
                    <CopyButton data={_tx.txHash} />
                </span>
            </header>
            <div className="TxDetailPage__content">
                <div className="DetailInfoTemplate TxDetailOverview">
                    <h3 className="DetailInfoTemplate__header">
                        <div className="TxDetailOverviewHeader">
                            Overview
                            <span className="TxDetailOverviewHeader__status TxDetailOverviewHeader__status--success">
                                Success
                            </span>
                        </div>
                    </h3>
                    <div className="DetailInfoTemplate__content">
                        <div className="DetailInfoTemplate__section">
                            <div className="DetailInfoRow TxDetailOverview__infoRow">
                                <div className="DetailInfoRow__label">TX Type</div>
                                <div className="DetailInfoRow__value">Value Transfer</div>
                            </div>
                            <div className="DetailInfoRow TxDetailOverview__infoRow">
                                <div className="DetailInfoRow__label">Block #</div>
                                <div className="DetailInfoRow__value">
                                    <a className="TxDetailOverview__blockNumber" href="/block/103739607">
                                        103739607
                                    </a>
                                </div>
                            </div>
                            <div className="DetailInfoRow TxDetailOverview__infoRow">
                                <div className="DetailInfoRow__label">From</div>
                                <div className="DetailInfoRow__value">
                                    <div className="CropfromTo">
                                        <div className="CroppedTxWithLink">
                                            <a
                                                className="CroppedTxWithLink__link CroppedTxWithLink__link--success"
                                                href="/account/0xf90675a56a03f836204d66c0f923e00500ddc90a"
                                            >
                                                0xf90675a56a03f836204d66c0f923e00500ddc90a
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="DetailInfoRow TxDetailOverview__infoRow">
                                <div className="DetailInfoRow__label">To</div>
                                <div className="DetailInfoRow__value">
                                    <div className="CropfromTo">
                                        <div className="CroppedTxWithLink">
                                            <a
                                                className="CroppedTxWithLink__link CroppedTxWithLink__link--success"
                                                href="/account/0xec0100a0690cbee07b3a62eafeb56b9ab86ae129"
                                            >
                                                0xec0100a0690cbee07b3a62eafeb56b9ab86ae129
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="DetailInfoRow TxDetailOverview__infoRow">
                                <div className="DetailInfoRow__label">Token Transfers</div>
                                <div className="DetailInfoRow__value">0</div>
                            </div>
                            <div className="DetailInfoRow TxDetailOverview__infoRow">
                                <div className="DetailInfoRow__label">NFT Transfers</div>
                                <div className="DetailInfoRow__value">0</div>
                            </div>
                            <div className="DetailInfoRow TxDetailOverview__infoRow">
                                <div className="DetailInfoRow__label">Time</div>
                                <div className="DetailInfoRow__value">
                                    <span className="TxDetailOverview__time">
                                        <div className="Tooltip TimeDelta__tooltip">
                                            <span className="TimeDelta newTime">4 mins ago</span>
                                            <div className="Tooltip__tooltip Tooltip__tooltip--bottom">
                                                2022-10-09 20:52:31 / Local
                                            </div>
                                        </div>{' '}
                                        (Oct 09, 2022 20:52:31 / Local)
                                    </span>
                                </div>
                            </div>
                            <div className="DetailInfoRow TxDetailOverview__infoRow">
                                <div className="DetailInfoRow__label">Nonce</div>
                                <div className="DetailInfoRow__value">542652</div>
                            </div>
                        </div>
                        <div className="DetailInfoTemplate__section">
                            <div className="DetailInfoRow TxDetailOverview__infoRow">
                                <div className="DetailInfoRow__label">Amount</div>
                                <div className="DetailInfoRow__value">
                                    <div className="ValueWithUnit">
                                        <span className="ValueWithUnit__value">
                                            <span>150</span>
                                        </span>
                                        <span className="ValueWithUnit__unit">KLAY</span>
                                        <a></a>
                                    </div>
                                </div>
                            </div>
                            <div className="DetailInfoRow TxDetailOverview__infoRow">
                                <div className="DetailInfoRow__label">Gas Price</div>
                                <div className="DetailInfoRow__value">
                                    <div className="fee">
                                        <div className="ValueWithUnit">
                                            <span className="ValueWithUnit__value">
                                                <span>0.00000025</span>
                                            </span>
                                            <span className="ValueWithUnit__unit">KLAY</span>
                                            <a></a>
                                        </div>
                                        <div className="ValueWithUnit">
                                            <span className="ValueWithUnit__value">
                                                <span>
                                                    <span className="braket">(</span>250
                                                </span>
                                            </span>
                                            <span className="ValueWithUnit__unit">
                                                ston<span className="braket">)</span>
                                            </span>
                                            <a></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="DetailInfoRow TxDetailOverview__infoRow">
                                <div className="DetailInfoRow__label">Effective Gas Price</div>
                                <div className="DetailInfoRow__value">
                                    <div className="fee">
                                        <div className="ValueWithUnit">
                                            <span className="ValueWithUnit__value">
                                                <span>0.000000025</span>
                                            </span>
                                            <span className="ValueWithUnit__unit">KLAY</span>
                                            <a></a>
                                        </div>
                                        <div className="ValueWithUnit">
                                            <span className="ValueWithUnit__value">
                                                <span>
                                                    <span className="braket">(</span>25
                                                </span>
                                            </span>
                                            <span className="ValueWithUnit__unit">
                                                ston<span className="braket">)</span>
                                            </span>
                                            <a></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="DetailInfoRow TxDetailOverview__infoRow">
                                <div className="DetailInfoRow__label">Gas Used</div>
                                <div className="DetailInfoRow__value">21,000</div>
                            </div>
                            <div className="DetailInfoRow TxDetailOverview__infoRow">
                                <div className="DetailInfoRow__label">Gas Limit</div>
                                <div className="DetailInfoRow__value">4,300,000</div>
                            </div>
                            <div className="DetailInfoRow TxDetailOverview__infoRow">
                                <div className="DetailInfoRow__label">TX Fee</div>
                                <div className="DetailInfoRow__value">
                                    <div className="fee">
                                        <div className="ValueWithUnit">
                                            <span className="ValueWithUnit__value">
                                                <span>0.000525</span>
                                            </span>
                                            <span className="ValueWithUnit__unit">KLAY</span>
                                            <a></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="DetailInfoRow TxDetailOverview__infoRow">
                                <div className="DetailInfoRow__label">Burnt Fees</div>
                                <div className="DetailInfoRow__value">
                                    <div className="fee">
                                        <div className="ValueWithUnit">
                                            <span className="ValueWithUnit__value">
                                                <span>🔥 0.0002625</span>
                                            </span>
                                            <span className="ValueWithUnit__unit">KLAY</span>
                                            <a></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default index;
