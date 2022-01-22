import { createAction, props } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/helpers/functions';
import { Card } from '@ygopro/shared/shared/utils/models';
import { Filter } from '../models';


export const loadCards = createAction(
  '[Card] Load Cards',
  props<{ page: number, filter?: Filter }>()
);

export const saveCards = createAction(
  '[Card] Save Cards',
  props<{ cards: Card[], page: number, filter?: Filter, totalCount: number, error:unknown, status:EntityStatus }>()
);
