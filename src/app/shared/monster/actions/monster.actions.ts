import { createAction, props } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/helpers/functions';
import { Card } from '@ygopro/shared/shared/utils/models';


export const loadMonsters = createAction(
  '[Monster] Load Monster',
  props<{ offset?: number, fname?:string, archetype?:string, attribute?:string, race?:string, typeCard?:string, format?: string, level?: string }>()
);

export const saveMosters = createAction(
  '[Monster] Save Monster',
  props<{ monsters: Card[], total:number, error:unknown, status:EntityStatus, offset: number, fname?:string, archetype?:string, attribute?:string, race?:string, typeCard?:string, format?: string, level?: string }>()
);

