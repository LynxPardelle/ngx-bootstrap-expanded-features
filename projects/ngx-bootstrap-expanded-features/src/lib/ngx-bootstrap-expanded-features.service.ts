import { Injectable } from '@angular/core';
/* Colors */
import { allColors } from './colors';
import { cssNamesParsed } from './cssNamesParsed';

@Injectable({
  providedIn: 'root',
})
export class NgxBootstrapExpandedFeaturesService {
  public colors: any = allColors;
  public cssNamesParsed: any = cssNamesParsed;
  public alreadyCreatedClasses: string[] = [];
  public sheet: any;
  public isDebug: boolean = false;
  /* Console */
  public styleConsole: string = `padding: 0.25rem 0.125rem; background-color: ${this.colors.mystic}; color: ${this.colors.friend};`;
  /* Time Management*/
  public lastCSSCreate: number = new Date().getTime();
  public timer: any = null;
  public timesCSSCreated: number = 0;
  public timesCSSNeedsToCreate: number = 0;
  public timeBetweenReCreate: number = 300;
  constructor() {
    let sheets: any[] = [...document.styleSheets];
    for (let sheet of sheets) {
      if (sheet.href?.includes('bef-styles')) {
        this.sheet = sheet;
      }
    }
  }
  cssCreate(
    updateBefs: string[] | null = null,
    primordial: boolean = false
  ): void {
    this.timesCSSNeedsToCreate++;
    let currentCSSTimeCreation: number = this.timesCSSNeedsToCreate;
    let timer = setInterval(() => {
      const currentTime = Date.now();
      if (
        currentTime - this.lastCSSCreate >= this.timeBetweenReCreate ||
        primordial === true ||
        this.timesCSSCreated === 0
      ) {
        this.timesCSSCreated++;
        this.doCssCreate(updateBefs);
        this.lastCSSCreate = currentTime;
        clearInterval(timer);
      }
      if (currentCSSTimeCreation <= this.timesCSSCreated) {
      }
      if (this.timer !== timer) {
        clearInterval(timer);
      }
    }, 10);
    this.timer = timer;
  }

  doCssCreate(updateBefs: string[] | null = null): void {
    try {
      if (!this.sheet) {
        throw new Error('There is no bef-styles style sheet!');
      }
      const startTimeCSSCreate = performance.now();
      let befs: string[] = [];
      if (!updateBefs) {
        let befElements: any = document.getElementsByClassName('bef');
        for (let befElement of befElements) {
          befElement.classList.forEach((item: any) => {
            if (
              !befs.includes(item) &&
              item !== 'bef' &&
              item.includes('bef')
            ) {
              befs.push(item);
            }
          });
        }
      } else {
        befs = updateBefs;
      }
      if (this.isDebug === true) {
        this.consoleParser('info', { befs: befs }, this.styleConsole);
      }
      let befsStringed = '';
      let befsStringedSM = '';
      let befsStringedMD = '';
      let befsStringedLG = '';
      let befsStringedXL = '';
      let befsStringedXXL = '';
      for (let bef of befs) {
        if (!updateBefs) {
          if (this.alreadyCreatedClasses.includes(bef)) {
            continue;
          }
          if ([...this.sheet.cssRules].find((i) => i.cssText.includes(bef))) {
            continue;
          }
        }
        if (!this.alreadyCreatedClasses.includes(bef)) {
          this.alreadyCreatedClasses.push(bef);
        }
        let befStringed = '.' + bef;
        let befSplited = bef.split('-');
        let hasBP = false;
        let value = '';
        let secondValue = '';
        if (
          befSplited[2] === 'sm' ||
          befSplited[2] === 'md' ||
          befSplited[2] === 'lg' ||
          befSplited[2] === 'xl' ||
          befSplited[2] === 'xxl'
        ) {
          hasBP = true;
          value = befSplited[3];
          secondValue = !!befSplited[4] ? befSplited[4] : '';
        } else if (befSplited[2]) {
          value = befSplited[2];
          secondValue = !!befSplited[3] ? befSplited[3] : '';
        }
        /* befSplited[1] = befSplited[1]
          .replace(/COM/g, ' , ')
          .replace(/__/g, ' ')
          .replace(/_/g, '.'); */
        value = value
          .replace(/per/g, '%')
          .replace(/COM/g, ' , ')
          .replace(/MIN/g, '-')
          .replace(/PLUS/g, '+')
          .replace(/SD/g, '(')
          .replace(/ED/g, ')')
          .replace(/HASH/g, '#')
          .replace(/__/g, ' ')
          .replace(/_/g, '.');
        this.consoleParser('info', { value: value }, this.styleConsole);
        let values: any = {
          value: value,
          secondValue: secondValue,
        };
        for (let v in values) {
          for (let i = 0; i < values[v].split(' ').length; i++) {
            let sv: string = values[v].split(' ')[i];
            let hasOPA: boolean = values[v].split(' ')[i + 1] === 'OPA';
            let OPA: string = values[v].split(' ')[i + 2];
            values[v] =
              !!hasOPA && !!OPA
                ? values[v]
                    .replace(
                      sv,
                      `rgba(${this.HexToRGB(
                        this.colors[sv.toString()]
                      ).toString()}, ${OPA})`
                    )
                    .split(` OPA ${OPA}`)[0]
                : values[v].includes(' OPA')
                ? values[v]
                    .replace(
                      sv,
                      `rgba(${this.HexToRGB(
                        this.colors[sv.toString()]
                      ).toString()}, ${values[v].split('OPA ')[1]})`
                    )
                    .split(' OPA')[0]
                : this.colors[sv.toString()]
                ? values[v].replace(sv, this.colors[sv.toString()])
                : values[v];
          }
        }
        value = values.value;
        secondValue = values.secondValue;
        if (this.isDebug === true) {
          this.consoleParser('info', { value: value }, this.styleConsole);
          this.consoleParser(
            'info',
            { secondValue: secondValue },
            this.styleConsole
          );
        }
        switch (true) {
          case !!this.cssNamesParsed[
            befSplited[1]
              .replace('Hover', '')
              .replace('Active', '')
              .replace('Focus', '')
              .replace('Visited', '')
              .replace('Target', '')
              .replace('FocusWithin', '')
              .replace('FocusVisible', '')
              .toString()
          ]:
            if (
              typeof this.cssNamesParsed[
                befSplited[1]
                  .replace('Hover', '')
                  .replace('Active', '')
                  .replace('Focus', '')
                  .replace('Visited', '')
                  .replace('Target', '')
                  .replace('FocusWithin', '')
                  .replace('FocusVisible', '')
                  .toString()
              ] === 'string'
            ) {
              befStringed += `${
                befSplited[1].includes('Hover')
                  ? ':hover'
                  : befSplited[1].includes('Active')
                  ? ':active'
                  : befSplited[1].includes('Focus')
                  ? ':focus'
                  : befSplited[1].includes('Visited')
                  ? ':visited'
                  : befSplited[1].includes('Target')
                  ? ':target'
                  : befSplited[1].includes('FocusWithin')
                  ? ':focus-within'
                  : befSplited[1].includes('FocusVisible')
                  ? ':focusVisible'
                  : ''
              }{${
                this.cssNamesParsed[
                  befSplited[1]
                    .replace('Hover', '')
                    .replace('Active', '')
                    .replace('Focus', '')
                    .replace('Visited', '')
                    .replace('Target', '')
                    .replace('FocusWithin', '')
                    .replace('FocusVisible', '')
                    .toString()
                ]
              }:${value};}`;
            } else {
              befStringed += `${
                befSplited[1].includes('Hover')
                  ? ':hover'
                  : befSplited[1].includes('Active')
                  ? ':active'
                  : befSplited[1].includes('Focus')
                  ? ':focus'
                  : befSplited[1].includes('Visited')
                  ? ':visited'
                  : befSplited[1].includes('Target')
                  ? ':target'
                  : befSplited[1].includes('FocusWithin')
                  ? ':focus-within'
                  : befSplited[1].includes('FocusVisible')
                  ? ':focusVisible'
                  : ''
              }{${
                this.cssNamesParsed[
                  befSplited[1]
                    .replace('Hover', '')
                    .replace('Active', '')
                    .replace('Focus', '')
                    .replace('Visited', '')
                    .replace('Target', '')
                    .replace('FocusWithin', '')
                    .replace('FocusVisible', '')
                    .toString()
                ][0]
              }:${value};${
                this.cssNamesParsed[
                  befSplited[1]
                    .replace('Hover', '')
                    .replace('Active', '')
                    .replace('Focus', '')
                    .replace('Visited', '')
                    .replace('Target', '')
                    .replace('FocusWithin', '')
                    .replace('FocusVisible', '')
                    .toString()
                ][1]
              }:${value};}`;
            }
            break;
          case befSplited[1].startsWith('link'):
            befStringed += `a${
              befSplited[1].includes('Hover')
                ? ':hover'
                : befSplited[1].includes('Active')
                ? ':active'
                : befSplited[1].includes('Focus')
                ? ':focus'
                : befSplited[1].includes('Visited')
                ? ':visited'
                : befSplited[1].includes('Target')
                ? ':target'
                : befSplited[1].includes('FocusWithin')
                ? ':focus-within'
                : befSplited[1].includes('FocusVisible')
                ? ':focusVisible'
                : ''
            }{color:${value} !important;}`;
            break;
          case befSplited[1] === 'btn':
            befStringed += `{
                    background-color:${value};
                    border-color:${value};}
                  /.${bef}:hover{background-color:${this.shadeTintColor(
              this.HexToRGB(value),
              -15
            )};border-color:${this.shadeTintColor(this.HexToRGB(value), -20)};}
                  /.btn-check:focus + .${bef}, .${bef}:focus{background-color:${this.shadeTintColor(
              this.HexToRGB(value),
              -15
            )};border-color:${this.shadeTintColor(this.HexToRGB(value), -20)};}
                  /.btn-check:checked + .${bef}, .btn-check:active + .${bef}, .${bef}:active, .${bef}.active, .show > .${bef}.dropdown-toggle{background-color:${this.shadeTintColor(
              this.HexToRGB(value),
              -20
            )};border-color:${this.shadeTintColor(
              this.HexToRGB(value),
              -25
            )};box-shadow: 0 0 0 0.25rem
                  rgba(${this.HexToRGB(
                    this.shadeTintColor(this.HexToRGB(value), 3)
                  )}, 0.5)
                  ;}
                  /.btn-check:checked + .btn-check:focus, .btn-check:active + .${bef}:focus, .${bef}:active:focus, .${bef}.active:focus, .show > .${bef}.dropdown-toggle:focus{box-shadow: 0 0 0 0.25rem
                    rgba(${this.HexToRGB(
                      this.shadeTintColor(this.HexToRGB(value), 3)
                    )}, 0.5)
                  ;}`;
            break;
          case befSplited[1] === 'btnOutline':
            befStringed += `{
                    color:${value};
                    background-color:${secondValue ? secondValue : 'default'};
                      border-color:${value};}
                    /.${bef}:hover{
                      background-color:${value};
                      color:${secondValue ? secondValue : 'default'};
                      border-color:${this.shadeTintColor(
                        this.HexToRGB(value),
                        -20
                      )};}
                    /.btn-check:focus + .${bef}, .${bef}:focus{
                      border-color:${this.shadeTintColor(
                        this.HexToRGB(value),
                        -20
                      )};}
                    /.btn-check:checked + .${bef}, .btn-check:active + .${bef}, .${bef}:active, .${bef}.active, .show > .${bef}.dropdown-toggle{
                      border-color:${this.shadeTintColor(
                        this.HexToRGB(value),
                        -25
                      )};
                    box-shadow: 0 0 0 0.25rem
                    rgba(${this.HexToRGB(
                      this.shadeTintColor(this.HexToRGB(value), 3)
                    )}, 0.5)
                    ;}
                    /.btn-check:checked + .btn-check:focus, .btn-check:active + .${bef}:focus, .${bef}:active:focus, .${bef}.active:focus, .show > .${bef}.dropdown-toggle:focus{
                      box-shadow: 0 0 0 0.25rem
                      rgba(${this.HexToRGB(
                        this.shadeTintColor(this.HexToRGB(value), 3)
                      )}, 0.5)
                    ;}`;
            break;
          default:
            befStringed += `{${this.camelToCSSValid(befSplited[1])}:${value};}`;
            break;
        }
        for (let cssProperty of befStringed.split(';')) {
          if (!cssProperty.includes('!important') && cssProperty.length > 5) {
            befStringed = befStringed.replace(
              cssProperty,
              cssProperty + ' !important'
            );
          }
        }
        if (befStringed.includes('{') && befStringed.includes('}')) {
          if (hasBP === true) {
            befStringed = befStringed.replace(/\//g, '');
            switch (befSplited[2]) {
              case 'sm':
                befsStringedSM += befStringed;
                break;
              case 'md':
                befsStringedMD += befStringed;
                break;
              case 'lg':
                befsStringedLG += befStringed;
                break;
              case 'xl':
                befsStringedXL += befStringed;
                break;
              case 'xxl':
                befsStringedXXL += befStringed;
                break;
            }
          } else {
            befsStringed += befStringed + '/';
          }
        }
      }
      if (befsStringed !== '') {
        if (this.isDebug === true) {
          this.consoleParser(
            'info',
            { befsStringed: befsStringed },
            this.styleConsole
          );
        }
        for (let bef of befsStringed.split('/')) {
          if (bef !== '') {
            this.createCSSRules(bef);
          }
        }
      }
      if (befsStringedSM !== '') {
        if (this.isDebug === true) {
          this.consoleParser(
            'info',
            { befsStringedSM: befsStringedSM },
            this.styleConsole
          );
        }
        this.createCSSRules(
          `@media only screen and (min-width: 576px) {${befsStringedSM}}`
        );
      }
      if (befsStringedMD !== '') {
        if (this.isDebug === true) {
          this.consoleParser(
            'info',
            { befsStringedMD: befsStringedMD },
            this.styleConsole
          );
        }
        this.createCSSRules(
          `@media only screen and (min-width: 768px) {${befsStringedMD}}`
        );
      }
      if (befsStringedLG !== '') {
        if (this.isDebug === true) {
          this.consoleParser(
            'info',
            { befsStringedLG: befsStringedLG },
            this.styleConsole
          );
        }
        this.createCSSRules(
          `@media only screen and (min-width: 992px) {${befsStringedLG}}`
        );
      }
      if (befsStringedXL !== '') {
        if (this.isDebug === true) {
          this.consoleParser(
            'info',
            { befsStringedXL: befsStringedXL },
            this.styleConsole
          );
        }
        this.createCSSRules(
          `@media only screen and (min-width: 1200px) {${befsStringedXL}}`
        );
      }
      if (befsStringedXXL !== '') {
        if (this.isDebug === true) {
          this.consoleParser(
            'info',
            { befsStringedXXL: befsStringedXXL },
            this.styleConsole
          );
        }
        this.createCSSRules(
          `@media only screen and (min-width: 1400px) {${befsStringedXXL}}`
        );
      }
      const endTimeCSSCreate = performance.now();
      if (this.isDebug === true) {
        this.consoleParser(
          'info',
          `Call to cssCreate() took ${
            endTimeCSSCreate - startTimeCSSCreate
          } milliseconds`,
          this.styleConsole
        );
      }
      let befTimer = document.getElementById('befTimer');
      if (befTimer) {
        befTimer.innerHTML = `
            <p>
            Call to cssCreate() took ${
              endTimeCSSCreate - startTimeCSSCreate
            } milliseconds
            </p>
            `;
      }
    } catch (err) {
      this.consoleParser('error', { err: err }, this.styleConsole);
    }
  }

  createCSSRules(rule: string, update: boolean = false): void {
    try {
      if (this.isDebug === true) {
        this.consoleParser('info', { rule: rule }, this.styleConsole);
      }
      if (rule && !rule.split('{')[0].includes('@media')) {
        let index;
        let originalRule: any = [...this.sheet.cssRules].some(
          (cssRule: any, i) => {
            if (
              cssRule.cssText.includes(
                rule.split('{')[0].replace('\n', '').replace(/\s+/g, ' ')
              )
            ) {
              index = i;
              return true;
            } else {
              return false;
            }
          }
        )
          ? [...this.sheet.cssRules].find((i) =>
              i.cssText.includes(
                rule.split('{')[0].replace('\n', '').replace(/\s+/g, ' ')
              )
            )
          : undefined;
        if (originalRule) {
          this.sheet.deleteRule(index);
        }
        this.sheet.insertRule(rule, this.sheet.cssRules.length);
        if (this.isDebug === true) {
          this.consoleParser('info', { sheet: this.sheet }, this.styleConsole);
        }
      } else {
        let originalMediaRules: boolean = false;
        for (let i = 0; i < rule.split('{').length; i++) {
          let ruleSplit = rule.split('{')[i];
          //for (let ruleSplit of rule.split('{')) {
          let selector: string = ruleSplit.includes('}')
            ? ruleSplit.split('}')[ruleSplit.split('}').length - 1]
            : ruleSplit;
          // CSS (& HTML) reduce spaces in selector to one.
          if (selector !== '') {
            selector = selector.replace('\n', '').replace(/\s+/g, ' ');
            if (selector[0] === ' ') {
              selector = selector.replace(' ', '');
            }
            let posibleMediaRule = [...this.sheet.cssRules].find((i) =>
              i.cssText.includes(selector)
            );
            if (posibleMediaRule && posibleMediaRule.cssRules) {
              originalMediaRules = true;
              let index;
              let posibleRule = [...posibleMediaRule.cssRules].some(
                (cssRule: any, i) => {
                  if (cssRule.cssText.includes(selector)) {
                    index = i;
                    return true;
                  } else {
                    return false;
                  }
                }
              )
                ? [...posibleMediaRule.cssRules].find((i) =>
                    i.cssText.includes(selector)
                  )
                : undefined;
              if (posibleRule) {
                posibleMediaRule.deleteRule(index);
              }
              let nextSelector: string = rule.split('{')[i + 1].includes('}')
                ? rule.split('{')[i + 1].split('}')[0]
                : rule.split('{')[i] + 1;
              let newRule = selector + '{' + nextSelector + '}';
              posibleMediaRule.insertRule(
                newRule,
                posibleMediaRule.cssRules.length
              );
            }
          }
        }
        if (originalMediaRules === false) {
          this.sheet.insertRule(rule, this.sheet.cssRules.length);
          if (this.isDebug === true) {
            this.consoleParser(
              'info',
              { sheet: this.sheet },
              this.styleConsole
            );
          }
        }
      }
    } catch (err) {
      this.consoleParser('error', { err: err }, this.styleConsole);
    }
  }

  HexToRGB(Hex: string): number[] {
    let rgb: number[] = [];
    if (!Hex.includes('rgb') && !Hex.includes('rgba')) {
      let HexNoCat = Hex.replace('#', '');
      rgb =
        HexNoCat.length !== 3 && HexNoCat.length === 8
          ? [
              parseInt(HexNoCat.substr(0, 2), 16),
              parseInt(HexNoCat.substr(2, 2), 16),
              parseInt(HexNoCat.substr(4, 2), 16),
              parseInt(((HexNoCat.substr(6, 2), 16) / 255).toFixed(2)),
            ]
          : HexNoCat.length !== 3 && HexNoCat.length === 6
          ? [
              parseInt(HexNoCat.substr(0, 2), 16),
              parseInt(HexNoCat.substr(2, 2), 16),
              parseInt(HexNoCat.substr(4, 2), 16),
            ]
          : HexNoCat.length !== 3 && HexNoCat.length === 4
          ? [
              parseInt(HexNoCat.substr(0, 2), 16),
              parseInt(HexNoCat.substr(1, 2), 16),
              parseInt(HexNoCat.substr(2, 2), 16),
              parseInt(((HexNoCat.substr(3, 2), 16) / 255).toFixed(2)),
            ]
          : [
              parseInt(HexNoCat.substr(0, 1) + HexNoCat.substr(0, 1), 16),
              parseInt(HexNoCat.substr(1, 1) + HexNoCat.substr(1, 1), 16),
              parseInt(HexNoCat.substr(2, 1) + HexNoCat.substr(2, 1), 16),
            ];
    } else {
      rgb = Hex.split('(')[1].split(',')[4]
        ? [
            parseInt(Hex.split('(')[1].split(',')[0]),
            parseInt(Hex.split('(')[1].split(',')[1]),
            parseInt(Hex.split('(')[1].split(',')[2]),
            parseInt(Hex.split('(')[1].split(',')[3]),
          ]
        : [
            parseInt(Hex.split('(')[1].split(',')[0]),
            parseInt(Hex.split('(')[1].split(',')[1]),
            parseInt(Hex.split('(')[1].split(',')[2]),
          ];
    }
    return rgb;
  }

  shadeTintColor(rgb: number[], percent: number): string {
    let R: any =
      rgb[0] === 0 && percent > 0
        ? 16
        : rgb[0] === 255 && percent < 0
        ? 239
        : rgb[0];
    let G: any =
      rgb[1] === 0 && percent > 0
        ? 16
        : rgb[1] === 255 && percent < 0
        ? 239
        : rgb[1];
    let B: any =
      rgb[2] === 0 && percent > 0
        ? 16
        : rgb[2] === 255 && percent < 0
        ? 239
        : rgb[2];
    R = parseInt(((R * (100 + percent)) / 100).toString());
    G = parseInt(((G * (100 + percent)) / 100).toString());
    B = parseInt(((B * (100 + percent)) / 100).toString());
    R = R > 255 ? 255 : R < 0 ? 0 : R;
    G = G > 255 ? 255 : G < 0 ? 0 : G;
    B = B > 255 ? 255 : B < 0 ? 0 : B;
    let RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
    let GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
    let BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);
    if (rgb[3]) {
      let A: any = rgb[3] ? (rgb[3] * 255).toString(16) : 'FF';
      let AA =
        A.toString(16).length == 1 ? '0' + A.toString(16) : A.toString(16);
      return '#' + RR + GG + BB + AA;
    } else {
      return '#' + RR + GG + BB;
    }
  }

  cssValidToCamel(st: string): string {
    return st.replace(/([-_][a-z])/gi, ($1) => {
      return $1.toUpperCase().replace('-', '').replace('_', '');
    });
  }

  camelToCSSValid(st: string): string {
    return st
      .replace(/[\w]([A-Z])/g, (m) => {
        return m[0] + '-' + m[1];
      })
      .toLowerCase();
  }

  pushColors(newColors: any): void {
    try {
      Object.keys(newColors).forEach((key) => {
        this.colors[key] = newColors[key].replace(
          '!important' || '!default' || /\s+/g,
          ''
        );
      });
    } catch (err) {
      this.consoleParser('error', { err: err }, this.styleConsole);
    }
  }

  getColors(): any {
    if (this.isDebug === true) {
      this.consoleParser('info', { colors: this.colors }, this.styleConsole);
    }
    return this.colors;
  }

  getColorsNames(): string[] {
    const colorsNames: string[] = [];
    Object.keys(this.colors).forEach((key) => {
      colorsNames.push(key);
    });
    return colorsNames;
  }

  getColorValue(color: string): any {
    if (this.isDebug === true) {
      this.consoleParser(
        'info',
        { color: color, colorValue: this.colors[color] },
        this.styleConsole
      );
    }
    return this.colors[color];
  }

  updateColor(color: string, value: string): void {
    try {
      if (this.colors[color.toString()]) {
        this.colors[color] = value.replace(
          '!important' || '!default' || /\s+/g,
          ''
        );
        let classesToUpdate: string[] = [];
        for (let createdClass of this.alreadyCreatedClasses) {
          if (createdClass.includes(color)) {
            classesToUpdate.push(createdClass);
          }
        }
        if (classesToUpdate.length > 0) {
          this.doCssCreate(classesToUpdate);
        }
      } else {
        throw new Error(`There is no color named ${color}.`);
      }
    } catch (err) {
      this.consoleParser('error', { err: err }, this.styleConsole);
    }
  }

  deleteColor(color: string): void {
    try {
      if (this.colors.includes(color)) {
        delete this.colors[color];
      } else {
        throw new Error(`There is no color named ${color}.`);
      }
    } catch (err) {
      this.consoleParser('error', { err: err }, this.styleConsole);
    }
  }

  clearAllColors(): void {
    this.colors = {};
    if (this.isDebug === true) {
      this.consoleParser('info', { colors: this.colors }, this.styleConsole);
    }
  }

  getAlreadyCreatedClasses(): string[] {
    if (this.isDebug === true) {
      this.consoleParser(
        'info',
        { alreadyCreatedClasses: this.alreadyCreatedClasses },
        this.styleConsole
      );
    }
    return this.alreadyCreatedClasses;
  }

  updateClasses(classesToUpdate: string[]): void {
    this.doCssCreate(classesToUpdate);
  }

  getSheet(): any {
    if (this.sheet) {
      if (this.isDebug === true) {
        this.consoleParser('info', { sheet: this.sheet }, this.styleConsole);
      }
      return this.sheet;
    } else {
      return '';
    }
  }

  changeDebugOption(): void {
    this.isDebug = !this.isDebug;
  }

  setTimeBetweenReCreate(time: number): void {
    this.timeBetweenReCreate = time;
  }

  getStackTrace(): string {
    let stack;
    try {
      throw new Error('');
    } catch (error: any) {
      stack = error.stack || '';
    }
    stack = stack.split('\n').map((line: any) => {
      return line.trim();
    });
    return stack.splice(stack[0] == 'Error' ? 2 : 1);
  }

  consoleParser(
    type: 'log' | 'info' | 'trace' | 'error' = 'log',
    thing: any,
    style: string = 'padding: 1em;',
    line: string | null = null,
    stoper: boolean = false
  ): void {
    if (stoper === false) {
      if (line) {
        console.info('%cline: ' + line + ' = ', style);
      }
      console.info('%c' + this.getStackTrace()[1], style);
      console.groupCollapsed('Trace');
      console.trace();
      console.groupEnd();
      {
        switch (type) {
          case 'log':
            console.log(
              '%c' +
                (typeof thing === 'object' ? JSON.stringify(thing) : thing),
              style
            );
            break;
          case 'info':
            console.info(
              '%c' +
                (typeof thing === 'object' ? JSON.stringify(thing) : thing),
              style
            );
            break;
          case 'error':
            console.error(
              '%c' +
                (typeof thing === 'object' ? JSON.stringify(thing) : thing),
              style
            );
            break;
          default:
            break;
        }
      }
      if (typeof thing === 'object') {
        console.dir(thing);
      }
    }
  }
}
