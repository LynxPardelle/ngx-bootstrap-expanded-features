import { Component, OnInit } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';

@Component({
    selector: 'app-z-index',
    templateUrl: './z-index.component.html',
    styleUrls: ['./z-index.component.scss'],
    standalone: false
})
export class ZIndexComponent implements OnInit {
  constructor(private _befService: BefService) {}

  ngOnInit(): void {
    this.cssCreate();
  }

  cssCreate() {
    this._befService.cssCreate();
  }
}
