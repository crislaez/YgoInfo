import { createAction, props } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import { Card } from '@ygopro/shared/shared/models';


export const loadTraps = createAction(
  '[Trap] Load Trap',
  props<{ offset?: number, fname?:string, race?:string, format?: string }>()
);

export const saveTraps = createAction(
  '[Trap] Save Trap',
  props<{ traps: Card[], total:number, error:unknown, status:EntityStatus, offset: number, fname?:string, race?:string, format?: string }>()
);

export const loadTrapsFailure = createAction(
  '[Trap] Load Trap Failure'
  // props<{error: unknown}>()
);



