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



export const deleteStorage = createAction(
  '[Storage] Delete Storage',
  props<{ id:number }>()
);

export const deleteStorageSuccess = createAction(
  '[Storage] Delete Storage Success',
  props<{ message:string }>()
);

export const deleteStorageFailure= createAction(
  '[Storage] Delete Storage Failure',
  props<{ error?:unknown, message?: string }>()
);



export const createStorage = createAction(
  '[Storage] Create Storage',
  props<{ card:Card }>()
);

export const createStorageSuccess = createAction(
  '[Storage] Create Storage Success',
  props<{ message:string }>()
);

export const createStorageFailure = createAction(
  '[Storage] Create Storage Failure',
  props<{ error?:unknown, message?: string }>()
);


