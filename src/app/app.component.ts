import { Component, DoCheck } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements DoCheck {
  title = 'bgx-bef';

  // BEF
  public colors: any = {
    monster: "#00AA00",
    futurePop: "#9700FF",
  };
  constructor(private _befService: BefService) {
    //BEF
    this._befService.pushColors(this.colors);

    this._befService.cssCreate();
  }

  ngDoCheck(): void {
    this._befService.cssCreate();
  }
}
