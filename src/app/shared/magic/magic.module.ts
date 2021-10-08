import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MagicEffects } from './effects/magic.effects';
import * as fromMagic from './reducers/magic.reducer';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromMagic.magicFeatureKey, fromMagic.reducer),
    EffectsModule.forFeature([MagicEffects]),
  ]
})
export class MagicModule { }
