import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromMagic from '../reducers/magic.reducer';

export const selectMagicState = createFeatureSelector<fromMagic.State>(
  fromMagic.magicFeatureKey
);

export const getStatusMagics = createSelector(
  selectMagicState,
  (state) => state.statusMagics
);

export const getOffset = createSelector(
  selectMagicState,
  (state) => state.offset
);

export const getTotal = createSelector(
  selectMagicState,
  (state) => state.total
);

export const getFname = createSelector(
  selectMagicState,
  (state) => state.fname
);

export const getRace = createSelector(
  selectMagicState,
  (state) => state.race
);

export const getStatusMagic = createSelector(
  selectMagicState,
  (state) => state.statusMagic
);

export const getMagics = createSelector(
  selectMagicState,
  (state) => state.magics
);

export const getMagic = createSelector(
  selectMagicState,
  (state) => state.magic
);

export const getError = createSelector(
  selectMagicState,
  (state) => state.error
);
