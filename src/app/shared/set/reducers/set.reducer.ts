import { createReducer, on } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/utils/helpers/functions';
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

    const sortedSets = [...sets]?.sort((a,b) => {
      if(new Date(a.tcg_date).getTime() > new Date(b.tcg_date).getTime()) return 1
      if(new Date(a.tcg_date).getTime() < new Date(b.tcg_date).getTime()) return -1
      return 0
    });

    const reverseSortedSets = [...sortedSets]?.reverse();

    return ({ ...state, sets: reverseSortedSets?.slice(10), lastSets: reverseSortedSets?.slice(0, 10), error, status})
  }),

);
