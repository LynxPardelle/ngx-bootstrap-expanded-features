import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* Components */
import { HomeComponent } from './core/components/home/home.component';
import { TestingLibraryComponent } from './core/components/testing-library/testing-library.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  /* Test */
  { path: 'testing', component: TestingLibraryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
