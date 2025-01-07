import { Component, OnInit } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
@Component({
    selector: 'app-advanced',
    templateUrl: './advanced.component.html',
    styleUrls: ['./advanced.component.scss'],
    standalone: false
})
export class AdvancedComponent implements OnInit {
  public abreviationsValues: { [key: string]: string } = {
    bor1: '5px__solid__black',
  };
  public abreviationsClasses = {
    bgFO75: 'bef-bg-fairy__OPA__0_75',
    tFL: 'bef-textFirstLetter',
  };
  public combos: { [key: string]: string[] } = {
    boxOne: [
      'bef-w-85per bef-border-1px__solid__dark bef-bg-success bef-text-aqua bef-p-1_5rem',
    ],
    boxCustom: [
      'bef-w-VAL1',
      'bef-border-VAL2',
      'bef-bg-VAL3',
      'bef-text-VAL4',
      'bef-p-VAL5',
    ],
  };
  constructor(private _befService: BefService) {}
  ngOnInit(): void {
    this._befService.pushAbreviationsValues(this.abreviationsValues);
    this._befService.pushAbreviationsClasses(this.abreviationsClasses);
    this._befService.pushCombos(this.combos);
    this.cssCreate();
  }
  getHTML(option: string): string {
    switch (option) {
      case 'firstLetter':
        return `<p class="text-dark bef bef-textFirstLetter-indigo bef-fontWeightFirstLetter-bold bef-fsFirstLetter-3rem" >
        Text with the first letter in indigo, with font weight bold and font size of 3rem.
        </p>`;
      case 'adj':
        return `<p class="bef bef-text-indigo bef-textSELADJspan-orange" >
          Some text with the color indigo.
        </p><span>Some text with the color orange.</span>`;
      case 'abbVEX':
        return `
        <p class="bef bef-border-bor1">
          Box with border
        </p>`;
      case 'abbCEX':
        return `
        <p class="bef bgFO75 tFL-beast">
          Box with fairy background with opacity 0.75 and text with first letter with beast color.
        </p>`;
      case 'combEX1':
        return `
        <p class="bef boxOne">
          Box with combo classes.
        </p>`;
      case 'combEX2':
        return `
        <p class="bef boxCustomVALSVL50perVL3px__dashed__grayVLtealVLbeastVL2rem">
          Box with combo classes.
        </p>`;
      default:
        return ``;
    }
  }
  cssCreate() {
    this._befService.cssCreate();
  }
}
