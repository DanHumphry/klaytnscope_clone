import css from 'components/root/index.module.scss';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';

const BlockHeader = () => {
    const { blockHeader } = useSelector((state: RootState) => state.networkReducer);

    return (
        <div className={css.Home__mainIndicators}>
            <div className={css.BlockHeightIndicator}>
                <div className={css.main__inner__box}>
                    <h2 className={css.main__box__title}>Block Height</h2>
                    <div className={css.blockHeight_view}>
                        <img src="https://baobab.scope.klaytn.com/icons/icon-block-nor.svg" />
                        {`# ${blockHeader.number || ''}`}
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
    );
};

export default BlockHeader;
