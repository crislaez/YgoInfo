import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'magic',
    loadChildren: () => import('./magic-card/magic-card.module').then( m => m.MagicCardPageModule)
  },
  {
    path: 'monster',
    loadChildren: () => import('./monster-card/monster-card.module').then( m => m.MonsterCardPageModule)
  },
  {
    path: 'trap',
    loadChildren: () => import('./trap-card/trap-card.module').then( m => m.TrapCardPageModule)
  },
  {
    path: 'card',
    loadChildren: () => import('./card/card.module').then( m => m.CardPageModule)
  },
  {
    path: 'storage',
    loadChildren: () => import('./storage/storage.module').then( m => m.StoragePageModule)
  },
  {
    path: '**',
    redirectTo: 'monster',
    pathMatch: 'full',
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
