import { Component, AfterViewInit } from '@angular/core';
/* NGX-BEF */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: false
})
export class FooterComponent implements AfterViewInit {
  public combos: { [key: string]: string[] } = {
    createButton: [
      'bef-bg-randNumA__OPA__0_75',
      'bef-text-randNumB',
      'bef-p-0_25rem__1rem',
      'bef-rounded-1rem',
    ],
  };
  // BEF
  public colors: any = {
    randNumA: `#${this.RandHex()}`,
    randNumB: `#${this.RandHex()}`,
  };
  constructor(private _befService: BefService) {
    //BEF
    this._befService.pushCombos(this.combos);
    this._befService.pushColors(this.colors);
  }
  ngAfterViewInit() {
    this.cssCreate();
  }

  cssCreate() {
    this._befService.cssCreate();
    this._befService.updateColor('randNumA', `#${this.RandHex()}`);
    setTimeout(() => {
      this._befService.updateColor('randNumB', `#${this.RandHex()}`);
    }, this._befService.timeBetweenReCreate + 10);
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
