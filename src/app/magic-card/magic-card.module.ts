import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { GenericsModule } from '@ygopro/shared-ui/generics/generics.module';
import { FilterModule } from '@ygopro/shared/filter/filter.module';
import { MagicModule } from '@ygopro/shared/magic/magic.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { StorageModule } from '@ygopro/shared/storage/storage.module';
import { LongPressModule } from 'ionic-long-press';
import { MagicCardPage } from './containers/magic-card.page';
import { MagicCardPageRoutingModule } from './magic-card-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    MagicModule,
    SharedModule,
    LongPressModule,
    FilterModule,
    StorageModule,
    GenericsModule,
    MagicCardPageRoutingModule
  ],
  declarations: [MagicCardPage]
})
export class MagicCardPageModule {}
