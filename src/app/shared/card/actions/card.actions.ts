import { createAction, props } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import { Card } from '@ygopro/shared/shared/models';


export const loadCard = createAction(
  '[Card] Load Card',
  props<{ id?:number }>()
);

export const saveCard = createAction(
  '[Card] Save Card',
  props<{ card: Card, error:unknown, status:EntityStatus }>()
);

export const loadCardFailure = createAction(
  '[Card] Load Card Failure'
);



