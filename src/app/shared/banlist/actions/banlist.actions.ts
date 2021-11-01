import { createAction, props } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import { Card } from '@ygopro/shared/shared/models';


export const loadBanlist = createAction(
  '[Banlist] Load Banlist',
  props<{ banlistType: string }>()
);

export const saveBanlist = createAction(
  '[Banlist] Save Banlist',
  props<{ banlist: Card[], error:unknown, status:EntityStatus }>()
);
