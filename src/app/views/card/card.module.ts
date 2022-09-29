import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CardModalModule } from '@ygopro/shared-ui/card-modal/card-modal.module';
import { CardItemModule } from '@ygopro/shared-ui/card/card.module';
import { InfiniteScrollModule } from '@ygopro/shared-ui/infinite-scroll/infinite-scroll.module';
import { ModalFilterModule } from '@ygopro/shared-ui/modal-filter/modal-filter.module';
import { NoDataModule } from '@ygopro/shared-ui/no-data/no-data.module';
import { PopoverModule } from '@ygopro/shared-ui/popover/popover.module';
import { SpinnerModule } from '@ygopro/shared-ui/spinner/spinner.module';
import { CardModule } from '@ygopro/shared/card/card.module';
import { FilterModule } from '@ygopro/shared/filter/filter.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { StorageModule } from '@ygopro/shared/storage/storage.module';
import { CardPageRoutingModule } from './card-routing.module';
import { CardPage } from './containers/card.page';

const SHARED_MODULE = [
  CardModule,
  FilterModule,
  StorageModule
];

const SHARED_UI_MODULE = [
  NoDataModule,
  SpinnerModule,
  PopoverModule,
  CardItemModule,
  CardModalModule,
  ModalFilterModule,
  InfiniteScrollModule
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ...SHARED_MODULE,
    ...SHARED_UI_MODULE,
    SharedModule,
    // LongPressModule,
    TranslateModule.forChild(),
    CardPageRoutingModule
  ],
  declarations: [
    CardPage
  ]
})
export class CardPageModule {}
