import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SpinnerModule } from '../spinner/spinner.module';
import { InfiniteComponent } from './infinite.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SpinnerModule
  ],
  declarations: [
    InfiniteComponent
  ],
  exports:[
    InfiniteComponent
  ]
})
export class InfiniteScrollModule {}
