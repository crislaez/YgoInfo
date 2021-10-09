import { createReducer, on } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import * as TrapActions from '../actions/trap.actions';
import { Trap } from '../models';

export const trapFeatureKey = 'trap';

export interface State {
  statusTraps: EntityStatus;
  traps?: Trap[];
  total?:number;
  offset?:number;
  fname?:string;
  race?:string;
  error?: unknown;
}

export const initialState: State = {
  statusTraps: EntityStatus.Initial,
  traps: [],
  total:0,
  offset:0,
  fname:'',
  race:'',
  error: undefined
};

export const reducer = createReducer(
  initialState,
  on(TrapActions.loadTraps, (state): State => ({ ...state,  error: undefined, statusTraps: EntityStatus.Pending })),
  on(TrapActions.saveTraps, (state, { traps, total, error, status, offset, fname, race  }): State => {
    let stateTraps:Trap[] = [];
    if(offset === 0) stateTraps = [...traps];
    else stateTraps = [...state.traps, ...traps ];
    return { ...state, traps: stateTraps, total, error, statusTraps: status, offset, fname, race }
  }),

);
