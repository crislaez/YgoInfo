import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ModalFilterComponent } from './modal-filter.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    ModalFilterComponent
  ],
  exports:[
    ModalFilterComponent
  ]
})
export class ModalFilterModule {}
