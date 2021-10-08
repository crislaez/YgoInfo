import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCard from '../reducers/card.reducer';

export const selectorCardState = createFeatureSelector<fromCard.State>(
  fromCard.cardFeatureKey
);

export const getStatus = createSelector(
  selectorCardState,
  (state) => state.status
);

export const getCard = createSelector(
  selectorCardState,
  (state) => state.card
);

export const getError = createSelector(
  selectorCardState,
  (state) => state.error
);

