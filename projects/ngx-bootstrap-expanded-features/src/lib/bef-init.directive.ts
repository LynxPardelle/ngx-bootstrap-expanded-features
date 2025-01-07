import { Directive, Input, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[befInit]',
    standalone: false
})
export class BefInitDirective {
  @Input() exist!: boolean;

  @Output('befInit') initEvent: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    if (this.exist) {
      setTimeout(() => this.initEvent.emit(), 10);
    }
  }
}
