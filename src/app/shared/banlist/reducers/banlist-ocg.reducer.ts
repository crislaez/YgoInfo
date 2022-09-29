import { createReducer, on } from '@ngrx/store';
import { Card } from '@ygopro/shared/models';
import { EntityStatus } from '@ygopro/shared/utils/functions';
import * as BanlistActions from '../actions/banlist.actions';

export const balinstOCGFeatureKey = 'banlist-ocg';

export interface State {
  status: EntityStatus;
  banlistOCG?: Card[];
  error?: unknown;
}

export const initialState: State = {
  status: EntityStatus.Initial,
  banlistOCG: [],
  error: undefined
};

export const reducer = createReducer(
  initialState,
  on(BanlistActions.loadOCGBanlist, (state): State => ({ ...state, error: undefined, status: EntityStatus.Pending })),
  on(BanlistActions.saveOCGBanlist, (state, { banlistOCG, status, error }): State => ({ ...state, banlistOCG, status, error })),
);
