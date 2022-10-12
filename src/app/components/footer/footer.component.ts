import { Component, OnInit } from '@angular/core';
/* NGX-BEF */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  // BEF
  public colors: any = {
    randNumA: `#${this.RandHex()}`,
    randNumB: `#${this.RandHex()}`,
  };
  constructor(private _befService: BefService) {
    //BEF
    this._befService.pushColors(this.colors);
  }

  ngOnInit(): void {}

  cssCreate() {
    this._befService.cssCreate();
    this._befService.updateColor('randNumA', `#${this.RandHex()}`);
    this._befService.updateColor('randNumB', `#${this.RandHex()}`);
  }

  RandHex() {
    let result = '';
    const characters = '0123456789ABCDEF';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }
}
