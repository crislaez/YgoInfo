import { createAction, props } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import { Trap } from '../models';


export const loadTraps = createAction(
  '[Trap] Load Trap',
  props<{ offset?: number, fname?:string, race?:string }>()
);

export const saveTraps = createAction(
  '[Trap] Save Trap',
  props<{ traps: Trap[], total:number, error:unknown, status:EntityStatus, offset: number, fname?:string, race?:string }>()
);

export const loadTrapsFailure = createAction(
  '[Trap] Load Trap Failure'
  // props<{error: unknown}>()
);



