import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SwiperModule } from 'swiper/angular';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SwiperComponent } from './swiper.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule,
    RouterModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    SwiperComponent
  ],
  exports:[
    SwiperComponent
  ]
})
export class CarruselModule {}
