import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CardModalModule } from '@ygopro/shared-ui/card-modal/card-modal.module';
import { CardItemModule } from '@ygopro/shared-ui/card/card.module';
import { NoDataModule } from '@ygopro/shared-ui/no-data/no-data.module';
import { PopoverModule } from '@ygopro/shared-ui/popover/popover.module';
import { SpinnerModule } from '@ygopro/shared-ui/spinner/spinner.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { StorageModule } from '@ygopro/shared/storage/storage.module';
import { LongPressModule } from 'ionic-long-press';
import { StoragePage } from './containers/storage.page';
import { StoragePageRoutingModule } from './storage-routing.module';

const SHARED_MODULE = [
  StorageModule,
];

const SHARED_UI_MODULE = [
  NoDataModule,
  SpinnerModule,
  PopoverModule,
  CardItemModule,
  CardModalModule
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ...SHARED_MODULE,
    ...SHARED_UI_MODULE,
    SharedModule,
    LongPressModule,
    TranslateModule.forChild(),
    StoragePageRoutingModule
  ],
  declarations: [StoragePage]
})
export class StoragePageModule {}
