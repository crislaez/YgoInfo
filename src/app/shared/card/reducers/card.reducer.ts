import { createReducer, on } from '@ngrx/store';
import { Card } from '@ygopro/shared/models';
import { EntityStatus } from '@ygopro/shared/utils/functions';
import * as CardActions from '../actions/card.actions';
import { Filter } from '../models';

export const cardListFeatureKey = 'cardList';

export interface State {
  status: EntityStatus;
  cards?: Card[];
  page?:number;
  totalCount?:number;
  filter?: Filter;
  error?: unknown;
}

export const initialState: State = {
  status: EntityStatus.Initial,
  cards: [],
  page: 0,
  totalCount:0,
  filter: null,
  error: undefined
};

export const reducer = createReducer(
  initialState,
  on(CardActions.loadCards, (state): State => ({ ...state,  error: undefined, status: EntityStatus.Pending })),
  on(CardActions.saveCards, (state, { cards, page, filter, totalCount, status, error }): State => {
    const cardsState = page === 0 ? [...cards] : [...state?.cards, ...cards];
    return ({ ...state, cards: cardsState || [], page, filter, totalCount, status, error })
  }),

);
