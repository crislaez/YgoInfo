import { createReducer, on } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import * as CardActions from '../actions/card.actions';
import { Card } from '@ygopro/shared/shared/models';

export const cardFeatureKey = 'card';

export interface State {
  status: EntityStatus;
  card?: Card;
  error?: unknown;
}

export const initialState: State = {
  status: EntityStatus.Initial,
  card: null,
  error: undefined
};

export const reducer = createReducer(
  initialState,
  on(CardActions.loadCard, (state): State => ({ ...state,  error: undefined, status: EntityStatus.Pending })),
  on(CardActions.saveCard, (state, { card, status, error }): State => ({ ...state, card, status, error }))
);
