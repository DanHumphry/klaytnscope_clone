import cx from 'classnames';
import React from 'react';
import dynamic from 'next/dynamic';

import css from 'components/_layout/Header/index.module.scss';
import useClientStorage from 'hooks/socket/useClientStorage';
import useTap from 'hooks/useTap';
import { ClientMessageType, Networks } from 'socket/index.declare';

type HeaderProps = {
    selectedPath: string;
};

const Header = dynamic(
    Promise.resolve(({ selectedPath }: HeaderProps) => {
        const [networkTap, setNetworkTap] = useTap(false);
        const [networks, setNetworks] = useClientStorage(ClientMessageType.network);

        const _setNetworksHandler = (next: Networks) => {
            setNetworks({ ...networks, selected: next });
        };

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
    }),
    { ssr: false },
);

export default Header;
