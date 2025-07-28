import { Component, AfterViewInit } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements AfterViewInit {
  constructor(private _befService: BefService) {
    /* this._befService.changeSections(['valueTraductor', 'abreviationTraductors']); */
    /* this._befService.changeParts([]); */
    this._befService.changeDebugOption(true);
    this._befService.pushColors({
      monster: '#00AA00',
      futurePop: '#9700FF',
    });
  }
  ngAfterViewInit() {
    this.cssCreate();
  }
  cssCreate() {
    this._befService.cssCreate();
  }
}
