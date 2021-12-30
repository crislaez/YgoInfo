import { createAction, props } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/helpers/functions';
import { Card } from '@ygopro/shared/shared/utils/models';


export const loadCard = createAction(
  '[Card] Load Card',
  props<{ id?:number }>()
);

export const saveCard = createAction(
  '[Card] Save Card',
  props<{ card: Card, error:unknown, status:EntityStatus }>()
);
