import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { GenericsModule } from '@ygopro/shared-ui/generics/generics.module';
import { CardModule } from '@ygopro/shared/card/card.module';
import { FilterModule } from '@ygopro/shared/filter/filter.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { LongPressModule } from 'ionic-long-press';
import { SearchListComponent } from './components/search-list.component';
import { SearchPage } from './containers/search.page';
import { SearchPageRoutingModule } from './search-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    CardModule,
    FilterModule,
    SharedModule,
    GenericsModule,
    LongPressModule,
    TranslateModule.forChild(),
    SearchPageRoutingModule
  ],
  declarations: [
    SearchPage,
    SearchListComponent
  ]
})
export class SearchPageModule {}
