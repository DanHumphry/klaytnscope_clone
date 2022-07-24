import * as types from '../types';
import { Block } from 'utils/websocket.client';

export const setBlockHeader = (payload: { blockHeader: Block }) => (dispatch: any) => {
    dispatch({ type: types.SET_BLOCK_HEADER, payload });
};
