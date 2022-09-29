import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { GenericCardModule } from '@ygopro/shared-ui/generic-card/generic-card.module';
import { InfiniteScrollModule } from '@ygopro/shared-ui/infinite-scroll/infinite-scroll.module';
import { ModalFilterModule } from '@ygopro/shared-ui/modal-filter/modal-filter.module';
import { NoDataModule } from '@ygopro/shared-ui/no-data/no-data.module';
import { SpinnerModule } from '@ygopro/shared-ui/spinner/spinner.module';
import { SetModule } from '@ygopro/shared/set/set.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { SetsPage } from './containers/sets.page';
import { SetsPageRoutingModule } from './sets-routing.module';

const SHARED_MODULE = [
  SetModule,
];

const SHARED_UI_MODULE = [
  NoDataModule,
  SpinnerModule,
  ModalFilterModule,
  GenericCardModule,
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
    SetsPageRoutingModule
  ],
  declarations: [SetsPage]
})
export class SetsPageModule {}
