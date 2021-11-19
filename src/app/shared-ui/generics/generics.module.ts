import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverComponent } from './components/poper.component';
import { ModalFilterComponent } from './components/modal-filter.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    PopoverComponent,
    ModalFilterComponent
  ],
  exports:[
    PopoverComponent,
    ModalFilterComponent
  ]
})
export class GenericsModule { }
