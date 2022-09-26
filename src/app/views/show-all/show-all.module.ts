import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { GenericCardModule } from '@ygopro/shared-ui/generic-card/generic-card.module';
import { NoDataModule } from '@ygopro/shared-ui/no-data/no-data.module';
import { SpinnerModule } from '@ygopro/shared-ui/spinner/spinner.module';
import { SetModule } from '@ygopro/shared/set/set.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { ShowAllPage } from './containers/show-all.page';
import { ShowAllPageRoutingModule } from './show-all-routing.module';

const SHARED_MODULE = [
  SetModule,
];

const SHARED_UI_MODULE = [
  NoDataModule,
  SpinnerModule,
  GenericCardModule
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ...SHARED_MODULE,
    ...SHARED_UI_MODULE,
    SharedModule,
    TranslateModule.forChild(),
    ShowAllPageRoutingModule
  ],
  declarations: [ShowAllPage]
})
export class ShowAllPageModule {}
