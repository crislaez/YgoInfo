import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { GenericsModule } from '@ygopro/shared-ui/generics/generics.module';
import { CardModule } from '@ygopro/shared/card/card.module';
import { FilterModule } from '@ygopro/shared/filter/filter.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { LongPressModule } from 'ionic-long-press';
import { SetPage } from './containers/set.page';
import { SetPageRoutingModule } from './set-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardModule,
    FilterModule,
    SharedModule,
    GenericsModule,
    LongPressModule,
    TranslateModule.forChild(),
    SetPageRoutingModule
  ],
  declarations: [SetPage]
})
export class SetPageModule {}
