import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SetModule } from '@ygopro/shared/set/set.module';
import { SwiperModule } from 'swiper/angular';
import { HomePage } from './containers/home.page';
import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetModule,
    SwiperModule,
    TranslateModule.forChild(),
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
