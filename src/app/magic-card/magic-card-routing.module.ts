import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MagicCardPage } from './containers/magic-card.page';


const routes: Routes = [
  {
    path: '',
    component: MagicCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MagicCardPageRoutingModule {}
