import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { GenericsModule } from '@ygopro/shared/generics/generics.module';
import { SharedModule } from '@ygopro/shared/shared/shared.module';
import { StorageModule } from '@ygopro/shared/storage/storage.module';
import { LongPressModule } from 'ionic-long-press';
import { StoragePage } from './containers/storage.page';
import { StoragePageRoutingModule } from './storage-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    SharedModule,
    LongPressModule,
    StorageModule,
    GenericsModule,
    StoragePageRoutingModule
  ],
  declarations: [StoragePage]
})
export class StoragePageModule {}
