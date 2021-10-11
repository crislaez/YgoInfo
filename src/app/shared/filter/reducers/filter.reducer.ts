import { createReducer, on } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import * as FiltersActions from '../actions/filter.actions';

export const filterFeatureKey = 'filter';

export interface State {
  status: EntityStatus;
  archetypes?:string[];
  types?:string[];
  attributes?:string[];
  races?:string[];
  formats?:string[];
  error?: unknown;
}

export const initialState: State = {
  status: EntityStatus.Initial,
  archetypes:[],
  types:[],
  attributes:[],
  races:[],
  formats:[],
  error: undefined
};

export const reducer = createReducer(
  initialState,
  on(FiltersActions.loadArchetypes, (state): State => ({ ...state,  error: undefined, status: EntityStatus.Pending })),
  on(FiltersActions.saveArchetypes, (state, { archetypes, error, status}): State => ({ ...state, status, archetypes, error })),

  on(FiltersActions.loadTypes, (state): State => ({ ...state,  error: undefined, status: EntityStatus.Pending })),
  on(FiltersActions.saveTypes, (state, { types, error, status}): State => ({ ...state, status, types, error })),

  on(FiltersActions.loadArchetypes, (state): State => ({ ...state,  error: undefined, status: EntityStatus.Pending })),
  on(FiltersActions.saveAttributtes, (state, { attributes, error, status}): State => ({ ...state, status, attributes, error })),

  on(FiltersActions.loadRaces, (state): State => ({ ...state,  error: undefined, status: EntityStatus.Pending })),
  on(FiltersActions.saveRaces, (state, { races, error, status}): State => ({ ...state, status, races, error })),

  on(FiltersActions.loadFormats, (state): State => ({ ...state,  error: undefined, status: EntityStatus.Pending })),
  on(FiltersActions.saveFormats, (state, { formats, error, status}): State => ({ ...state, status, formats, error })),

);
