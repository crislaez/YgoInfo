import { createAction, props } from '@ngrx/store';
import { Card } from '@ygopro/shared/models';
import { EntityStatus } from '@ygopro/shared/utils/functions';
import { Filter } from '../models';


export const loadCards = createAction(
  '[Card] Load Cards',
  props<{ page: number, filter?: Filter }>()
);

export const saveCards = createAction(
  '[Card] Save Cards',
  props<{ cards: Card[], page: number, filter?: Filter, totalCount: number, error:unknown, status:EntityStatus }>()
);



export const loadSetCards = createAction(
  '[Card] Load Set Cards',
  props<{ setName: string, page: number, filter?: Filter }>()
);

export const saveSetCards = createAction(
  '[Card] Save Set Cards',
  props<{ setName: string, cards: Card[], page: number, filter?: Filter, totalCount: number, error:unknown, status:EntityStatus }>()
);
