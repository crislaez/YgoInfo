import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NotificationModule } from '@ygopro/shared/notification/notification.module';
import { StorageEffects } from './effects/storage.effect';
import * as fromStorage from './reducers/storage.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationModule,
    StoreModule.forFeature(fromStorage.storageFeatureKey, fromStorage.reducer),
    EffectsModule.forFeature([StorageEffects]),
  ]
})
export class StorageModule { }
