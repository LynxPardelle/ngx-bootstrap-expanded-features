import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BefInitDirective } from 'projects/ngx-bootstrap-expanded-features/src/lib/bef-init.directive';

@NgModule({
  declarations: [BefInitDirective],
  imports: [CommonModule],
  exports: [BefInitDirective],
})
export class SharedModule {}
