import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromFilter from '../reducers/filter.reducer';

export const selectMonsterState = createFeatureSelector<fromFilter.State>(
  fromFilter.filterFeatureKey
);

export const getStatus = createSelector(
  selectMonsterState,
  (state) => state.status
);

export const getArchetypes = createSelector(
  selectMonsterState,
  (state) => state?.archetypes
);

export const getTypes = createSelector(
  selectMonsterState,
  (state) => state?.types
);

export const getRaces = createSelector(
  selectMonsterState,
  (state) => state?.races
);

export const getAttributes = createSelector(
  selectMonsterState,
  (state) => state?.attributes
);
