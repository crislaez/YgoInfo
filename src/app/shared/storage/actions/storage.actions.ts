import { createAction, props } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import { Card } from '@ygopro/shared/shared/models';


export const loadStorage = createAction(
  '[Storage] Load Storage',
);

export const saveStorage = createAction(
  '[Storage] Save Storage',
  props<{ storage: Card[], error:unknown, status:EntityStatus }>()
);

export const loadStorageFailure = createAction(
  '[Storage] Load Storage Failure',
  props<{error?: unknown, message?: string}>()
);



export const deleteCard = createAction(
  '[Storage] Delete Card',
  props<{ id:number }>()
);

export const deleteCardSuccess = createAction(
  '[Storage] Delete Card Success',
  props<{ message?:string }>()
);

export const deleteCardFailure= createAction(
  '[Storage] Delete Card Failure',
  props<{ error?:unknown, message?: string }>()
);



export const saveCard = createAction(
  '[Storage] Save Card',
  props<{ card:Card }>()
);

export const saveCardSuccess = createAction(
  '[Storage] Save Card Success',
  props<{ message?:string }>()
);

export const saveCardFailure = createAction(
  '[Storage] Save Card Failure',
  props<{ error?:unknown, message?: string }>()
);


