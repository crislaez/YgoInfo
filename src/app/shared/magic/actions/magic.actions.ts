import { createAction, props } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import { Magic } from '../models';


export const loadMagics = createAction(
  '[Magic] Load Magic',
  props<{ offset?: number, fname?:string, race?:string }>()
);

export const saveMagics = createAction(
  '[Magic] Save Magic',
  props<{ magics: Magic[], total:number, error:unknown, status:EntityStatus, offset: number, fname?:string, race?:string }>()
);

export const loadMagicsFailure = createAction(
  '[Magic] Load Magic Failure'
  // props<{error: unknown}>()
);



