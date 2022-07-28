import cx from 'classnames';
import useTap from 'hooks/useTap';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import css from 'components/_layout/Header/index.module.scss';

type HeaderProps = {
    selectedPath: string;
};

const Header = ({ selectedPath }: HeaderProps) => {
    const router = useRouter();

    const wss = useSelector((state: RootState) => state.networkReducer.wss);

    const [networkTap, setNetworkTap] = useTap(false);
    const [selectNetwork, setSelectNetwork] = useState(wss ? wss.getNetwork().selected : 'Baobab');

    const _setNetworksHandler = (idx: number) => {
        if (!wss) return;

        const network = wss.getNetwork();
        const temp = [...network.others];
        const nextNetwork = temp.splice(idx, 1);
        temp.unshift(network.selected);

        wss.setNetwork({ selected: nextNetwork[0], others: temp });
        setSelectNetwork(nextNetwork[0]);

        router.push('/').then(() => wss.sendMessage('setNetwork', '', network.selected));
    };

    return (
        <header className={css.Layout_header}>
            <div
                style={selectedPath === '/' ? { visibility: 'hidden' } : { visibility: 'visible' }}
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
                    <div className="DropdownMenu-placeholder is-selected">{`${selectNetwork} Network`}</div>
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
                            {`${selectNetwork} Network`}
                        </div>
                        {wss?.getNetwork().others.map((network: string, index: number) => {
                            return (
                                <div
                                    className={css.Header__dropdownMenu__option}
                                    role="option"
                                    aria-selected="false"
                                    onClick={() => _setNetworksHandler(index)}
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
