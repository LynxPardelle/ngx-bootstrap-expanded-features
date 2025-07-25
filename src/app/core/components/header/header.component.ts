import { Component, AfterViewInit } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements AfterViewInit {
  constructor(private _befService: BefService) {}

  ngAfterViewInit() {
    this.cssCreate();
  }

  cssCreate() {
    this._befService.cssCreate();
  }
}
