import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShowAllPage } from './containers/show-all.page';
import { ShowAllPageRoutingModule } from './show-all-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowAllPageRoutingModule
  ],
  declarations: [ShowAllPage]
})
export class ShowAllPageModule {}
