import { Component, OnInit } from '@angular/core';
import {
  NgxBootstrapExpandedFeaturesService as BefService,
  IBPS,
} from 'ngx-bootstrap-expanded-features';

@Component({
  selector: 'app-combos',
  templateUrl: './combos.component.html',
  styleUrls: ['./combos.component.scss'],
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
