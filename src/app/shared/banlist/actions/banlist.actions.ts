import { createAction, props } from '@ngrx/store';
import { Card } from '@ygopro/shared/models';
import { EntityStatus } from '@ygopro/shared/utils/functions';


export const loadBanlist = createAction(
  '[Banlist] Load Banlist',
  props<{ banlistType: string }>()
);

export const saveBanlist = createAction(
  '[Banlist] Save Banlist',
  props<{ banlist: Card[], error:unknown, status:EntityStatus }>()
);
