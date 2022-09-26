import { createAction, props } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/utils/functions';
import { Set } from '../models';


export const loadSets = createAction(
  '[Sets] Load Sets'
);

export const saveSets = createAction(
  '[Sets] Save Sets',
  props<{ sets: Set[],  error:unknown, status:EntityStatus }>()
);


