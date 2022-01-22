import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from '@ygopro/shared/card/card.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { LongPressModule } from 'ionic-long-press';
import { SearchPage } from './containers/search.page';
import { SearchPageRoutingModule } from './search-routing.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    CardModule,
    SharedModule,
    LongPressModule,
    TranslateModule.forChild(),
    SearchPageRoutingModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
