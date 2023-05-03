import { Component, OnInit } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private _befService: BefService) {
    this._befService.pushColors({
      monster: '#00AA00',
      futurePop: '#9700FF',
    });
    this._befService.changeDebugOption();
  }
  ngOnInit(): void {
    this.cssCreate();
  }
  cssCreate() {
    this._befService.cssCreate();
  }
}
