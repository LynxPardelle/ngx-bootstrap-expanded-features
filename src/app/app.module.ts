import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './components/header/header.component';
import { AsideComponent } from './components/aside/aside.component';
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';

import { NgxBootstrapExpandedFeaturesService } from 'ngx-bootstrap-expanded-features';

@NgModule({
  declarations: [AppComponent, HeaderComponent, AsideComponent, MainComponent, FooterComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [NgxBootstrapExpandedFeaturesService],
  bootstrap: [AppComponent],
})
export class AppModule {}
