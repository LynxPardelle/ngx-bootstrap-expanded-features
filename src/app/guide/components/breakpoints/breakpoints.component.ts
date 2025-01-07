import { Component, OnInit } from '@angular/core';
import {
  NgxBootstrapExpandedFeaturesService as BefService,
  IBPS,
} from 'ngx-bootstrap-expanded-features';

@Component({
    selector: 'app-breakpoints',
    templateUrl: './breakpoints.component.html',
    styleUrls: ['./breakpoints.component.scss'],
    standalone: false
})
export class BreakpointsComponent implements OnInit {
  public bps: IBPS[] = [];
  constructor(private _befService: BefService) {}
  ngOnInit(): void {
    this.cssCreate();
    this._befService.getBPS().forEach((bp: IBPS) => {
      this.bps.push(bp);
    });
  }
  getHTML(option: string): string {
    switch (option) {
      case 'bps':
        return `<p class="bef bef-text-indigo bef-text-sm-purple bef-text-md-pink bef-text-lg-orange bef-text-xl-teal bef-text-xxl-lavender" >
          Some text with the color indigo before sm, purple on sm, pink on md, orange on lg, teal on xl and lavender on xxl.
        </p>`;
      case 'breakpoint1':
        return `<!-- SOME CODE -->
        <!-- SCRIPT LINKED TO THE CDN VERSION -->
        <script>
          var new_breakpoints = [
            {
              bp: "hll",
              value: "666px",
              bef: "",
            },
          ];
          pushBPS(new_breakpoints);
        </script>`;
      case 'breakpoint2':
        return `import { cssCreate, pushBPS } from "bootstrap-expanded-features";
        const new_breakpoints = [
          {
            bp: "hll",
            value: "666px",
            bef: "",
          },
        ];
        pushBPS(new_breakpoints);
        cssCreate();`;
      case 'import':
        return `import { NgxBootstrapExpandedFeaturesService as BefService } from "ngx-bootstrap-expanded-features";`;
      case 'breakpoint3':
        return `export class YourComponent {
          public my_new_breakpoints = [
            {
              bp: "hll",
              value: "666px",
              bef: "",
            },
          ];
        }`;
      case 'breakpoint4':
        return `constructor ( private _befService: BefService ) {
          this._befService.pushBPS( this.my_new_breakpoints );
          this._befService.cssCreate();
        }`;
      case 'breakpoint5':
        return `ngDoCheck(): void {
          this._befService.pushBPS( this.my_new_breakpoints )
          this._befService.cssCreate()
        }`;
      default:
        return ``;
    }
  }
  cssCreate() {
    this._befService.cssCreate();
  }
}
