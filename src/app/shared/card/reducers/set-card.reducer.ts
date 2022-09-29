import { createReducer, on } from '@ngrx/store';
import { Card } from '@ygopro/shared/models';
import { EntityStatus } from '@ygopro/shared/utils/functions';
import * as CardActions from '../actions/card.actions';
import { Filter } from '../models';

export const setCardFeatureKey = 'setCard';

export interface SetState {
  status?: EntityStatus;
  cards?: Card[];
  page?:number;
  totalCount?:number;
  filter?: Filter;
}

export interface State {
  sets: {[key:string]:SetState};
  error?: unknown;
}

export const initialState: State = {
  sets:{},
  error: undefined
};

export const reducer = createReducer(
  initialState,
  on(CardActions.loadSetCards, (state, { setName }): State => ({
    ...state,
    sets:{
      ...(state?.sets ?? {}),
      [setName]:{
        ...(state?.sets?.[setName] ?? {}),
        status: EntityStatus.Pending
      }
    },
    error: undefined,
  })),
  on(CardActions.saveSetCards, (state, { setName, cards, page, filter, totalCount, status, error }): State => {
    return {
      ...state,
      sets:{
        ...(state?.sets ?? {}),
        [setName]:{
          cards: page === 0
                ? cards
                : [...(state?.sets?.[setName]?.cards ?? []), ...(cards ?? [])],
          page,
          filter,
          totalCount,
          status,
        }
      },
      error
    }
  }),

);
