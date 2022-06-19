import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
  },
  {
    path: 'show-all',
    loadChildren: () => import('./show-all/show-all.module').then( m => m.ShowAllPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule),
  },
  {
    path: 'set',
    loadChildren: () => import('./set/set.module').then( m => m.SetPageModule)
  },
  {
    path: 'storage',
    loadChildren: () => import('./storage/storage.module').then( m => m.StoragePageModule),
  },
  {
    path: 'banlist',
    loadChildren: () => import('./banlist/banlist.module').then( m => m.BanlistPageModule),
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  }
];
@NgModule({
  imports: [
    // RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
