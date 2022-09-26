import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { GenericCardComponent } from './generic-card.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    GenericCardComponent
  ],
  exports:[
    GenericCardComponent
  ]
})
export class GenericCardModule {}
