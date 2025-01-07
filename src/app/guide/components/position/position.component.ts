import { Component, OnInit } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';

@Component({
    selector: 'app-position',
    templateUrl: './position.component.html',
    styleUrls: ['./position.component.scss'],
    standalone: false
})
export class PositionComponent implements OnInit {
  constructor(private _befService: BefService) {}

  ngOnInit(): void {
    this.cssCreate();
  }

  cssCreate() {
    this._befService.cssCreate();
  }
}
