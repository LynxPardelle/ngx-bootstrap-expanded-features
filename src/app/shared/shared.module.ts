import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BefInitDirective } from 'projects/ngx-bootstrap-expanded-features/src/lib/bef-init.directive';
import { CodeviewerComponent } from './components/codeviewer/codeviewer.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  declarations: [
    BefInitDirective,
    /* Components */
    CodeviewerComponent,
    /* Pipes */
    SafeHtmlPipe,
  ],
  imports: [CommonModule],
  exports: [
    BefInitDirective,
    /* Components */
    CodeviewerComponent,
    /* Pipes */
    SafeHtmlPipe,
  ],
})
export class SharedModule {}
