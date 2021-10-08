import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MonsterEffects } from './effects/monster.effects';
import * as fromMonster from './reducers/monster.reducer';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromMonster.monsterFeatureKey, fromMonster.reducer),
    EffectsModule.forFeature([MonsterEffects]),
  ]
})
export class MonsterModule { }
