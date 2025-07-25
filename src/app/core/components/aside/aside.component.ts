import { Component, AfterViewInit } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
import { navMenu } from 'src/app/shared/info/navMenu';
import { INavMenu } from 'src/app/shared/interfaces/naveMenu';

@Component({
    selector: 'app-aside',
    templateUrl: './aside.component.html',
    styleUrls: ['./aside.component.scss'],
    standalone: false
})
export class AsideComponent implements AfterViewInit {
  public navMenu: INavMenu[] = navMenu;
  constructor(private _befService: BefService) {}
  ngAfterViewInit() {
    this.cssCreate();
  }

  cssCreate() {
    this._befService.cssCreate();
  }
}
