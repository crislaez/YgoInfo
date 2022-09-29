import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LongPressModule } from 'ionic-long-press';
import { CardComponent } from './card.component.';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    // LongPressModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    CardComponent
  ],
  exports:[
    CardComponent
  ]
})
export class CardItemModule {}
