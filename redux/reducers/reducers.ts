import { combineReducers } from 'redux';
import networkReducer from 'redux/reducers/network';

export const rootReducer = combineReducers({
    networkReducer: networkReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
