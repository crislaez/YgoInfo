import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FilterModule } from '@ygopro/shared/filter/filter.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { TrapModule } from '@ygopro/shared/trap/trap.module';
import { TrapCardPage } from './containers/trap-card.page';
import { TrapCardPageRoutingModule } from './trap-card-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    TrapModule,
    SharedModule,
    FilterModule,
    TrapCardPageRoutingModule
  ],
  declarations: [TrapCardPage]
})
export class TrapCardPageModule {}
