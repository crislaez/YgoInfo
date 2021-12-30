import { createAction, props } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/helpers/functions';
import { Card } from '@ygopro/shared/shared/utils/models';


export const loadMagics = createAction(
  '[Magic] Load Magic',
  props<{ offset?: number, fname?:string, race?:string, format?: string }>()
);

export const saveMagics = createAction(
  '[Magic] Save Magic',
  props<{ magics: Card[], total:number, error:unknown, status:EntityStatus, offset: number, fname?:string, race?:string, format?: string  }>()
);


