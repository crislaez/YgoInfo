import { createAction, props } from '@ngrx/store';
import { Card } from '@ygopro/shared/models';
import { EntityStatus } from '@ygopro/shared/utils/functions';


export const loadTCGBanlist = createAction(
  '[Banlist] Load TCG Banlist',
  // props<{ banlistType: string }>()
);

export const saveTCGBanlist  = createAction(
  '[Banlist] Save TCG Banlist',
  props<{ banlistTCG: Card[], error:unknown, status:EntityStatus }>()
);



export const loadOCGBanlist = createAction(
  '[Banlist] Load OCG Banlist',
  // props<{ banlistType: string }>()
);

export const saveOCGBanlist = createAction(
  '[Banlist] Save OCG Banlist',
  props<{ banlistOCG: Card[], error:unknown, status:EntityStatus }>()
);
