import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTrap from '../reducers/trap.reducer';

export const selectTrapState = createFeatureSelector<fromTrap.State>(
  fromTrap.trapFeatureKey
);

export const getStatusTraps = createSelector(
  selectTrapState,
  (state) => state.statusTraps
);

export const getOffset = createSelector(
  selectTrapState,
  (state) => state.offset
);

export const getTotal = createSelector(
  selectTrapState,
  (state) => state.total
);

export const getFname = createSelector(
  selectTrapState,
  (state) => state.fname
);

export const getRace = createSelector(
  selectTrapState,
  (state) => state.race
);

export const getStatusTrap = createSelector(
  selectTrapState,
  (state) => state.stratusTrap
);

export const getTraps = createSelector(
  selectTrapState,
  (state) => state.traps
);

export const getTrap = createSelector(
  selectTrapState,
  (state) => state.trap
);

export const getError = createSelector(
  selectTrapState,
  (state) => state.error
);
