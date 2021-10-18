import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NotificationModule } from '@ygopro/shared/notification/notification.module';
import { MagicEffects } from './effects/magic.effects';
import * as fromMagic from './reducers/magic.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationModule,
    StoreModule.forFeature(fromMagic.magicFeatureKey, fromMagic.reducer),
    EffectsModule.forFeature([MagicEffects]),
  ]
})
export class MagicModule { }
