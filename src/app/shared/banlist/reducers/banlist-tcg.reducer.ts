import { createReducer, on } from '@ngrx/store';
import { Card } from '@ygopro/shared/models';
import { EntityStatus } from '@ygopro/shared/utils/functions';
import * as BanlistActions from '../actions/banlist.actions';

export const banlistTCGFeatureKey = 'banlist-tcg';

export interface State {
  status: EntityStatus;
  banlistTCG?: Card[];
  error?: unknown;
}

export const initialState: State = {
  status: EntityStatus.Initial,
  banlistTCG: [],
  error: undefined
};

export const reducer = createReducer(
  initialState,
  on(BanlistActions.loadTCGBanlist, (state): State => ({ ...state, error: undefined, status: EntityStatus.Pending })),
  on(BanlistActions.saveTCGBanlist, (state, { banlistTCG, status, error }): State => ({ ...state, banlistTCG, status, error }))
);
