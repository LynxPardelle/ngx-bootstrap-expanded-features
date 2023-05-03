import { Component, OnInit } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private _befService: BefService) {}
  ngOnInit(): void {
    this.cssCreate();
  }
  cssCreate() {
    this._befService.cssCreate();
  }
}
