import { createAction, props } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';


// TYPES
export const loadTypes = createAction(
  '[Filter] Load Types'
);

export const saveTypes = createAction(
  '[Filter] Save Types',
  props<{ types: string[], error:unknown, status:EntityStatus }>()
);


// ATTRIBUTES
export const loadAttributes = createAction(
  '[Filter] Load Attributes'
);

export const saveAttributtes = createAction(
  '[Filter] Save Attributes',
  props<{ attributes: string[], error:unknown, status:EntityStatus }>()
);


// RACES
export const loadRaces = createAction(
  '[Filter] Load Races'
);

export const saveRaces = createAction(
  '[Filter] Save Races',
  props<{ races: string[], error:unknown, status:EntityStatus }>()
);


// ARCHETYPES
export const loadArchetypes = createAction(
  '[Filter] Load Archetypes'
);

export const saveArchetypes = createAction(
  '[Filter] Save Archetypes',
  props<{ archetypes: string[], error:unknown, status:EntityStatus }>()
);