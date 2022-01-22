import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from '@ygopro/shared/card/card.module';
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
    SharedModule,
    LongPressModule,
    TranslateModule.forChild(),
    SetPageRoutingModule
  ],
  declarations: [SetPage]
})
export class SetPageModule {}
