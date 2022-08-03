import * as types from 'redux/action/types';
import { Block, TableTitle } from 'socket/index.declare';

export const setBlockHeader = (payload: { blockHeader: Block<TableTitle> }) => (dispatch: any) => {
    dispatch({ type: types.SET_BLOCK_HEADER, payload });
};
