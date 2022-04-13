import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LongPressModule } from 'ionic-long-press';
import { SwiperModule } from 'swiper/angular';
import { CardModalComponent } from './components/card-modal.component';
import { InfiniteScrollComponent } from './components/infinite-scroll.component';
import { ModalFilterComponent } from './components/modal-filter.component';
import { NoDataComponent } from './components/no-data.component';
import { PopoverComponent } from './components/poper.component';
import { SpinnerComponent } from './components/spinner.component';
import { SwiperComponent } from './components/swiper.component';


const COMPONENTS = [
  PopoverComponent,
  ModalFilterComponent,
  CardModalComponent,
  SpinnerComponent,
  NoDataComponent,
  InfiniteScrollComponent,
  SwiperComponent
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LongPressModule,
    SwiperModule,
    RouterModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports:[
    ...COMPONENTS
  ]
})
export class GenericsModule { }
