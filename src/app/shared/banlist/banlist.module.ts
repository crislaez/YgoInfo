import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationModule } from '@ygopro/shared/notification/notification.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BanlistEffects } from './effects/banlist.effects';
import * as fromBanlist from './reducers/banlist.reducer';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationModule,
    StoreModule.forFeature(fromBanlist.cardFeatureKey, fromBanlist.reducer),
    EffectsModule.forFeature([BanlistEffects]),
  ]
})
export class BanlistModule { }
