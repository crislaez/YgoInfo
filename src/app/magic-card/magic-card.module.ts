import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FilterModule } from '@ygopro/shared/filter/filter.module';
import { MagicModule } from '@ygopro/shared/magic/magic.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
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
    FilterModule,
    MagicCardPageRoutingModule
  ],
  declarations: [MagicCardPage]
})
export class MagicCardPageModule {}
