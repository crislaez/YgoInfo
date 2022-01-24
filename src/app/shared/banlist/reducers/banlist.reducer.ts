import { createReducer, on } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/utils/helpers/functions';
import { Card } from '@ygopro/shared/utils/models';
import * as BanlistActions from '../actions/banlist.actions';

export const cardFeatureKey = 'banlist';

export interface State {
  status: EntityStatus;
  banlist?: Card[];
  banlistType?:string;
  error?: unknown;
}

export const initialState: State = {
  status: EntityStatus.Initial,
  banlist: [],
  banlistType:'',
  error: undefined
};

export const reducer = createReducer(
  initialState,
  on(BanlistActions.loadBanlist, (state, { banlistType }): State => ({ ...state, banlistType, error: undefined, status: EntityStatus.Pending })),
  on(BanlistActions.saveBanlist, (state, { banlist, status, error }): State => ({ ...state, banlist, status, error }))
);
