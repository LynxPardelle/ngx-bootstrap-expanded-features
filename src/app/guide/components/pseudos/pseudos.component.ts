import { Component, OnInit } from '@angular/core';
import {
  NgxBootstrapExpandedFeaturesService as BefService,
  IBPS,
} from 'ngx-bootstrap-expanded-features';

@Component({
  selector: 'app-pseudos',
  templateUrl: './pseudos.component.html',
  styleUrls: ['./pseudos.component.scss'],
})
export class PseudosComponent implements OnInit {
  public pseudoClasses: string[] = [];
  public pseudoElements: string[] = [];
  public pseudoClassesCSS: string[] = [];
  public pseudoElementsCSS: string[] = [];
  constructor(private _befService: BefService) {}
  ngOnInit(): void {
    this.cssCreate();
    this.pseudoClasses = this._befService.pseudoClasses;
    this.pseudoElements = this._befService.pseudoElements;
    this.pseudoClassesCSS = this.pseudoClasses.map((pseudoClass: string) =>
      this._befService.camelToCSSValid(pseudoClass)
    );
    this.pseudoElementsCSS = this.pseudoElements.map((pseudoElement) =>
      this._befService.camelToCSSValid(pseudoElement)
    );
  }
  getHTML(option: string): string {
    switch (option) {
      case 'bghover':
        return `<p class="text-light bef bef-bg-indigo bef-bgHover-mystic" >
          Box with indigo background and a mystic background on hover.
        </p>`;
      case 'firstLetter':
        return `<p class="text-dark bef bef-textFirstLetter-indigo bef-fontWeightFirstLetter-bold bef-fsFirstLetter-3rem" >
        Text with the first letter in indigo, with font weight bold and font size of 3rem.
        </p>`;
      default:
        return ``;
    }
  }
  cssCreate() {
    this._befService.cssCreate();
  }
}
