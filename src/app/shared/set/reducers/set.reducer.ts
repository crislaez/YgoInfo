import { createReducer, on } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/helpers/functions';
import * as SetActions from '../actions/set.actions';
import { Set } from '../models';

export const setFeatureKey = 'set';

export interface State {
  status: EntityStatus;
  sets?: Set[];
  lastSets?: Set[];
  error?: unknown;
}

export const initialState: State = {
  status: EntityStatus.Initial,
  sets: [],
  lastSets:[],
  error: undefined
};

export const reducer = createReducer(
  initialState,
  on(SetActions.loadSets, (state): State => ({ ...state,  error:undefined, status: EntityStatus.Pending })),
  on(SetActions.saveSets, (state, { sets, error, status }): State => {
    const nowYear = new Date().getFullYear();

    const lastSets = sets?.filter(item => {
      const { tcg_date = null } = item || {}
      const year = tcg_date?.split('-')[0]
      if(year === nowYear?.toString()) return item
    })?.slice(-10);

    return ({ ...state, sets, lastSets, error, status})
  }),

);
