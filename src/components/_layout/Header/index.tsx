import cx from 'classnames';
import React, { useEffect } from 'react';

import css from 'components/_layout/Header/index.module.scss';
import useClientStorage from 'hooks/socket/useClientStorage';
import useTap from 'hooks/useTap';
import { ClientMessageType, Networks, ServerMessageType } from 'socket/index.declare';
import wsc from 'socket/websocket.client';
import useServerStorage from 'hooks/socket/useServerStorage';

type HeaderProps = {
    selectedPath: string;
};

const Header = ({ selectedPath }: HeaderProps) => {
    const [networkTap, setNetworkTap] = useTap(false);
    const [networks, setNetworks] = useClientStorage(ClientMessageType.network);

    const health = useServerStorage(ServerMessageType.health);
    console.log(health);

    const _setNetworksHandler = (next: Networks) => {
        setNetworks({ ...networks, selected: next });
    };

    useEffect(() => {
        if (!wsc) return;

        wsc.sendMessage(ClientMessageType.enterRooms);

        return () => {
            wsc?.sendMessage(ClientMessageType.leaveRooms);
            localStorage.setItem('network', networks.selected);
        };
    }, [networks]);

    useEffect(() => {
        if (!wsc) return;
        
        wsc.sendMessage(ClientMessageType.health);
    }, [networks])

    return (
        <header className={css.Layout_header} style={selectedPath !== '/' ? { margin: '0 auto 7rem' } : undefined}>
            <div
                style={selectedPath !== '/' ? { visibility: 'visible' } : { visibility: 'hidden' }}
                className={css.Header__search__input}
            >
                <div className={css.Header__search__input__container}>
                    <input
                        className={css.search__input}
                        type="string"
                        placeholder="Search by Block# / TX Hash / Account / Token Name / NFT Name / Symbol"
                    />
                </div>
                <button className={css.search__button} type="button">
                    submit button
                </button>
            </div>

            <div>
                {health.status === 1 ? '건강' : health.status === 2 ? '지연' : '나쁨'}
            </div>
            <div
                className={cx(css.Header__dropdownMenu, selectedPath !== '/' && css.Header__not__home)}
                onClick={() => setNetworkTap(!networkTap)}
            >
                <div className={css.Header__dropdownMenu__control} aria-haspopup="listbox">
                    <div className="DropdownMenu-placeholder is-selected">{`${networks.selected} Network`}</div>
                    <div className="DropdownMenu-arrow-wrapper">
                        <span className={css.Header__dropdownMenu_arrow}></span>
                    </div>
                </div>
                {networkTap && (
                    <div className={css.Header__dropdownMenu__menu}>
                        <div
                            className={cx(css.Header__dropdownMenu__option, css.is__selected)}
                            role="option"
                            aria-selected="false"
                        >
                            {`${networks.selected} Network`}
                        </div>
                        {networks.all.map((network: Networks) => {
                            if (network === networks.selected) return;

                            return (
                                <div
                                    className={css.Header__dropdownMenu__option}
                                    role="option"
                                    aria-selected="false"
                                    onClick={() => _setNetworksHandler(network)}
                                    key={network}
                                >
                                    {`${network} Network`}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
