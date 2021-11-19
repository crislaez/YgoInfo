import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { GenericsModule } from '@ygopro/shared-ui/generics/generics.module';
import { FilterModule } from '@ygopro/shared/filter/filter.module';
import { MonsterModule } from '@ygopro/shared/monster/monster.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { StorageModule } from '@ygopro/shared/storage/storage.module';
import { LongPressModule } from 'ionic-long-press';
import { MonsterCardPage } from './containers/monster-card.page';
import { MonsterCardPageRoutingModule } from './monster-card-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    MonsterModule,
    SharedModule,
    LongPressModule,
    FilterModule,
    StorageModule,
    GenericsModule,
    MonsterCardPageRoutingModule
  ],
  declarations: [
    MonsterCardPage
  ]
})
export class MonsterCardPageModule {}
