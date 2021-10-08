import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CardEffects } from './effects/card.effects';
import * as fromCard from './reducers/card.reducer';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromCard.cardFeatureKey, fromCard.reducer),
    EffectsModule.forFeature([CardEffects]),
  ]
})
export class CardModule { }
