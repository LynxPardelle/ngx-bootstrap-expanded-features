import { Component, OnInit } from '@angular/core';
import {
  NgxBootstrapExpandedFeaturesService as BefService,
  IBPS,
} from 'ngx-bootstrap-expanded-features';

@Component({
    selector: 'app-abbreviations',
    templateUrl: './abbreviations.component.html',
    styleUrls: ['./abbreviations.component.scss'],
    standalone: false
})
export class AbbreviationsComponent implements OnInit {
  public abreviationsValues: { [key: string]: string } = {
    bor1: '5px__solid__black',
  };
  public abreviationsClasses = {
    bgFO75: 'bef-bg-fairy__OPA__0_75',
    tFL: 'bef-textFirstLetter',
  };
  constructor(private _befService: BefService) {}
  ngOnInit(): void {
    this._befService.pushAbreviationsValues(this.abreviationsValues);
    this._befService.pushAbreviationsClasses(this.abreviationsClasses);
    this.cssCreate();
  }

  getHTML(option: string): string {
    switch (option) {
      case 'abbV1':
        return `<!-- SOME CODE -->
        <!-- SCRIPT LINKED TO THE CDN VERSION -->
        <script>
          var abreviationsValues = {
            bor1: '5px__solid__black',
          };
          pushAbreviationsValues(abreviationsValues);
        </script>`;
      case 'abbV2':
        return `import { cssCreate, pushAbreviationsValues } from "bootstrap-expanded-features";
        const abreviationsValues = {
          bor1: '5px__solid__black',
        };
        pushAbreviationsValues(abreviationsValues);
        cssCreate();`;
      case 'import':
        return `import { NgxBootstrapExpandedFeaturesService as BefService } from "ngx-bootstrap-expanded-features";`;
      case 'abbV3':
        return `export class YourComponent {
          public abreviationsValues = {
            bor1: '5px__solid__black',
          };
        }`;
      case 'abbV4':
        return `constructor ( private _befService: BefService ) {
          this._befService.pushAbreviationsValues( this.abreviationsValues );
          this._befService.cssCreate();
        }`;
      case 'abbV5':
        return `ngDoCheck(): void {
          this._befService.pushAbreviationsValues( this.abreviationsValues )
          this._befService.cssCreate()
        }`;
      case 'abbVEX':
        return `
        <p class="bef bef-border-bor1">
          Box with border
        </p>`;
      case 'abbC1':
        return `<!-- SOME CODE -->
        <!-- SCRIPT LINKED TO THE CDN VERSION -->
        <script>
          var abreviationsClasses = {
            bgFO75: 'bef-bg-fairy__OPA__0_75',
            tFL: 'bef-textFirstLetter',
          };
        pushAbreviationsClasses(abreviationsClasses);
        </script>`;
      case 'abbC2':
        return `import { cssCreate, pushAbreviationsClasses } from "bootstrap-expanded-features";
        const abreviationsClasses = {
          bgFO75: 'bef-bg-fairy__OPA__0_75',
          tFL: 'bef-textFirstLetter',
        };
        pushAbreviationsClasses(abreviationsClasses);
        cssCreate();`;
      case 'abbC3':
        return `export class YourComponent {
          public abreviationsClasses = {
            bgFO75: 'bef-bg-fairy__OPA__0_75',
            tFL: 'bef-textFirstLetter',
          };
        }`;
      case 'abbC4':
        return `constructor ( private _befService: BefService ) {
          this._befService.pushAbreviationsClasses( this.abreviationsClasses );
          this._befService.cssCreate();
        }`;
      case 'abbC5':
        return `ngDoCheck(): void {
          this._befService.pushAbreviationsClasses( this.abreviationsClasses )
          this._befService.cssCreate()
        }`;
      case 'abbCEX':
        return `
        <p class="bef bgFO75 tFL-beast">
          Box with fairy background with opacity 0.75 and text with first letter with beast color.
        </p>`;
      default:
        return ``;
    }
  }
  cssCreate() {
    this._befService.cssCreate();
  }
}
