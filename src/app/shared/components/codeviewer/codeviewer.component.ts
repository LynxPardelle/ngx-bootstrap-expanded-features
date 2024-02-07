import { Component, Input, OnInit } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService } from 'ngx-bootstrap-expanded-features';

@Component({
  selector: 'codeviewer',
  templateUrl: './codeviewer.component.html',
  styleUrls: ['./codeviewer.component.scss'],
})
export class CodeviewerComponent implements OnInit {
  @Input() code: string = '';
  @Input() show: 'code' | 'example' | 'both' = 'both';
  @Input() type: 'html' | 'js' = 'html';
  public codeViewer: string = '';
  constructor(private _befService: NgxBootstrapExpandedFeaturesService) {}
  ngOnInit(): void {
    if (this.type === 'js') this.show = 'code';
    if (this.show !== 'example') this.createCodeViewer();
    this.cssCreate();
  }
  createCodeViewer() {
    this.codeViewer = this.code;
    switch (this.type) {
      case 'html':
        this.codeViewer = `<code class="text-dark">${this.codeViewer
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/("[A-z0-9-_\s]*")/g, '<span class="text-danger">$1</span>')
          .replace(/&lt;!--/g, '<br /><span class="text-secondary">&lt;!--')
          .replace(/--&gt;/g, '--&gt;</span><br />')
          .replace(
            /&lt;(?!\!--)([A-z0-9\=\"\-_\s<>\/\+\~\^\$\:\;\(\)%\.]*)&gt;/g,
            '<span class="text-primary">&lt;$1&gt;</span>'
          )
          .replace(
            /([A-z-_0-9]+\()([A-z\_\-0-9\s\,\(\)\.]*)(\);?)/g,
            '<span class="text-warning">$1<span class="text-info">$2</span>$3</span>'
          )
          .replace(
            /(var|let|const|public)\s+([A-z0-9_-]+)\s+(=|{)\s/g,
            `$1 <span class="text-info">$2</span> $3 `
          )
          .replace(
            /(var|let|const|\[|\])\s+/g,
            '<span class="text-primary">$1 </span>'
          )
          .replace(/\n/g, '<br />')}</code>`
          .replace(
            /<code class="text-dark">\s*\n*<br \/>/g,
            '<code class="text-dark">'
          )
          .replace(/<br \/>\s*\n*<\/code>/g, '</code>');
        break;
      case 'js':
        this.codeViewer = `<code class="text-dark">${this.codeViewer
          .replace(
            /(import\s+\{)(.*)(\}\s+from\s+)(".*")(;)/g,
            '<span class="bef bef-text-fairy">$1<span class="text-info">$2</span>$3<span class="text-danger">$4</span>$5</span>'
          )
          .replace(
            /(export\s+)(class)\s([A-z0-9_-]+)/g,
            '<span class="bef bef-text-fairy">$1</span><span class="text-primary">$2</span> <span class="text-info">$3</span>'
          )
          .replace(
            /(var|let|const|public)\s+([A-z0-9_-]+)\s+(=|{)\s/g,
            `$1 <span class="text-info">$2</span> $3 `
          )
          .replace(
            /([A-z0-9_"'\,\s\-\[\]\{\}]+):/g,
            `<span class="text-info">$1:</span>`
          )
          .replace(
            /(:(<\/span>)?\s?[A-z0-9_-]+)/g,
            `<span class="text-info">$1</span>`
          )
          .replace(
            /(var|let|const|public|private|constructor|\[|\])\s+/g,
            '<span class="text-primary">$1</span> '
          )
          .replace(
            /([A-z-_0-9]+\()([A-z\_\-0-9\s\,"'\[\]\(\)\.]*)(\);?)/g,
            '<span class="text-warning">$1<span class="text-info">$2</span>$3</span>'
          )
          .replace(/this.(.*)/g, '<span class="text-info">this.$1</span>')
          .replace(
            /([A-z-_0-9]+\(\);)/g,
            '<span class="text-warning">$1</span>'
          )
          .replace(
            /#([0-9ABCDEF]{3,8})/g,
            '<span class="bef bef-text-HASH$1">#$1</span>'
          )
          .replace(
            /(?!>)({|}|};|=\s|;|,|\s"|",|^"|\s"|\sas\s|\s\(\s|\s\)\s)(?!<)/g,
            '<span class="bef bef-text-fairy">$1</span>'
          )
          .replace(/\n/g, '<br />')}</code>`
          .replace(
            /<code class="text-dark">\s*\n*<br \/>/g,
            '<code class="text-dark">'
          )
          .replace(/<br \/>\s*\n*<\/code>/g, '</code>');
        break;
      default:
        break;
    }
    // console.log(this.codeViewer);
  }
  replaceBlankSpace(code: string): string {
    return code.replace(/ /g, '');
  }
  cssCreate() {
    this._befService.cssCreate();
  }
}
