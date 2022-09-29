import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CardModalModule } from '@ygopro/shared-ui/card-modal/card-modal.module';
import { CardItemModule } from '@ygopro/shared-ui/card/card.module';
import { InfiniteScrollModule } from '@ygopro/shared-ui/infinite-scroll/infinite-scroll.module';
import { NoDataModule } from '@ygopro/shared-ui/no-data/no-data.module';
import { PopoverModule } from '@ygopro/shared-ui/popover/popover.module';
import { SpinnerModule } from '@ygopro/shared-ui/spinner/spinner.module';
import { BanlistModule } from '@ygopro/shared/banlist/banlist.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { StorageModule } from '@ygopro/shared/storage/storage.module';
import { BanlistPageRoutingModule } from './banlist-routing.module';
import { BanlistPage } from './containers/banlist.page';

const SHARED_MODULE = [
  BanlistModule,
  StorageModule,
];

const SHARED_UI_MODULE = [
  NoDataModule,
  SpinnerModule,
  PopoverModule,
  CardItemModule,
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
    BanlistPage
  ]
})
export class BanlistPageModule {}
