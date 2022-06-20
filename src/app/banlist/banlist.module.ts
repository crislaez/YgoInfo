import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { GenericsModule } from '@ygopro/shared-ui/generics/generics.module';
import { BanlistModule } from '@ygopro/shared/banlist/banlist.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { BanlistPageRoutingModule } from './banlist-routing.module';
import { BanlistListComponent } from './components/banlist-list.component';
import { BanlistPage } from './containers/banlist.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BanlistModule,
    SharedModule,
    GenericsModule,
    TranslateModule.forChild(),
    BanlistPageRoutingModule
  ],
  declarations: [
    BanlistPage,
    BanlistListComponent
  ]
})
export class BanlistPageModule {}
