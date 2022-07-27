import * as types from 'redux/action/types';
import { Block } from 'socket/index.declare';

export const setBlockHeader = (payload: { blockHeader: Block }) => (dispatch: any) => {
    dispatch({ type: types.SET_BLOCK_HEADER, payload });
};
