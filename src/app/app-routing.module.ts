import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
/* Components */
import { HomeComponent } from './core/components/home/home.component';
import { AboutComponent } from './core/components/about/about.component';
import { ErrorComponent } from './core/components/error/error.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  /* About */
  { path: 'about', pathMatch: 'full', component: AboutComponent },
  /* Guide */
  {
    path: 'guide',
    loadChildren: () =>
      import('./guide/guide.module').then((m) => m.GuideModule),
  },
  /* Test */
  { path: 'testing', loadChildren: () => import('./testing/testing.module').then((m) => m.TestingModule) },
  /* Error */
  { path: '**', component: ErrorComponent },
];
const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64],
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
