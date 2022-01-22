import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LangGuard } from './core/i18n/guards/lang.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'magic',
    loadChildren: () => import('./magic-card/magic-card.module').then( m => m.MagicCardPageModule),
    // canLoad: [LangGuard],
    // canActivate: [LangGuard],
  },
  {
    path: 'monster',
    loadChildren: () => import('./monster-card/monster-card.module').then( m => m.MonsterCardPageModule),
    // canActivate: [LangGuard],
  },
  {
    path: 'trap',
    loadChildren: () => import('./trap-card/trap-card.module').then( m => m.TrapCardPageModule),
    // canActivate: [LangGuard],
  },
  {
    path: 'storage',
    loadChildren: () => import('./storage/storage.module').then( m => m.StoragePageModule),
    // canActivate: [LangGuard],
  },
  {
    path: 'banlist',
    loadChildren: () => import('./banlist/banlist.module').then( m => m.BanlistPageModule),
    // canActivate: [LangGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
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
