import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FilterEffects } from './effects/filter.effects';
import * as fromFilter from './reducers/filter.reducer';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromFilter.filterFeatureKey, fromFilter.reducer),
    EffectsModule.forFeature([FilterEffects]),
  ]
})
export class FilterModule { }
