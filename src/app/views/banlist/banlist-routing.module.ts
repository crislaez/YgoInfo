import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BanlistPage } from './containers/banlist.page';


const routes: Routes = [
  {
    path: '',
    component: BanlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BanlistPageRoutingModule {}
