import { combineReducers } from "@ngrx/store";
import * as fromBanlistOCG from "./banlist-ocg.reducer";
import * as fromBanlistTCG from "./banlist-tcg.reducer";

export const combineFeatureKey = 'banlist';

export interface CombineState {
  [fromBanlistTCG.banlistTCGFeatureKey]: fromBanlistTCG.State;
  [fromBanlistOCG.balinstOCGFeatureKey]: fromBanlistOCG.State;
};

export const reducer = combineReducers({
  [fromBanlistTCG.banlistTCGFeatureKey]: fromBanlistTCG.reducer,
  [fromBanlistOCG.balinstOCGFeatureKey]: fromBanlistOCG.reducer
});
