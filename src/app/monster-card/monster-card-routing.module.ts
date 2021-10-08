import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonsterCardPage } from './containers/monster-card.page';


const routes: Routes = [
  {
    path: '',
    component: MonsterCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonsterCardPageRoutingModule {}
