import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestingLibraryComponent } from './components/testing-library/testing-library.component';
import { MultiClassesComponent } from './components/multi-classes/multi-classes.component';
/* Components */
const routes: Routes = [
  {
    path: '',
    component: TestingLibraryComponent,
    children: [
      { path: '', redirectTo: 'testing', pathMatch: 'full' },
      { path: 'multi-classes', component: MultiClassesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestingRoutingModule {}
