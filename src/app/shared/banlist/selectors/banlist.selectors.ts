import { createFeatureSelector, createSelector } from '@ngrx/store';

import { combineFeatureKey, CombineState } from '../reducers';
import { balinstOCGFeatureKey } from "../reducers/banlist-ocg.reducer";
import { banlistTCGFeatureKey } from "../reducers//banlist-tcg.reducer";

export const selectCombineState = createFeatureSelector<CombineState>(combineFeatureKey);

/* === BANLIST TCG === */
export const selectBanlistTCGState = createSelector(
  selectCombineState,
  (state) => state[banlistTCGFeatureKey]
);


export const selectBanlistTCGStatus = createSelector(
  selectBanlistTCGState,
  (state) => state.status
);

export const selectBanlistTCG = createSelector(
  selectBanlistTCGState,
  (state) => state.banlistTCG
);

export const selectBanlistTCGError = createSelector(
  selectBanlistTCGState,
  (state) => state.error
);



/* === BANLIST OCG === */
export const selectBanlistOCGState = createSelector(
  selectCombineState,
  (state) => state[balinstOCGFeatureKey]
);

export const selectBanlistOCGStatus = createSelector(
  selectBanlistOCGState,
  (state) => state.status
);

export const selectBanlistOCG = createSelector(
  selectBanlistOCGState,
  (state) => state.banlistOCG
);

export const selectBanlistOCGError = createSelector(
  selectBanlistOCGState,
  (state) => state.error
);


