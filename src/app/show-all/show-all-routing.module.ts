import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowAllPage } from './containers/show-all.page';


const routes: Routes = [
  {
    path: ':date',
    component: ShowAllPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowAllPageRoutingModule {}
