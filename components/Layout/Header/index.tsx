import cx from 'classnames';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNetwork } from 'redux/action/actions';
import { RootState } from 'redux/reducers/reducers';
import css from './index.module.scss';

const Header = () => {
    const { selectedNetwork, othersNetworks } = useSelector((state: RootState) => state.networkReducer);
    const dispatch = useDispatch();

    const [networkTap, setNetworkTap] = useState(false);

    const _setNetworksHandler = (idx: number) => {
        const temp = [...othersNetworks];
        const nextNetwork = temp.splice(idx, 1);
        temp.unshift(selectedNetwork);

        dispatch(setNetwork({ selectedNetwork: nextNetwork[0], othersNetworks: temp }));
    };

    return (
        <header className={css.Layout_header}>
            <div className={css.Header__dropdownMenu} onClick={() => setNetworkTap(!networkTap)}>
                <div className={css.Header__dropdownMenu__control} aria-haspopup="listbox">
                    <div className="DropdownMenu-placeholder is-selected">{`${selectedNetwork} Network`}</div>
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
                            {`${selectedNetwork} Network`}
                        </div>
                        {othersNetworks.map((network: string, index: number) => {
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
