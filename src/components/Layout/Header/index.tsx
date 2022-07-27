import cx from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import css from 'components/Layout/Header/index.module.scss';

const Header = () => {
    const { wss } = useSelector((state: RootState) => state.networkReducer);

    const router = useRouter();

    const [networkTap, setNetworkTap] = useState(false);
    const [selectNetwork, setSelectNetwork] = useState('');

    const _setNetworksHandler = (idx: number) => {
        if (!wss) return;

        const network = wss.getNetwork();
        const temp = [...network.others];
        const nextNetwork = temp.splice(idx, 1);
        temp.unshift(network.selected);

        wss.setNetwork({ selected: nextNetwork[0], others: temp });
        setSelectNetwork(nextNetwork[0]);

        router.push('/').then(() => {
            wss.sendMessage('setNetwork', '', network.selected);
        });
    };

    useEffect(() => {
        if (!wss) return;

        setSelectNetwork(wss?.getNetwork().selected);
    }, []);

    return (
        <header className={css.Layout_header}>
            <div className={css.Header__dropdownMenu} onClick={() => setNetworkTap(!networkTap)}>
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
