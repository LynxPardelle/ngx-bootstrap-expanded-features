import { Component, OnInit } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss'],
})
export class BasicComponent implements OnInit {
  public colors: string[] = [];
  constructor(private _befService: BefService) {}

  ngOnInit(): void {
    this.cssCreate();
    this._befService.getColorsNames().forEach((colorName) => {
      this.colors.push(colorName);
    });
  }

  cssCreate() {
    this._befService.cssCreate();
  }
}
