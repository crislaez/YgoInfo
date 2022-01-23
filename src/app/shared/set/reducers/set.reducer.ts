import { createReducer, on } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/helpers/functions';
import * as SetActions from '../actions/set.actions';
import { Set } from '../models';

export const setFeatureKey = 'set';

export interface State {
  status: EntityStatus;
  sets?: {[key: string]:Set[]};
  lastSets?: Set[];
  error?: unknown;
}

export const initialState: State = {
  status: EntityStatus.Initial,
  sets: {},
  lastSets:[],
  error: undefined
};

export const reducer = createReducer(
  initialState,
  on(SetActions.loadSets, (state): State => ({ ...state,  error:undefined, status: EntityStatus.Pending })),
  on(SetActions.saveSets, (state, { sets, error, status }): State => {
    const sortedSets = [...sets]?.sort((a,b) => {
      return new Date(a.tcg_date).getTime() - new Date(b.tcg_date).getTime()
    });
    const reverseSortedSets = [...sortedSets]?.reverse();
    const objSets = (reverseSortedSets || [])?.reduce((acc, el) => {
      const { tcg_date = null } = el || {};
      const year = tcg_date?.split('-')[0] || 'Promotion';
      const mont = Number(tcg_date?.split('-')[1]) < 7 ? 'A' : 'B';
      return {
        ...(acc ? acc : {}),
        [`${year} ${mont}`]:[
          ...(acc?.[`${year} ${mont}`] ? acc?.[`${year} ${mont}`] : []),
          ...(el ? [el]: [])
        ]
      }
    },{});
    return ({ ...state, sets: objSets, lastSets: reverseSortedSets?.slice(0, 10), error, status})
  }),

);
