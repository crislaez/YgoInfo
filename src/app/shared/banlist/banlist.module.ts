import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NotificationModule } from '@ygopro/shared/notification/notification.module';
import { BanlistEffects } from './effects/banlist.effects';
import { combineFeatureKey, reducer } from './reducers';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationModule,
    StoreModule.forFeature(combineFeatureKey, reducer),
    EffectsModule.forFeature([BanlistEffects]),
  ]
})
export class BanlistModule { }
