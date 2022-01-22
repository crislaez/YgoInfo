import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NotificationModule } from '@ygopro/shared/notification/notification.module';
import { TrapEffects } from './effects/trap.effects';
import * as fromTrap from './reducers/trap.reducer';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationModule,
    StoreModule.forFeature(fromTrap.trapFeatureKey, fromTrap.reducer),
    EffectsModule.forFeature([TrapEffects]),
  ]
})
export class TrapModule { }
