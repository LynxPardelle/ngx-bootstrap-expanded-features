import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'safeHtml',
    standalone: false
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(
    html: string | { text: string; matches: string[] },
    ...args: unknown[]
  ): unknown {
    return typeof html === 'string'
      ? this.sanitizer.bypassSecurityTrustHtml(html)
      : this.sanitizer.bypassSecurityTrustHtml(html.text);
  }
}
