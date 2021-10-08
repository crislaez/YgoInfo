import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrapCardPage } from './containers/trap-card.page';


const routes: Routes = [
  {
    path: '',
    component: TrapCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrapCardPageRoutingModule {}
