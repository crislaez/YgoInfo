import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TrapEffects } from './effects/trap.effects';
import * as fromTrap from './reducers/trap.reducer';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromTrap.trapFeatureKey, fromTrap.reducer),
    EffectsModule.forFeature([TrapEffects]),
  ]
})
export class TrapModule { }
