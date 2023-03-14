import { Injectable } from '@angular/core';
/* Colors */
import { allColors } from './colors';
import { cssNamesParsed } from './cssNamesParsed';

export interface IBPS {
  bp: string;
  value: string;
  bef: string;
}

export interface IConsoleParser {
  type?: 'log' | 'info' | 'trace' | 'error';
  thing: any;
  style?: string;
  line?: string | null;
  stoper?: boolean;
}

export interface IPseudo {
  mask: string;
  real: string;
}

@Injectable({
  providedIn: 'root',
})
export class NgxBootstrapExpandedFeaturesService {
  public colors: any = allColors;
  public cssNamesParsed: any = cssNamesParsed;
  public alreadyCreatedClasses: string[] = [];
  public sheet: any;
  public isDebug: boolean = false;
  public bps: IBPS[] = [
    {
      bp: 'sm',
      value: '576px',
      bef: '',
    },
    {
      bp: 'md',
      value: '768px',
      bef: '',
    },
    {
      bp: 'lg',
      value: '992px',
      bef: '',
    },
    {
      bp: 'xl',
      value: '1200px',
      bef: '',
    },
    {
      bp: 'xxl',
      value: '1400px',
      bef: '',
    },
  ];

  /* Console */
  public styleConsole: string = `padding: 0.25rem 0.125rem; background-color: ${this.colors.mystic}; color: ${this.colors.friend};`;
  /* Time Management*/
  public lastCSSCreate: number = new Date().getTime();
  public timer: any = null;
  public timesCSSCreated: number = 0;
  public timesCSSNeedsToCreate: number = 0;
  public timeBetweenReCreate: number = 300;
  public pseudoClasses: string[] =
    'Active/Checked/Default/Dir/Disabled/Empty/Enabled/First/FirstChild/FirstOfType/Fullscreen/Focus/Hover/Indeterminate/InRange/Invalid/Lang/LastChild/LastOfType/Left/Link/Not/NthChild/NthLastChild/NthLastOfType/NthOfType/OnlyChild/OnlyOfType/Optional/OutOfRange/ReadOnly/ReadWrite/Required/Right/Root/Scope/Target/Valid/Visited'.split(
      '/'
    );
  public pseudoElements: string[] =
    'After/Before/FirstLetter/FirstLine/Selection/Backdrop/Placeholder/Marker/SpellingError/GrammarError'.split(
      '/'
    );
  public pseudos: IPseudo[] = this.pseudoClasses
    .sort((e1: number | string, e2: number | string) => {
      e1 = e1.toString().length;
      e2 = e2.toString().length;
      return e1 > e2 ? 1 : e1 < e2 ? -1 : 0;
    })
    .map((pse: string) => {
      return {
        mask: pse,
        real: `/:${this.camelToCSSValid(pse)}`,
      };
    })
    .concat(
      this.pseudoElements
        .sort((e1: number | string, e2: number | string) => {
          e1 = e1.toString().length;
          e2 = e2.toString().length;
          return e1 > e2 ? 1 : e1 < e2 ? -1 : 0;
        })
        .map((pse: string) => {
          return {
            mask: pse,
            real: `/::${this.camelToCSSValid(pse)}`,
          };
        })
    );
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
      /* if (currentCSSTimeCreation <= this.timesCSSCreated) {
      } */
      if (this.timer !== timer) {
        clearInterval(timer);
      }
    }, 10);
    this.timer = timer;
  }

  doCssCreate(updateBefs: string[] | null = null): void {
    try {
      if (!this.sheet) {
        let sheets: any[] = [...document.styleSheets];
        for (let sheet of sheets) {
          if (sheet.href?.includes('bef-styles')) {
            this.sheet = sheet;
          }
        }
        if (!this.sheet) {
          throw new Error('There is no bef-styles style sheet!');
        }
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
      this.consoleLog('info', { befs: befs }, this.styleConsole);
      let befsStringed = '';
      let bpsStringed: IBPS[] = this.bps.map((b) => b);
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
        /* if (befSplited[1].includes('SLASH')) {
          debugger;
        } */
        let befSRP = this.removePseudos(befSplited[1])
          .replace(/SEL/g, '/')
          .split('/');
        let selector = befSRP[0];
        let specify = befSRP
          .map((bs, i) => {
            if (i !== 0) {
              return bs;
            } else {
              return '';
            }
          })
          .join('')
          .replace(/per/g, '%')
          .replace(/COM/g, ' , ')
          .replace(/CSP/g, `'`)
          .replace(/CDB/g, `"`)
          .replace(/MIN/g, '-')
          .replace(/PLUS/g, '+')
          .replace(/SD/g, '(')
          .replace(/ED/g, ')')
          .replace(/SE/g, '[')
          .replace(/EE/g, ']')
          .replace(/HASH/g, '#')
          .replace(/SLASH/g, '/')
          .replace(/__/g, ' ')
          .replace(/_/g, '.')
          .replace(/CHILD/g, ' > ')
          .replace(/ADJ/g, ' + ')
          .replace(/SIBL/g, ' ~ ')
          .replace(/ALL/g, '*')
          .replace(/EQ/g, '=')
          .replace(/ST/g, '^')
          .replace(/INC/g, '$');
        let hasBP = false;
        let value = '';
        let secondValue = '';
        if (this.bps.find((b) => befSplited[2] === b.bp)) {
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
          .replace(/CSP/g, `'`)
          .replace(/CDB/g, `"`)
          .replace(/MIN/g, '-')
          .replace(/PLUS/g, '+')
          .replace(/SD/g, '(')
          .replace(/ED/g, ')')
          .replace(/HASH/g, '#')
          .replace(/SLASH/g, '/')
          .replace(/__/g, ' ')
          .replace(/_/g, '.');
        this.consoleLog('info', { value: value }, this.styleConsole);
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
        this.consoleLog(
          'info',
          { value: value, secondValue: secondValue },
          this.styleConsole
        );
        switch (true) {
          case !!this.cssNamesParsed[selector.toString()]:
            if (typeof this.cssNamesParsed[selector.toString()] === 'string') {
              befStringed += `${specify}{${
                this.cssNamesParsed[selector.toString()]
              }:${value};}`;
            } else {
              befStringed += `${specify}{${
                this.cssNamesParsed[selector.toString()][0]
              }:${value};${
                this.cssNamesParsed[selector.toString()][1]
              }:${value};}`;
            }
            break;
          case befSplited[1].startsWith('link'):
            befStringed += ` a${specify}{color:${value} !important;}`;
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
            befStringed += `${specify}{${this.camelToCSSValid(
              selector
            )}:${value};}`;
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
            bpsStringed = bpsStringed.map((b) => {
              if (befSplited[2] === b.bp) {
                b.bef += befStringed;
              }
              return b;
            });
          } else {
            befsStringed += befStringed + '/';
          }
        }
      }
      if (befsStringed !== '') {
        this.consoleLog(
          'info',
          { befsStringed: befsStringed },
          this.styleConsole
        );
        for (let bef of befsStringed.split('/')) {
          if (bef !== '') {
            this.createCSSRules(bef);
          }
        }
      }
      bpsStringed.forEach((b) => {
        if (b.bef !== '') {
          this.consoleLog(
            'info',
            { bp: b.bp, value: b.value, bef: b.bef },
            this.styleConsole
          );
          this.createCSSRules(
            `@media only screen and (min-width: ${b.value}) {html ${b.bef}}`
          );
          b.bef = '';
        }
      });
      const endTimeCSSCreate = performance.now();
      this.consoleLog(
        'info',
        `Call to cssCreate() took ${
          endTimeCSSCreate - startTimeCSSCreate
        } milliseconds`,
        this.styleConsole
      );
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
      this.consoleLog('error', { err: err }, this.styleConsole);
    }
  }

  createCSSRules(rule: string, update: boolean = false): void {
    try {
      this.consoleLog('info', { rule: rule }, this.styleConsole);
      if (rule && !rule.split('{')[0].includes('@media')) {
        let index;
        let originalRule: any = [...this.sheet.cssRules].some(
          (cssRule: any, i: number) => {
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
      } else {
        let originalMediaRules: boolean = false;
        let rulesParsed: string[] = rule
          .replace(/{/g, '/')
          .replace(/}/g, '/')
          .split('/')
          .filter((r) => r !== '')
          .map((r) => {
            return r.replace(/\n/g, '').replace(/\s{2}/g, '');
          });
        let mediaRule: string = rulesParsed[0].includes('media')
          ? rulesParsed[0]
          : '';
        if (mediaRule !== '') {
          if (mediaRule.endsWith(' ')) {
            mediaRule = mediaRule.slice(0, -1);
          }
          rulesParsed.shift();
          [...this.sheet.cssRules].forEach((css) => {
            if (css.cssText.includes(mediaRule) && css.cssRules) {
              originalMediaRules = true;
              let i = 0;
              while (i <= rulesParsed.length) {
                let index: number = 0;
                let posibleRule: any = [...css.cssRules].some(
                  (cssRule: any, ix: number) => {
                    if (cssRule.cssText.includes(rulesParsed[i])) {
                      index = ix;
                      return true;
                    } else {
                      return false;
                    }
                  }
                )
                  ? [...css.cssRules].find((i) =>
                      i.cssText.includes(rulesParsed[i])
                    )
                  : undefined;
                if (!!posibleRule) {
                  css.deleteRule(index);
                }
                let newRule: string = `${rulesParsed[i]}{${
                  rulesParsed[i + 1]
                }}`;
                css.insertRule(newRule, css.cssRules.length);
                i = i + 2;
              }
            }
          });
        }
        if (originalMediaRules === false) {
          this.sheet.insertRule(rule, this.sheet.cssRules.length);
        }
      }
    } catch (err: any) {
      this.consoleLog('error', { err: err }, this.styleConsole);
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

  removePseudos(thing: string, remove: boolean = false): string {
    let pseudoFiltereds: IPseudo[] = this.pseudos.filter((pseudo: IPseudo) => {
      return thing.includes(pseudo.mask);
    });
    pseudoFiltereds = pseudoFiltereds.sort((e1: any, e2: any) => {
      e1 = e1.toString().length;
      e2 = e2.toString().length;
      return e1 > e2 ? 1 : e1 < e2 ? -1 : 0;
    });
    pseudoFiltereds.forEach((pse) => {
      let regMask = new RegExp(':*' + pse.mask, 'gi');
      thing = thing
        .replace('SD', '(')
        .replace('ED', ')')
        .replace(regMask, !remove ? pse.real : '');
    });
    this.consoleParser({ thing: thing });
    return thing;
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

  pushBPS(bps: IBPS[]): void {
    try {
      for (let nb of bps) {
        let bp = this.bps.find((b) => b.bp === nb.bp);
        if (bp) {
          bp.value = nb.value;
          bp.bef = '';
        } else {
          this.bps.push({ bp: nb.bp, value: nb.value, bef: '' });
        }
      }
    } catch (err) {
      this.consoleLog('error', { err: err }, this.styleConsole);
    }
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
      this.consoleLog('error', { err: err }, this.styleConsole);
    }
  }

  getColors(): any {
    this.consoleLog('info', { colors: this.colors }, this.styleConsole);
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
    this.consoleLog(
      'info',
      { color: color, colorValue: this.colors[color] },
      this.styleConsole
    );
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
      this.consoleLog('error', { err: err }, this.styleConsole);
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
      this.consoleLog('error', { err: err }, this.styleConsole);
    }
  }

  clearAllColors(): void {
    this.colors = {};
    this.consoleLog('info', { colors: this.colors }, this.styleConsole);
  }

  getAlreadyCreatedClasses(): string[] {
    this.consoleLog(
      'info',
      { alreadyCreatedClasses: this.alreadyCreatedClasses },
      this.styleConsole
    );
    return this.alreadyCreatedClasses;
  }

  updateClasses(classesToUpdate: string[]): void {
    this.doCssCreate(classesToUpdate);
  }

  getSheet(): any {
    if (this.sheet) {
      this.consoleLog('info', { sheet: this.sheet }, this.styleConsole);
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

  consoleLog(
    type: 'log' | 'info' | 'trace' | 'error' = 'log',
    thing: any,
    style: string = this.styleConsole,
    line: string | null = null,
    stoper: boolean = !this.isDebug
  ): void {
    this.consoleParser({
      type: type,
      thing: thing,
      style: style,
      line: line,
      stoper: stoper,
    });
  }

  consoleParser(config: IConsoleParser): void {
    config.type = config.type ? config.type : 'log';
    config.style = config.style ? config.style : this.styleConsole;
    config.stoper = config.stoper ? config.stoper : !this.isDebug;
    if (config.stoper === false) {
      if (config.line) {
        console.info('%cline: ' + config.line + ' = ', config.style);
      }
      console.info('%c' + this.getStackTrace()[1], config.style);
      console.groupCollapsed('Trace');
      console.trace();
      console.groupEnd();
      {
        switch (config.type) {
          case 'log':
            console.log(
              '%c' +
                (typeof config.thing === 'object'
                  ? JSON.stringify(config.thing)
                  : config.thing),
              config.style
            );
            break;
          case 'info':
            console.info(
              '%c' +
                (typeof config.thing === 'object'
                  ? JSON.stringify(config.thing)
                  : config.thing),
              config.style
            );
            break;
          case 'error':
            console.error(
              '%c' +
                (typeof config.thing === 'object'
                  ? JSON.stringify(config.thing)
                  : config.thing),
              config.style
            );
            break;
          default:
            break;
        }
      }
      if (typeof config.thing === 'object') {
        console.dir(config.thing);
      }
    }
  }
}
