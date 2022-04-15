import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { GenericsModule } from '@ygopro/shared-ui/generics/generics.module';
import { SetModule } from '@ygopro/shared/set/set.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { SwiperModule } from 'swiper/angular';
import { HomePage } from './containers/home.page';
import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SetModule,
    SwiperModule,
    SharedModule,
    GenericsModule,
    TranslateModule.forChild(),
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
