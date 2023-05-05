import { Component, OnInit } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
import { navMenu } from 'src/app/shared/info/navMenu';
import { INavMenu } from 'src/app/shared/interfaces/naveMenu';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  public navMenu: INavMenu[] = navMenu;
  constructor(private _befService: BefService) {}

  ngOnInit(): void {
    this.cssCreate();
  }

  cssCreate() {
    this._befService.cssCreate();
  }
}
