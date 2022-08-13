import css from 'components/root/index.module.scss';
import React from 'react';

const SearchInput = () => {
    return (
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
                    submit buttontxhash
                </button>
            </div>
        </div>
    );
};

export default React.memo(SearchInput);
