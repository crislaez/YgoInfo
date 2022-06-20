import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { GenericsModule } from '@ygopro/shared-ui/generics/generics.module';
import { SetModule } from '@ygopro/shared/set/set.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { ShowAllPage } from './containers/show-all.page';
import { ShowAllPageRoutingModule } from './show-all-routing.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    GenericsModule,
    SharedModule,
    SetModule,
    TranslateModule.forChild(),
    ShowAllPageRoutingModule
  ],
  declarations: [ShowAllPage]
})
export class ShowAllPageModule {}
