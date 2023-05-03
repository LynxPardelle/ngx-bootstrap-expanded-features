import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './core/components/header/header.component';
import { AsideComponent } from './core/components/aside/aside.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { TestingLibraryComponent } from './core/components/testing-library/testing-library.component';
import { HomeComponent } from './core/components/home/home.component';
import { AboutComponent } from './core/components/about/about.component';
import { ErrorComponent } from './core/components/error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AsideComponent,
    FooterComponent,
    TestingLibraryComponent,
    HomeComponent,
    AboutComponent,
    ErrorComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
