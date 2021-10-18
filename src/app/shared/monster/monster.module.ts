import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NotificationModule } from '@ygopro/shared/notification/notification.module';
import { MonsterEffects } from './effects/monster.effects';
import * as fromMonster from './reducers/monster.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationModule,
    StoreModule.forFeature(fromMonster.monsterFeatureKey, fromMonster.reducer),
    EffectsModule.forFeature([MonsterEffects]),
  ]
})
export class MonsterModule { }
