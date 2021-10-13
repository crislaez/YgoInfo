import { createReducer, on } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import * as StorageActions from '../actions/storage.actions';
import { Card } from '@ygopro/shared/shared/models';

export const storageFeatureKey = 'storage';

export interface State {
  status: EntityStatus;
  storage?: Card[];
  error?: unknown;
}

export const initialState: State = {
  status: EntityStatus.Initial,
  storage: [],
  error: undefined
};

export const reducer = createReducer(
  initialState,
  on(StorageActions.loadStorage, (state): State => ({ ...state,  error: undefined, status: EntityStatus.Pending })),
  on(StorageActions.saveStorage, (state, { storage, error, status }): State => ({ ...state, storage, error, status })),

  on(StorageActions.deleteStorage, (state): State => ({ ...state,  error: undefined, status: EntityStatus.Pending })),
  on(StorageActions.deleteStorageSuccess, (state): State => ({ ...state, status: EntityStatus.Loaded })),
  on(StorageActions.deleteStorageFailure, (state, { error}): State => ({ ...state, error, status: EntityStatus.Error })),

  on(StorageActions.createStorage, (state): State => ({ ...state,  error: undefined, status: EntityStatus.Pending })),
  on(StorageActions.createStorageSuccess, (state): State => ({ ...state, status: EntityStatus.Loaded })),
  on(StorageActions.createStorageFailure, (state, { error}): State => ({ ...state, error, status: EntityStatus.Error })),

);
