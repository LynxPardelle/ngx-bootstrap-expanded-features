import { Component, OnInit } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';

@Component({
    selector: 'app-background',
    templateUrl: './background.component.html',
    styleUrls: ['./background.component.scss'],
    standalone: false
})
export class BackgroundComponent implements OnInit {
  constructor(private _befService: BefService) {}

  ngOnInit(): void {
    this.cssCreate();
  }

  getHTML(option: string): string {
    switch (option) {
      case 'bg':
        return `<p class="text-light bef bef-bg-indigo" >
          Box with indigo background.
        </p>`;
      case 'bghover':
        return `<p class="text-light bef bef-bg-indigo bef-bgHover-mystic" >
          Box with indigo background and a mystic background on hover.
        </p>`;
      case 'bgactive':
        return `<p class="text-light bef bef-bg-indigo bef-bgActive-mystic" >
          Box with indigo background and a mystic background on active.
        </p>`;
      default:
        return ``;
    }
  }
  cssCreate() {
    this._befService.cssCreate();
  }
}
