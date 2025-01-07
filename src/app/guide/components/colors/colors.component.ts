import { Component, OnInit } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';

@Component({
    selector: 'app-colors',
    templateUrl: './colors.component.html',
    styleUrls: ['./colors.component.scss'],
    standalone: false
})
export class ColorsComponent implements OnInit {
  public colors: string[] = [];
  constructor(private _befService: BefService) {}

  ngOnInit(): void {
    this.cssCreate();
    this._befService.getColorsNames().forEach((colorName) => {
      this.colors.push(colorName);
    });
  }
  getHTML(option: string): string {
    switch (option) {
      case 'color1':
        return `<!-- SOME CODE -->
        <script>
          var colors = {
            monster: "#00AA00",
            futurePop: "#9700FF",
          };
        </script>
        <!-- SCRIPT LINKED TO THE CDN VERSION -->`;
      case 'color2':
        return `import { cssCreate, pushColors } from "bootstrap-expanded-features";
        const my_new_colors = {
          monster: "#00AA00",
          futurePop: "#9700FF",
        };
        pushColors(my_new_colors);
        cssCreate();`;
      case 'import':
        return `import { NgxBootstrapExpandedFeaturesService as BefService } from "ngx-bootstrap-expanded-features";`;
      case 'color3':
        return `export class YourComponent {
          public my_new_colors = {
            monster: "#00AA00",
            futurePop: "#9700FF",
          };
        }`;
      case 'color4':
        return `constructor ( private _befService: BefService ) {
          this._befService.pushColors( this.my_new_colors );
          this._befService.cssCreate();
        }`;
      case 'color5':
        return `ngDoCheck(): void {
          this._befService.pushColors( this.my_new_colors )
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
