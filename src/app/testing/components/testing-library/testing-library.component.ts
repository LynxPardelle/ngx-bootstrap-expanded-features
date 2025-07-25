import { Component, OnInit } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';

@Component({
  selector: 'app-testing-library',
  templateUrl: './testing-library.component.html',
  styleUrls: ['./testing-library.component.scss'],
  standalone: false,
})
export class TestingLibraryComponent implements OnInit {
  public combos: { [key: string]: string[] } = {
    navigationTesting: [
      /* h2 */
      'bef-cSEL__h2-futurePop',
      'bef-taSEL__h2-center',
      'bef-mSEL__h2-0_5rem',
      'bef-tshSEL__h2-1px__1px__0_5rem__futurePop',
      /* ul */
      'bef-lstySEL__ul-none',
      'bef-dSEL__ul-flex',
      'bef-fdSEL__ul-column',
      'bef-fdSEL__ul-md-row',
      'bef-flwrSEL__ul-wrap',
      'bef-jcSEL__ul-spaceMINevenly',
      'bef-aiSEL__ul-center',
      'bef-pSEL__ul-0',
      'bef-bgSEL__ul-dark__OPA__0_75',
      'bef-rSEL__ul-1_5rem',
      /* li */
      'bef-mxSEL__ul__li-1rem',
      'bef-mySEL__ul__li-0_5rem',
      'bef-pSEL__ul__li-1rem',
      'bef-bgSEL__ul__li-light',
      'bef-rSEL__ul__li-1rem',
      'bef-wmnSEL__ul__li-150px',
      /* a */
      'bef-tdeSEL__ul__li__a-none',
      'bef-cSEL__ul__li__a-futurePop',
      'bef-fwSEL__ul__li__a-bold',
    ],
  };
  constructor(private _befService: BefService) {}
  ngOnInit(): void {
    this._befService.changeDebugOption(true);
    this._befService.pushCombos(this.combos);
    this.cssCreate();
  }

  cssCreate() {
    this._befService.cssCreate();
  }
}
