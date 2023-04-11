import { Component, OnInit } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';

@Component({
  selector: 'app-testing-library',
  templateUrl: './testing-library.component.html',
  styleUrls: ['./testing-library.component.scss'],
})
export class TestingLibraryComponent implements OnInit {
  public classes2explore: string[] = [
    'bef-w-85per bef-bg-success bef-text-aqua bef-p-1_5rem bef-bgFirstChildHover-maroon span bef-bgSEL__spanCOM_btnMINwarning-dark bef-bcSEL__spanCOM_btnMINwarning-dark bef-bcSEL__spanCOM_btnMINwarningFocus-dark bef-textSEL__spanCOM_btnMINwarning-warning bef-mySEL__spanCOM_btnMINwarning-2rem',
    'bef-w-85per bef-bg-success bef-text-info bef-p-3rem bef-bgLastChild-lavender bef-pNthChildSD2ED-2rem span-span',
    'bef-w-75per bef-bg-warning bef-text-danger bef-contentBefore-CSPcomillas__simplesCSP bef-bgBefore-success',
    'bef-w-75per bef-bg-sm-success bef-text-sm-info',
    'bef-w-75per bef-bg-md-warning bef-text-md-danger',
    'bef-w-75per bef-bg-mystic bef-text-lavender',
    'bef-w-75per bef-bg-beast bef-text-blood bef-p-2_5rem',
    'bef-w-75per bef-bg-tree bef-text-old bef-p-45px bef-my-3_5rem',
    'bef-w-75per bef-bg-abyss__OPA__0_75 bef-text-fairy',
    'bef-w-75per bef-bg-HASH556677 bef-text-HASHFFAAEE',
    'bef-w-calcSD75per__MIN__100pxED bef-bg-summer bef-text-friend',
    'bef-w-100per bef-w-sm-75per bef-w-md-66per bef-w-lg-50per bef-w-xl-25per bef-w-xxl-12_5per bef-bg-mystic bef-text-lavender',
    'bef-w-75per bef-bg-beast bef-text-blood bef-p-1_5rem bef-my-calcSD5px__PLUS__1remED',
    'bef-w-75per bef-bg-tree bef-text-old bef-p-clampSD8pxCOM3vwCOM5remED bef-my-3_5rem',
    'bef-w-25per bef-bgHover-abyss bef-textHover-fairy bef-bgActive-HASH00AA93 bef-textActive-HASHAAFFAA bef-bgFocus-HASH93AA00 bef-textFocus-HASHFF00FF',
    'bef-w-66per bef-bg-mystic bef-text-lavender bef-border-3px__solid__lavender',
    'bef-w-75per bef-bg-beast bef-text-blood bef-p-2_5rem bef-bw-5px bef-bs-dashed bef-bc-blood',
    'bef-w-33_33per bef-bg-tree bef-text-old bef-p-45px bef-my-3_5rem bef-r-30px',
    'bef-w-75per bef-btn-abyss__OPA__0_75 bef-text-fairy',
    'bef-w-75per bef-btnOutline-mystic bef-textHover-lavender',
    'bef-w-75per bef-bg-tree bef-text-old bef-p-45px bef-my-3_5rem bef-opacity-0_25',
    'bef-w-75per bef-bg-beast bef-text-blood bef-p-2_5rem position-fixed bef-t-150px bef-s-150px',
    'bef-w-75per bef-bg-abyss__OPA__0_75 bef-text-fairy bef-textShadow-8px__4px__2px__tree bef-boxShadow-0px__8px__8px__blood',
    'bef-overflow-hidden',
    'bef-overflowX-scroll bef-w-200px bef-asd-as bef-noclass-muchotextosiosiosiosisoisosiso',
  ];
  public examples: any[] = [];
  constructor(private _befService: BefService) {}

  ngOnInit(): void {
    this.cssCreate();
    let interval = setInterval(() => {
      this.createNewExample();
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
    }, 10000);
  }

  createNewExample() {
    let minus: number = 0;
    let class2Explore: string;
    do {
      if (this.examples.length >= this.classes2explore.length) {
        minus += this.classes2explore.length;
      }
      class2Explore = this.classes2explore[this.examples.length - minus];
    } while (!class2Explore);
    this.examples.push(class2Explore);
    this.cssCreate();
  }

  cssCreate() {
    this._befService.cssCreate();
  }
}
