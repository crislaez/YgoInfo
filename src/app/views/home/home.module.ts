import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CarruselModule } from '@ygopro/shared-ui/carrusel/carrusel.module';
import { InfiniteScrollModule } from '@ygopro/shared-ui/infinite-scroll/infinite-scroll.module';
import { ModalFilterModule } from '@ygopro/shared-ui/modal-filter/modal-filter.module';
import { NoDataModule } from '@ygopro/shared-ui/no-data/no-data.module';
import { SpinnerModule } from '@ygopro/shared-ui/spinner/spinner.module';
import { SetModule } from '@ygopro/shared/set/set.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { SwiperModule } from 'swiper/angular';
import { HomePage } from './containers/home.page';
import { HomePageRoutingModule } from './home-routing.module';

const SHARED_MODULE = [
  SetModule,
];

const SHARED_UI_MODULE = [
  NoDataModule,
  SpinnerModule,
  CarruselModule,
  ModalFilterModule,
  InfiniteScrollModule
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ...SHARED_MODULE,
    ...SHARED_UI_MODULE,
    SwiperModule, //<-
    SharedModule,
    TranslateModule.forChild(),
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
