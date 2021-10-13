import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StorageEffects } from './effects/storage.effect';
import * as fromStorage from './reducers/storage.reducer';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromStorage.storageFeatureKey, fromStorage.reducer),
    EffectsModule.forFeature([StorageEffects]),
  ]
})
export class StorageModule { }
