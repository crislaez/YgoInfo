import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BanlistModule } from '@ygopro/shared/banlist/banlist.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { BanlistPageRoutingModule } from './banlist-routing.module';
import { BanlistPage } from './containers/banlist.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BanlistModule,
    SharedModule,
    TranslateModule.forChild(),
    BanlistPageRoutingModule
  ],
  declarations: [BanlistPage]
})
export class BanlistPageModule {}
