import { Component, OnInit } from '@angular/core';
import {
  NgxBootstrapExpandedFeaturesService as BefService,
  IBPS,
} from 'ngx-bootstrap-expanded-features';

@Component({
  selector: 'app-combinators',
  templateUrl: './combinators.component.html',
  styleUrls: ['./combinators.component.scss'],
})
export class CombinatorsComponent implements OnInit {
  constructor(private _befService: BefService) {}
  ngOnInit(): void {
    this.cssCreate();
  }
  getHTML(option: string): string {
    switch (option) {
      case 'descendant':
        return `<p class="bef bef-text-indigo bef-textSEL__span-orange" >
          Some text with the color indigo.
        <span>Some text with the color orange.</span>
        </p>`;
      case 'child':
        return `<p class="bef bef-text-indigo bef-textSELCHILDspan-orange" >
          Some text with the color indigo.
        <span>Some text with the color orange.</span>
        </p>`;
      case 'adj':
        return `<p class="bef bef-text-indigo bef-textSELADJspan-orange" >
          Some text with the color indigo.
        </p><span>Some text with the color orange.</span>`;
      case 'general':
        return `<p class="bef bef-text-indigo bef-textSELSIBLspan-orange" >
          Some text with the color indigo.
        </p>
        <span>Some text with the color orange.</span>
        `;
      default:
        return ``;
    }
  }
  cssCreate() {
    this._befService.cssCreate();
  }
}
