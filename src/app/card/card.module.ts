import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CardPageRoutingModule } from './card-routing.module';
import { CardPage } from './containers/card.page';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from '@ygopro/shared/card/card.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardModule,
    TranslateModule.forChild(),
    CardPageRoutingModule
  ],
  declarations: [CardPage]
})
export class CardPageModule {}
