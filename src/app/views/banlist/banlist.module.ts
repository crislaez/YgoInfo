import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CardModalModule } from '@ygopro/shared-ui/card-modal/card-modal.module';
import { InfiniteScrollModule } from '@ygopro/shared-ui/infinite-scroll/infinite-scroll.module';
import { NoDataModule } from '@ygopro/shared-ui/no-data/no-data.module';
import { SpinnerModule } from '@ygopro/shared-ui/spinner/spinner.module';
import { BanlistModule } from '@ygopro/shared/banlist/banlist.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { BanlistPageRoutingModule } from './banlist-routing.module';
import { BanlistListComponent } from './components/banlist-list.component';
import { BanlistPage } from './containers/banlist.page';

const SHARED_MODULE = [
  BanlistModule,
];

const SHARED_UI_MODULE = [
  NoDataModule,
  SpinnerModule,
  CardModalModule,
  InfiniteScrollModule
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ...SHARED_MODULE,
    ...SHARED_UI_MODULE,
    SharedModule,
    TranslateModule.forChild(),
    BanlistPageRoutingModule
  ],
  declarations: [
    BanlistPage,
    BanlistListComponent
  ]
})
export class BanlistPageModule {}
