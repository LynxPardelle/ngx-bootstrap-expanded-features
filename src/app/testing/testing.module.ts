import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestingRoutingModule } from './testing-routing.module';
/* Components */
import { TestingLibraryComponent } from './components/testing-library/testing-library.component';
import { MultiClassesComponent } from './components/multi-classes/multi-classes.component';

@NgModule({
  declarations: [
    /* Components */
    TestingLibraryComponent,
    MultiClassesComponent,

  ],
  imports: [
    CommonModule,
    TestingRoutingModule
  ]
})
export class TestingModule { }
