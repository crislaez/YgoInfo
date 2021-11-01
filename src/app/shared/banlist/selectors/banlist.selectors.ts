import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromBanlist from '../reducers/banlist.reducer';

export const selectorCardState = createFeatureSelector<fromBanlist.State>(
  fromBanlist.cardFeatureKey
);

export const getStatus = createSelector(
  selectorCardState,
  (state) => state.status
);

export const getBanlist = createSelector(
  selectorCardState,
  (state) => state.banlist
);

export const getError = createSelector(
  selectorCardState,
  (state) => state.error
);

