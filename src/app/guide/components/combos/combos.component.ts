import { Component, OnInit } from '@angular/core';
import {
  NgxBootstrapExpandedFeaturesService as BefService,
  IBPS,
} from 'ngx-bootstrap-expanded-features';

@Component({
    selector: 'app-combos',
    templateUrl: './combos.component.html',
    styleUrls: ['./combos.component.scss'],
    standalone: false
})
export class CombosComponent implements OnInit {
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
    cardBootstrapLike: [
      // Card
      'bef-maxWidth-VAL1DEF18remDEF bef-bg-VAL2DEFtransparentDEF bef-pos-relative bef-d-flex bef-flexDirection-column bef-border-1px__solid__rgbaSD255COM255COM255COM0_15ED bef-backgroundClip-borderMINbox bef-wordWrap-breakMINword bef-rounded-0_375rem bef-m-VAL3DEF1remDEF__auto bef-text-VAL4DEFwhiteDEF',
      // Card Body
      'bef-flexSELCHILDdiv-1__1__auto bef-pSELCHILDdiv-1rem',
      // Card Title
      'bef-mbSEL__h2COM_cardBootstrapLike__h3COM_cardBootstrapLike__h4COM_cardBootstrapLike__h5COM_cardBootstrapLike__h6-0_5rem',
      // Card Text
      'bef-mtSEL__p-0 bef-mbSEL__p-1rem bef-dSEL__p-block',
      // Card Link
      'bef-dSEL__a-inlineMINblock bef-fwSEL__a-400 bef-lhSEL__a-1_5 bef-taSEL__a-center bef-tdeSEL__a-none bef-verticalAlignSEL__a-middle bef-cursorSEL__a-pointer bef-userSelectSEL__a-none bef-pSEL__a-0_375rem__0_75rem bef-roundedSEL__a-0_25rem bef-transitionSEL__a-color___15s__easeMINinMINoutCOMbackgroundMINcolor___15s__easeMINinMINoutCOMborderMINcolor___15s__easeMINinMINoutCOMboxMINchadow___15s__easeMINinMINout bef-btnOutlineSEL__a-primary-lavender',
    ],
  };
  constructor(private _befService: BefService) {}
  ngOnInit(): void {
    this._befService.pushCombos(this.combos);
    this.cssCreate();
  }

  getHTML(option: string): string {
    switch (option) {
      case 'comb1':
        return `<!-- SOME CODE -->
        <!-- SCRIPT LINKED TO THE CDN VERSION -->
        <script>
          var combos = {
            boxOne: [
              'bef-w-85per bef-border-1px__solid__dark bef-bg-success bef-text-aqua bef-p-1_5rem',
            ],
            boxCustom: [
              'bef-w-VAL1','bef-border-VAL2','bef-bg-VAL3','bef-text-VAL4','bef-p-VAL5',
            ],
            cardBootstrapLike: [
              // Card
              'bef-maxWidth-VAL1DEF18remDEF bef-bg-VAL2DEFtransparentDEF bef-pos-relative bef-d-flex bef-flexDirection-column bef-border-1px__solid__rgbaSD255COM255COM255COM0_15ED bef-backgroundClip-borderMINbox bef-wordWrap-breakMINword bef-rounded-0_375rem bef-m-VAL3DEF1remDEF__auto bef-text-VAL4DEFwhiteDEF',
              // Card Body
              'bef-flexSELCHILDdiv-1__1__auto bef-pSELCHILDdiv-1rem',
              // Card Title
              'bef-mbSEL__h2COM_cardBootstrapLike__h3COM_cardBootstrapLike__h4COM_cardBootstrapLike__h5COM_cardBootstrapLike__h6-0_5rem',
              // Card Text
              'bef-mtSEL__p-0 bef-mbSEL__p-1rem bef-dSEL__p-block',
              // Card Link
              'bef-dSEL__a-inlineMINblock bef-fwSEL__a-400 bef-lhSEL__a-1_5 bef-taSEL__a-center bef-tdeSEL__a-none bef-verticalAlignSEL__a-middle bef-cursorSEL__a-pointer bef-userSelectSEL__a-none bef-pSEL__a-0_375rem__0_75rem bef-roundedSEL__a-0_25rem bef-transitionSEL__a-color___15s__easeMINinMINoutCOMbackgroundMINcolor___15s__easeMINinMINoutCOMborderMINcolor___15s__easeMINinMINoutCOMboxMINchadow___15s__easeMINinMINout bef-btnOutlineSEL__a-primary-lavender',
            ],
          };
          pushCombos(combos);
        </script>`;
      case 'comb2':
        return `import { cssCreate, pushCombos } from "bootstrap-expanded-features";
        const combos = {
          boxOne: [
            'bef-w-85per bef-border-1px__solid__dark bef-bg-success bef-text-aqua bef-p-1_5rem',
          ],
          boxCustom: [
            'bef-w-VAL1','bef-border-VAL2','bef-bg-VAL3','bef-text-VAL4','bef-p-VAL5',
          ],
          cardBootstrapLike: [
            // Card
            'bef-maxWidth-VAL1DEF18remDEF bef-bg-VAL2DEFtransparentDEF bef-pos-relative bef-d-flex bef-flexDirection-column bef-border-1px__solid__rgbaSD255COM255COM255COM0_15ED bef-backgroundClip-borderMINbox bef-wordWrap-breakMINword bef-rounded-0_375rem bef-m-VAL3DEF1remDEF__auto bef-text-VAL4DEFwhiteDEF',
            // Card Body
            'bef-flexSELCHILDdiv-1__1__auto bef-pSELCHILDdiv-1rem',
            // Card Title
            'bef-mbSEL__h2COM_cardBootstrapLike__h3COM_cardBootstrapLike__h4COM_cardBootstrapLike__h5COM_cardBootstrapLike__h6-0_5rem',
            // Card Text
            'bef-mtSEL__p-0 bef-mbSEL__p-1rem bef-dSEL__p-block',
            // Card Link
            'bef-dSEL__a-inlineMINblock bef-fwSEL__a-400 bef-lhSEL__a-1_5 bef-taSEL__a-center bef-tdeSEL__a-none bef-verticalAlignSEL__a-middle bef-cursorSEL__a-pointer bef-userSelectSEL__a-none bef-pSEL__a-0_375rem__0_75rem bef-roundedSEL__a-0_25rem bef-transitionSEL__a-color___15s__easeMINinMINoutCOMbackgroundMINcolor___15s__easeMINinMINoutCOMborderMINcolor___15s__easeMINinMINoutCOMboxMINchadow___15s__easeMINinMINout bef-btnOutlineSEL__a-primary-lavender',
          ],
        };
        pushCombos(combos);
        cssCreate();`;
      case 'import':
        return `import { NgxBootstrapExpandedFeaturesService as BefService } from "ngx-bootstrap-expanded-features";`;
      case 'comb3':
        return `export class YourComponent {
          public combos = {
            boxOne: [
              'bef-w-85per bef-border-1px__solid__dark bef-bg-success bef-text-aqua bef-p-1_5rem',
            ],
            boxCustom: [
              'bef-w-VAL1','bef-border-VAL2','bef-bg-VAL3','bef-text-VAL4','bef-p-VAL5',
            ],
            cardBootstrapLike: [
              // Card
              'bef-maxWidth-VAL1DEF18remDEF bef-bg-VAL2DEFtransparentDEF bef-pos-relative bef-d-flex bef-flexDirection-column bef-border-1px__solid__rgbaSD255COM255COM255COM0_15ED bef-backgroundClip-borderMINbox bef-wordWrap-breakMINword bef-rounded-0_375rem bef-m-VAL3DEF1remDEF__auto bef-text-VAL4DEFwhiteDEF',
              // Card Body
              'bef-flexSELCHILDdiv-1__1__auto bef-pSELCHILDdiv-1rem',
              // Card Title
              'bef-mbSEL__h2COM_cardBootstrapLike__h3COM_cardBootstrapLike__h4COM_cardBootstrapLike__h5COM_cardBootstrapLike__h6-0_5rem',
              // Card Text
              'bef-mtSEL__p-0 bef-mbSEL__p-1rem bef-dSEL__p-block',
              // Card Link
              'bef-dSEL__a-inlineMINblock bef-fwSEL__a-400 bef-lhSEL__a-1_5 bef-taSEL__a-center bef-tdeSEL__a-none bef-verticalAlignSEL__a-middle bef-cursorSEL__a-pointer bef-userSelectSEL__a-none bef-pSEL__a-0_375rem__0_75rem bef-roundedSEL__a-0_25rem bef-transitionSEL__a-color___15s__easeMINinMINoutCOMbackgroundMINcolor___15s__easeMINinMINoutCOMborderMINcolor___15s__easeMINinMINoutCOMboxMINchadow___15s__easeMINinMINout bef-btnOutlineSEL__a-primary-lavender',
            ],
          };
        }`;
      case 'comb4':
        return `constructor ( private _befService: BefService ) {
          this._befService.pushCombos( this.combos );
          this._befService.cssCreate();
        }`;
      case 'comb5':
        return `ngDoCheck(): void {
          this._befService.pushCombos( this.combos )
          this._befService.cssCreate()
        }`;
      case 'combEX1':
        return `
        <p class="bef boxOne">
          Box with combo classes.
        </p>`;
      case 'combEX2':
        return `
        <p class="bef boxCustomVALSVL75perVL3px__dashed__grayVLtealVLbeastVL2rem">
          Box with combo classes.
        </p>`;
      case 'combEX3':
        return `
        <div class="bef cardBootstrapLikeVALSVAL2NblackVAL2NVL75perVLVAL1">
          <div>
            <h5>Card Component</h5>
            <p>
              You can see my portfolio in the link below.
              <br/>
              If you want to see more about me, you can visit my portfolio.
              <br/>
              Check it out!
            </p>
            <a href="https://lynxpardelle.com"
            target="_blank"
            rel="noopener noreferrer">
              Visit my portfolio</a>
          </div>
        </div>`;
      default:
        return ``;
    }
  }
  cssCreate() {
    this._befService.cssCreate();
  }
}
