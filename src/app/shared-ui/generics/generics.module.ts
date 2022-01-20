import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverComponent } from './components/poper.component';
import { ModalFilterComponent } from './components/modal-filter.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CardModalComponent } from './components/card-modal.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    PopoverComponent,
    ModalFilterComponent,
    CardModalComponent,
  ],
  exports:[
    PopoverComponent,
    ModalFilterComponent,
    CardModalComponent
  ]
})
export class GenericsModule { }
