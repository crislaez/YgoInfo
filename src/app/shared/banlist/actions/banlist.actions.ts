import { createAction, props } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/helpers/functions';
import { Card } from '@ygopro/shared/shared/utils/models';


export const loadBanlist = createAction(
  '[Banlist] Load Banlist',
  props<{ banlistType: string }>()
);

export const saveBanlist = createAction(
  '[Banlist] Save Banlist',
  props<{ banlist: Card[], error:unknown, status:EntityStatus }>()
);
