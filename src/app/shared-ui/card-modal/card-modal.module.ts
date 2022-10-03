import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { GenericCardModule } from '../generic-card/generic-card.module';
import { NoDataModule } from '../no-data/no-data.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { CardModalComponent } from './card-modal.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    NoDataModule,
    SpinnerModule,
    GenericCardModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    CardModalComponent
  ],
  exports:[
    CardModalComponent
  ]
})
export class CardModalModule {}
