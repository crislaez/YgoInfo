import { createAction, props } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import { Monster } from '../models';


export const loadMonsters = createAction(
  '[Monster] Load Monster',
  props<{ offset?: number, fname?:string, archetype?:string, attribute?:string, race?:string, typeCard?:string, format?: string }>()
);

export const saveMosters = createAction(
  '[Monster] Save Monster',
  props<{ monsters: Monster[], total:number, error:unknown, status:EntityStatus, offset: number, fname?:string, archetype?:string, attribute?:string, race?:string, typeCard?:string, format?: string }>()
);

export const loadMonstersFailure = createAction(
  '[Monster] Load Monster Failure'
  // props<{error: unknown}>()
);



