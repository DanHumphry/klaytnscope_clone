import * as types from 'redux/types';

const initialTimerState = {
    selectedNetwork: 'Baobab',
    othersNetworks: ['Main'],
};

const networkReducer = (state = initialTimerState, { type, payload }: any) => {
    switch (type) {
        case types.SET_NETWORK:
            return {
                ...state,
                selectedNetwork: payload.selectedNetwork,
                othersNetworks: payload.othersNetworks,
            };
        default:
            return state;
    }
};

export default networkReducer;
