import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSet from '../reducers/set.reducer';

export const selectSetState = createFeatureSelector<fromSet.State>(
  fromSet.setFeatureKey
);

export const getStatus = createSelector(
  selectSetState,
  (state) => state?.status
);

export const getSets = createSelector(
  selectSetState,
  (state) => state?.sets
);

export const getLastSets = createSelector(
  selectSetState,
  (state) => state?.lastSets
);

export const getError = createSelector(
  selectSetState,
  (state) => state?.error
);
