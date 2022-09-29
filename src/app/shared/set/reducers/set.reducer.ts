import { createReducer, on } from '@ngrx/store';
import { EntityStatus, sortByDate } from '@ygopro/shared/utils/functions';
import * as SetActions from '../actions/set.actions';
import { Set } from '../models';

export const setFeatureKey = 'set';

export interface State {
  status: EntityStatus;
  sets?: Set[]
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
    const sortSets = sortByDate(sets, 'tcg_date') || [];
    return ({
      ...state,
      sets: sortSets,
      lastSets: sortSets?.slice(0, 10),
      error,
      status})
  }),

);
