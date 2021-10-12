import { createReducer, on } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import * as MagicActions from '../actions/magic.actions';
import { Card } from '@ygopro/shared/shared/models';

export const magicFeatureKey = 'magic';

export interface State {
  statusMagics: EntityStatus;
  magics?: Card[];
  total?:number;
  offset?:number;
  fname?:string;
  race?:string;
  format?:string,
  error?: unknown;
}

export const initialState: State = {
  statusMagics: EntityStatus.Initial,
  magics: [],
  total:0,
  offset:0,
  fname:'',
  race:'',
  format:'',
  error: undefined
};

export const reducer = createReducer(
  initialState,
  on(MagicActions.loadMagics, (state): State => ({ ...state,  error:undefined, statusMagics: EntityStatus.Pending })),
  on(MagicActions.saveMagics, (state, { magics, total, error, status, offset, fname, race, format }): State => {
    let stateMagics:Card[] = [];
    if(offset === 0) stateMagics = [...magics];
    else stateMagics = [...state.magics, ...magics ];
    return { ...state, magics: stateMagics, total, error, statusMagics: status, offset, fname, race, format }
  }),

);
