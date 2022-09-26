import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NoDataComponent } from './no-data.component';

@NgModule({
  declarations: [
    NoDataComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  exports:[
    NoDataComponent
  ]
})
export class NoDataModule {}
