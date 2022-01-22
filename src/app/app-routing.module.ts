import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LangGuard } from './core/i18n/guards/lang.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    // canActivate: [LangGuard],
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule),
    // canActivate: [LangGuard],
  },
  {
    path: 'set',
    loadChildren: () => import('./set/set.module').then( m => m.SetPageModule)
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
