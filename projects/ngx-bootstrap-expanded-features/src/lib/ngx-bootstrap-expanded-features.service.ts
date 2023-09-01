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
  public colors: { [key: string]: string } = {};
  public abreviationsClasses: { [key: string]: string } = {};
  public abreviationsValues: { [key: string]: string } = {};
  public combos: { [key: string]: string[] } = {};
  public combosCreated: { [key: string]: string } = {};
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

  public separator: string = 'þµÞ';
  /* Console */
  public styleConsole: string = `padding: 0.25rem 0.125rem; background-color: ${this.colors['mystic']}; color: ${this.colors['friend']};`;
  /* Pseudos */
  public pseudoClasses: string[] = [
    'Active',
    'Checked',
    'Default',
    'Dir',
    'Disabled',
    'Empty',
    'Enabled',
    'FirstChild',
    'FirstOfType',
    'First',
    'Fullscreen',
    'FocusVisible',
    'FocusWithin',
    'Focus',
    'Hover',
    'Indeterminate',
    'InRange',
    'Invalid',
    'Lang',
    'LastChild',
    'LastOfType',
    'Left',
    'Link',
    'Not',
    'NthChild',
    'NthLastChild',
    'NthLastOfType',
    'NthOfType',
    'OnlyChild',
    'OnlyOfType',
    'Optional',
    'OutOfRange',
    'ReadOnly',
    'ReadWrite',
    'Required',
    'Right',
    'Root',
    'Scope',
    'Target',
    'Valid',
    'Visited',
  ];
  public pseudoElements: string[] = [
    'After',
    'Before',
    'FirstLetter',
    'FirstLine',
    'Selection',
    'Backdrop',
    'Placeholder',
    'Marker',
    'SpellingError',
    'GrammarError',
  ];
  public pseudos: IPseudo[] = this.pseudoClasses
    .sort((e1: number | string, e2: number | string) => {
      e1 = e1.toString().length;
      e2 = e2.toString().length;
      return e1 > e2 ? 1 : e1 < e2 ? -1 : 0;
    })
    .map((pse: string) => {
      return {
        mask: pse,
        real: `${this.separator}:${this.camelToCSSValid(pse)}`,
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
            real: `${this.separator}::${this.camelToCSSValid(pse)}`,
          };
        })
    );
  /* Time Management*/
  public lastCSSCreate: number = Date.now();
  public lastTimeAsked2Create: number = new Date().getTime();
  public timesCSSCreated: number = 0;
  public timeBetweenReCreate: number = 400;
  public useTimer: boolean = true;
  constructor() {
    this.checkSheet();
    this.pushColors(allColors);
  }
  private checkSheet() {
    let sheets: any[] = [...document.styleSheets];
    for (let nsheet of sheets) {
      if (nsheet.href?.includes('bef-styles')) {
        this.sheet = nsheet;
      }
    }
  }
  cssCreate(
    updateBefs: string[] | null = null,
    primordial: boolean = false
  ): void {
    try {
      if (!this.sheet) {
        this.checkSheet();
        if (!this.sheet) {
          throw new Error('There is no bef-styles style sheet!');
        }
      }
      if (!!this.useTimer) {
        this.DoUseTimer(updateBefs, primordial);
      } else {
        this.doCssCreate(updateBefs);
      }
    } catch (err) {
      this.consoleLog('error', { err: err }, this.styleConsole);
    }
  }
  private DoUseTimer(
    updateBefs: string[] | null = null,
    primordial: boolean = false
  ): void {
    this.lastTimeAsked2Create = Date.now();
    this.ta(updateBefs, primordial);
  }
  private ta(updateBefs: string[] | null = null, primordial: boolean = false) {
    if (
      Date.now() - this.lastCSSCreate >= this.timeBetweenReCreate ||
      primordial === true ||
      this.timesCSSCreated === 0
    ) {
      this.timesCSSCreated++;
      this.doCssCreate(updateBefs);
      this.lastCSSCreate = Date.now();
      this.consoleParser({ thing: { timesCSSCreated: this.timesCSSCreated } });
    } else {
      if (Date.now() - this.timeBetweenReCreate < this.lastTimeAsked2Create) {
        this.tas(updateBefs, primordial);
      }
    }
  }
  private tas(updateBefs: string[] | null = null, primordial: boolean = false) {
    setTimeout(() => {
      this.ta(updateBefs, primordial);
    }, this.timeBetweenReCreate);
  }
  async doCssCreate(updateBefs: string[] | null = null): Promise<void> {
    try {
      if (!this.sheet) {
        this.checkSheet();
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
            let comb = Object.keys(this.combos).find((cs) => {
              return item.includes(cs);
            });
            if (!!comb) {
              if (this.combos[comb]) {
                let vals: string[] = !!item.includes('VALS')
                  ? item.split('VALS')[1].split('VL')
                  : [];
                this.combos[comb].forEach((c: string) => {
                  let reg = new RegExp(/VAL[0-9]+(DEF[.]*DEF)?/, 'g');
                  if (reg.test(c)) {
                    let matches = c.match(reg);
                    this.consoleLog(
                      'info',
                      { matches: matches },
                      this.styleConsole
                    );
                    if (!!matches) {
                      for (let match of matches) {
                        let val = parseInt(
                          match.split('VAL')[1].split('DEF')[0]
                        );
                        this.consoleLog(
                          'info',
                          { val: val },
                          this.styleConsole
                        );
                        this.consoleLog(
                          'info',
                          { match: match },
                          this.styleConsole
                        );
                        let pattern = `VAL${val}(DEF[.]*DEF)?`;
                        let nreg = new RegExp(pattern, 'g');
                        this.consoleLog(
                          'info',
                          { nreg: nreg },
                          this.styleConsole
                        );
                        let def = match.split('DEF')[1];
                        if (
                          !!vals[val] &&
                          vals[val] !== '' &&
                          vals[val] !== 'undefined' &&
                          vals[val] !== 'DEF' &&
                          vals[val] !== 'null'
                        ) {
                          this.consoleLog(
                            'info',
                            { valsval: vals[val] },
                            this.styleConsole
                          );
                          if (/VAL[0-9]+/.test(vals[val])) {
                            let valval = vals[val].replace('VAL', '');
                            this.consoleLog(
                              'info',
                              { valval: valval },
                              this.styleConsole
                            );
                            c = c.replace(
                              nreg,
                              vals[parseInt(valval)]
                                ? vals[parseInt(valval)]
                                : def
                                ? def
                                : ''
                            );
                          } else {
                            c = c.replace(nreg, vals[val]);
                            this.consoleLog(
                              'info',
                              { c: c },
                              this.styleConsole
                            );
                          }
                        } else {
                          this.consoleLog(
                            'info',
                            { def: def },
                            this.styleConsole
                          );
                          c = c.replace(nreg, def ? def : '');
                        }
                      }
                    }
                  }
                  if (c.startsWith('bef')) {
                    let combosCreatedABBR = Object.keys(this.combosCreated);
                    this.consoleLog(
                      'info',
                      { combosCreatedABBR: combosCreatedABBR },
                      this.styleConsole
                    );
                    let alreadyABBRCombo = combosCreatedABBR.find((cs) => {
                      return this.combosCreated[cs] === item;
                    });
                    this.consoleLog(
                      'info',
                      { alreadyABBRCombo: alreadyABBRCombo },
                      this.styleConsole
                    );
                    let combosCreatedLenght = combosCreatedABBR.length;
                    if (!alreadyABBRCombo) {
                      this.combosCreated['■■■' + combosCreatedLenght] = item;
                      this.consoleLog(
                        'info',
                        {
                          cStartsWithBef:
                            this.combosCreated['■■■' + combosCreatedLenght],
                        },
                        this.styleConsole
                      );
                    }
                    this.consoleLog(
                      'info',
                      { combosCreatedABBR: combosCreatedABBR },
                      this.styleConsole
                    );
                    let comboABBR: string =
                      '■■■' +
                      (combosCreatedLenght !== 0 ? combosCreatedLenght - 1 : 0);
                    this.consoleLog(
                      'info',
                      { comboABBR: comboABBR },
                      this.styleConsole
                    );
                    this.consoleLog('info', { c: c }, this.styleConsole);
                    let pseudos = this.pseudos.filter((p) =>
                      c.split('-')[1].includes(p.mask)
                    );
                    let firstPseudo =
                      pseudos.sort((p1, p2) => {
                        return c.indexOf(p1.mask) - c.indexOf(p2.mask);
                      })[0] || -1;

                    switch (true) {
                      case pseudos.length > 0 &&
                        !!(
                          !c.includes('SEL') ||
                          c.indexOf('SEL') > c.indexOf(firstPseudo.mask)
                        ):
                        this.consoleLog(
                          'info',
                          { firstPseudo: firstPseudo },
                          this.styleConsole
                        );
                        c = c
                          .replace('SEL', '')
                          .replace(
                            firstPseudo.mask,
                            'SEL__COM_' + comboABBR + firstPseudo.mask
                          );
                        this.consoleLog(
                          'info',
                          { cIncludesPseudoAfter: c },
                          this.styleConsole
                        );
                        break;
                      case !!c.includes('SEL'):
                        c = c.replace('SEL', 'SEL__COM_' + comboABBR + '__');
                        this.consoleLog(
                          'info',
                          { cIncludesSELAfter: c },
                          this.styleConsole
                        );
                        break;
                      default:
                        this.consoleLog(
                          'info',
                          { cDoesntIncludesSEL: c },
                          this.styleConsole
                        );
                        c = c.replace(
                          c.split('-')[1],
                          c.split('-')[1] + 'SEL__COM_' + comboABBR
                        );
                        this.consoleLog(
                          'info',
                          { cDoesntIncludesSELAfter: c },
                          this.styleConsole
                        );
                        break;
                    }
                    /* if (!!c.includes('SEL')) {
                      if (
                        pseudos.length > 0 &&
                        !!(c.indexOf('SEL') > c.indexOf(firstPseudo.mask))
                      ) {
                        c = c
                          .replace('SEL', '')
                          .replace(
                            firstPseudo.mask,
                            'SEL__COM_' + comboABBR + firstPseudo.mask
                          );
                      } else {
                        c = c.replace('SEL', 'SEL__COM_' + comboABBR + '__');
                      }
                    } else {
                      if (pseudos.length > 0) {
                        let firstPseudo = pseudos.sort((p1, p2) => {
                          return c.indexOf(p1.mask) - c.indexOf(p2.mask);
                        })[0];
                        c = c.replace(
                          firstPseudo.mask,
                          'SEL__COM_' + comboABBR + firstPseudo.mask
                        );
                      } else {
                        c = c.replace(
                          c.split('-')[1],
                          c.split('-')[1] + 'SEL__COM_' + comboABBR
                        );
                      }
                    } */
                  } else {
                    this.consoleLog(
                      'info',
                      { cDoesntStartsWithBef: c },
                      this.styleConsole
                    );
                    befElement.classList.add(c);
                  }
                  if (!befs.includes(c)) {
                    befs.push(c);
                  }
                });
              }
            } else if (
              !befs.includes(item) &&
              item !== 'bef' &&
              (item.includes('bef') ||
                Object.keys(this.abreviationsClasses).find((aC) =>
                  item.includes(aC)
                ))
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
          if (
            this.alreadyCreatedClasses.find((aC) => {
              return aC === bef;
            })
          ) {
            continue;
          }
          if (
            [...this.sheet.cssRules].find((i) =>
              i.cssText.split(' ').find((aC: string) => {
                return aC.replace('.', '') === bef;
              })
            )
          ) {
            continue;
          }
        }
        if (
          !this.alreadyCreatedClasses.find((aC) => {
            return aC === bef;
          })
        ) {
          this.alreadyCreatedClasses.push(bef);
        }
        let befStringed = '.' + bef;
        if (!bef.includes('bef')) {
          let abbrClss = Object.keys(this.abreviationsClasses).find((aC) =>
            bef.includes(aC)
          );
          if (!!abbrClss) {
            bef = bef.replace(abbrClss, this.abreviationsClasses[abbrClss]);
          }
        }
        let befSplited = bef.split('-');
        /* if (befSplited[1].includes('SLASH')) {
          debugger;
        } */
        if (befSplited[1].includes('boxCustom')) {
          this.consoleLog(
            'info',
            { befSplited1: befSplited[1] },
            this.styleConsole
          );
        }
        let befSRP = this.removePseudos(befSplited[1])
          .replace(/SEL/g, this.separator)
          .split(`${this.separator}`);
        if (befSplited[1].includes('boxCustom')) {
          this.consoleLog('info', { befSRP: befSRP }, this.styleConsole);
        }
        let selector = befSRP[0];
        let specify = this.unbefysize(
          befSRP
            .map((bs, i) => {
              if (i !== 0) {
                return bs;
              } else {
                return '';
              }
            })
            .join('')
        );
        if (!!specify) {
          let alreadyABBRCombo = Object.keys(this.combosCreated).find((cs) =>
            specify.includes(cs)
          );
          if (!!alreadyABBRCombo) {
            this.consoleLog(
              'info',
              { OPalreadyABBRCombo: alreadyABBRCombo },
              this.styleConsole
            );
            specify = specify.replace(
              alreadyABBRCombo,
              this.combosCreated[alreadyABBRCombo]
            );
            bef = bef.replace(
              alreadyABBRCombo,
              this.combosCreated[alreadyABBRCombo]
            );
          }
        }
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
        value = this.unbefysize(
          !!this.abreviationsValues[value]
            ? this.abreviationsValues[value]
            : value
        );
        secondValue = this.unbefysize(
          !!this.abreviationsValues[secondValue]
            ? this.abreviationsValues[secondValue]
            : secondValue
        );
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
                : !!this.colors[sv.toString()]
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
                  ${
                    this.separator
                  }.${bef}:hover{background-color:${this.shadeTintColor(
              this.HexToRGB(value),
              -15
            )};border-color:${this.shadeTintColor(this.HexToRGB(value), -20)};}
                  ${
                    this.separator
                  }.btn-check:focus + .${bef}, .${bef}:focus{background-color:${this.shadeTintColor(
              this.HexToRGB(value),
              -15
            )};border-color:${this.shadeTintColor(this.HexToRGB(value), -20)};}
                  ${
                    this.separator
                  }.btn-check:checked + .${bef}, .btn-check:active + .${bef}, .${bef}:active, .${bef}.active, .show > .${bef}.dropdown-toggle{background-color:${this.shadeTintColor(
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
                  ${
                    this.separator
                  }.btn-check:checked + .btn-check:focus, .btn-check:active + .${bef}:focus, .${bef}:active:focus, .${bef}.active:focus, .show > .${bef}.dropdown-toggle:focus{box-shadow: 0 0 0 0.25rem
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
                    ${this.separator}.${bef}:hover{
                      background-color:${value};
                      color:${secondValue ? secondValue : 'default'};
                      border-color:${this.shadeTintColor(
                        this.HexToRGB(value),
                        -20
                      )};}
                    ${this.separator}.btn-check:focus + .${bef}, .${bef}:focus{
                      border-color:${this.shadeTintColor(
                        this.HexToRGB(value),
                        -20
                      )};}
                    ${
                      this.separator
                    }.btn-check:checked + .${bef}, .btn-check:active + .${bef}, .${bef}:active, .${bef}.active, .show > .${bef}.dropdown-toggle{
                      border-color:${this.shadeTintColor(
                        this.HexToRGB(value),
                        -25
                      )};
                    box-shadow: 0 0 0 0.25rem
                    rgba(${this.HexToRGB(
                      this.shadeTintColor(this.HexToRGB(value), 3)
                    )}, 0.5)
                    ;}
                    ${
                      this.separator
                    }.btn-check:checked + .btn-check:focus, .btn-check:active + .${bef}:focus, .${bef}:active:focus, .${bef}.active:focus, .show > .${bef}.dropdown-toggle:focus{
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
            befStringed = befStringed.replace(
              new RegExp(this.separator, 'g'),
              ''
            );
            bpsStringed = bpsStringed.map((b) => {
              if (befSplited[2] === b.bp) {
                b.bef += befStringed;
              }
              return b;
            });
          } else {
            befsStringed += befStringed + this.separator;
          }
        }
      }
      if (befsStringed !== '') {
        this.consoleLog(
          'info',
          { befsStringed: befsStringed },
          this.styleConsole
        );
        for (let bef of befsStringed.split(this.separator)) {
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
            `@media only screen and (min-width: ${b.value}) {html body ${b.bef}}`
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
  createCSSRules(rule: string): void {
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
          ? [...this.sheet.cssRules].find(
              (i) =>
                i.cssText
                  /* .includes(
                    rule.split('{')[0].replace('\n', '').replace(/\s+/g, ' ')
                  ) */
                  .split(' ')
                  .find((aC: string) => {
                    return (
                      aC.replace('.', '') ===
                      rule.split('{')[0].replace('\n', '').replace(/\s+/g, ' ')
                    );
                  })
              /*
            i.cssText.split(' ').find((aC: string) => {
                return aC.replace('.', '') === bef;
              })
            */
            )
          : undefined;
        if (originalRule) {
          this.sheet.deleteRule(index);
        }
        this.consoleLog('info', { rule: rule }, this.styleConsole);
        this.sheet.insertRule(rule, this.sheet.cssRules.length);
      } else {
        let originalMediaRules: boolean = false;
        let rulesParsed: string[] = rule
          .replace(/{/g, this.separator)
          .replace(/}/g, this.separator)
          .split(this.separator)
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
                      i.cssText.split(' ').find((aC: string) => {
                        return aC.replace('.', '') === rulesParsed[i];
                      })
                    )
                  : /* .includes(rulesParsed[i])) */
                    /*
            i.cssText.split(' ').find((aC: string) => {
                return aC.replace('.', '') === bef;
              })
            */
                    undefined;
                if (!!posibleRule) {
                  css.deleteRule(index);
                }
                let newRule: string = `${rulesParsed[i]}{${
                  rulesParsed[i + 1]
                }}`;
                this.consoleLog(
                  'info',
                  { newRule: newRule },
                  this.styleConsole
                );
                css.insertRule(newRule, css.cssRules.length);
                i = i + 2;
              }
            }
          });
        }
        if (originalMediaRules === false) {
          this.consoleLog('info', { rule: rule }, this.styleConsole);
          this.sheet.insertRule(rule, this.sheet.cssRules.length);
        }
      }
      this.consoleLog('info', { sheet: this.sheet }, this.styleConsole);
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
              parseInt(HexNoCat.slice(0, 2), 16),
              parseInt(HexNoCat.slice(2, 2), 16),
              parseInt(HexNoCat.slice(4, 2), 16),
              parseInt(((HexNoCat.slice(6, 2), 16) / 255).toFixed(2)),
            ]
          : HexNoCat.length !== 3 && HexNoCat.length === 6
          ? [
              parseInt(HexNoCat.slice(0, 2), 16),
              parseInt(HexNoCat.slice(2, 2), 16),
              parseInt(HexNoCat.slice(4, 2), 16),
            ]
          : HexNoCat.length !== 3 && HexNoCat.length === 4
          ? [
              parseInt(HexNoCat.slice(0, 2), 16),
              parseInt(HexNoCat.slice(1, 2), 16),
              parseInt(HexNoCat.slice(2, 2), 16),
              parseInt(((HexNoCat.slice(3, 2), 16) / 255).toFixed(2)),
            ]
          : [
              parseInt(HexNoCat.slice(0, 1) + HexNoCat.slice(0, 1), 16),
              parseInt(HexNoCat.slice(1, 1) + HexNoCat.slice(1, 1), 16),
              parseInt(HexNoCat.slice(2, 1) + HexNoCat.slice(2, 1), 16),
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
  private removePseudos(thing: string, remove: boolean = false): string {
    let pseudoFiltereds: IPseudo[] = this.pseudos.filter((pseudo: IPseudo) => {
      return thing.includes(pseudo.mask);
    });
    pseudoFiltereds.forEach((pse) => {
      let regMask = new RegExp(':*' + pse.mask, 'gi');
      thing = thing
        .replace('SD', '(')
        .replace('ED', ')')
        .replace(regMask, !remove ? pse.real : '');
    });
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
  /* CRUD */
  pushCssNamesParsed(cssNamesParsed: any): void {
    try {
      Object.keys(cssNamesParsed).forEach((key) => {
        this.cssNamesParsed[key] = cssNamesParsed[key];
      });
      this.cssCreate();
    } catch (err) {
      this.consoleLog('error', { err: err }, this.styleConsole);
    }
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
      this.cssCreate();
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
      this.cssCreate();
    } catch (err) {
      this.consoleLog('error', { err: err }, this.styleConsole);
    }
  }
  pushAbreviationsValues(abreviationsValues: any): void {
    try {
      let prevIgnoredAbreviationsValues: string[] = [];
      Object.keys(abreviationsValues).forEach((key) => {
        this.abreviationsValues[key] = abreviationsValues[key];
        prevIgnoredAbreviationsValues = this.alreadyCreatedClasses.filter(
          (aC) => {
            return aC.includes(key);
          }
        );
      });
      if (prevIgnoredAbreviationsValues.length > 0) {
        this.cssCreate(prevIgnoredAbreviationsValues);
      }
    } catch (err) {
      this.consoleLog('error', { err: err }, this.styleConsole);
    }
  }
  pushAbreviationsClasses(abreviationsClasses: any): void {
    let prevIgnoredAbreviationsValues: string[] = [];
    try {
      Object.keys(abreviationsClasses).forEach((key) => {
        this.abreviationsClasses[key] = abreviationsClasses[key];
        prevIgnoredAbreviationsValues = this.alreadyCreatedClasses.filter(
          (aC) => {
            return aC.includes(key);
          }
        );
      });
      if (prevIgnoredAbreviationsValues.length > 0) {
        this.cssCreate(prevIgnoredAbreviationsValues);
      } else {
        this.cssCreate();
      }
    } catch (err) {
      this.consoleLog('error', { err: err }, this.styleConsole);
    }
  }
  pushCombos(combos: any): void {
    try {
      let prevIgnoredCombosValues: string[] = [];
      Object.keys(combos).forEach((key) => {
        this.combos[key] =
          typeof combos[key] === 'string'
            ? combos[key].split(' ')
            : combos[key]
                .map((c: string) => {
                  return c.split(' ').flat();
                })
                .flat();
        prevIgnoredCombosValues = this.alreadyCreatedClasses.filter((aC) => {
          return aC.includes(key);
        });
      });
      if (prevIgnoredCombosValues.length > 0) {
        this.cssCreate(prevIgnoredCombosValues);
      } else {
        this.cssCreate();
      }
    } catch (err) {
      this.consoleLog('error', { err: err }, this.styleConsole);
    }
  }
  getColors(): any {
    this.consoleLog('info', { colors: this.colors }, this.styleConsole);
    return this.colors;
  }
  getBPS(): any {
    this.consoleLog('info', { bps: this.bps }, this.styleConsole);
    return this.bps;
  }
  getAbreviationsClasses(): any {
    this.consoleLog(
      'info',
      { abreviationsClasses: this.abreviationsClasses },
      this.styleConsole
    );
    return this.abreviationsClasses;
  }
  getAbreviationsValues(): any {
    this.consoleLog(
      'info',
      { abreviationsValues: this.abreviationsValues },
      this.styleConsole
    );
    return this.abreviationsValues;
  }
  getCombos(): any {
    this.consoleLog('info', { combos: this.combos }, this.styleConsole);
    return this.combos;
  }
  getCssNamesParsed(): any {
    this.consoleLog(
      'info',
      { cssNamesParsed: this.cssNamesParsed },
      this.styleConsole
    );
    return this.cssNamesParsed;
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
  getAlreadyCreatedClasses(): string[] {
    this.consoleLog(
      'info',
      { alreadyCreatedClasses: this.alreadyCreatedClasses },
      this.styleConsole
    );
    return this.alreadyCreatedClasses;
  }
  getSheet(): any {
    if (this.sheet) {
      this.consoleLog('info', { sheet: this.sheet }, this.styleConsole);
      return this.sheet;
    } else {
      return '';
    }
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
          this.cssCreate(classesToUpdate);
        }
      } else {
        throw new Error(`There is no color named ${color}.`);
      }
    } catch (err) {
      this.consoleLog('error', { err: err }, this.styleConsole);
    }
  }
  updateAbreviationsClass(abreviationsClass: string, value: string): void {
    try {
      if (this.abreviationsClasses[abreviationsClass.toString()]) {
        this.abreviationsClasses[abreviationsClass] = value;
        let classesToUpdate: string[] = [];
        for (let createdClass of this.alreadyCreatedClasses) {
          if (createdClass.includes(abreviationsClass)) {
            classesToUpdate.push(createdClass);
          }
        }
        if (classesToUpdate.length > 0) {
          this.cssCreate(classesToUpdate);
        }
      } else {
        throw new Error(
          `There is no abreviationsClass named ${abreviationsClass}.`
        );
      }
    } catch (err) {
      this.consoleLog('error', { err: err }, this.styleConsole);
    }
  }
  updateAbreviationsValue(abreviationsValue: string, value: string): void {
    try {
      if (this.abreviationsValues[abreviationsValue.toString()]) {
        this.abreviationsValues[abreviationsValue] = value;
        let classesToUpdate: string[] = [];
        for (let createdClass of this.alreadyCreatedClasses) {
          if (createdClass.includes(abreviationsValue)) {
            classesToUpdate.push(createdClass);
          }
        }
        if (classesToUpdate.length > 0) {
          this.cssCreate(classesToUpdate);
        }
      } else {
        throw new Error(
          `There is no abreviationsValue named ${abreviationsValue}.`
        );
      }
    } catch (err) {
      this.consoleLog('error', { err: err }, this.styleConsole);
    }
  }
  updateCombo(combo: string, values: string[]): void {
    try {
      if (this.combos[combo.toString()]) {
        this.combos[combo] = values;
        let classes2Delete: string[] = [];
        for (let createdClass of this.alreadyCreatedClasses) {
          if (createdClass.includes(combo)) {
            classes2Delete.push(createdClass);
          }
        }
        if (classes2Delete.length > 0) {
          for (let class2Delete of classes2Delete) {
            this.sheet.deleteRule(
              [...this.sheet.cssRules].findIndex((cssRule) => {
                return cssRule.cssText.includes(class2Delete);
              })
            );
            this.alreadyCreatedClasses = this.alreadyCreatedClasses.filter(
              (aC) => {
                return aC !== class2Delete;
              }
            );
          }
          this.cssCreate();
        }
      } else {
        throw new Error(`There is no combo named ${combo}.`);
      }
    } catch (err) {
      this.consoleLog('error', { err: err }, this.styleConsole);
    }
  }
  updateCssNamesParsed(cssNameParsed: string, value: string): void {
    try {
      if (this.cssNamesParsed[cssNameParsed.toString()]) {
        this.cssNamesParsed[cssNameParsed] = value;
        let classesToUpdate: string[] = [];
        for (let createdClass of this.alreadyCreatedClasses) {
          if (createdClass.includes(cssNameParsed)) {
            classesToUpdate.push(createdClass);
          }
        }
        if (classesToUpdate.length > 0) {
          this.cssCreate(classesToUpdate);
        }
      } else {
        throw new Error(`There is no cssNameParsed named ${cssNameParsed}.`);
      }
    } catch (err) {
      this.consoleLog('error', { err: err }, this.styleConsole);
    }
  }
  updateClasses(classesToUpdate: string[]): void {
    this.cssCreate(classesToUpdate);
  }
  deleteColor(color: string): void {
    try {
      if (!!this.colors[color.toString()]) {
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
  /* Debuging */
  changeDebugOption(): void {
    this.isDebug = !this.isDebug;
  }
  changeUseTimerOption(): void {
    this.useTimer = !this.useTimer;
  }
  setTimeBetweenReCreate(time: number): void {
    this.timeBetweenReCreate = time;
  }
  unbefysize(value: string): string {
    return value
      .replace(/(\d+)\s*per/g, '$1%')
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
      .replace(/UND/g, '_')
      .replace(/CHILD/g, ' > ')
      .replace(/ADJ/g, ' + ')
      .replace(/SIBL/g, ' ~ ')
      .replace(/ALL/g, '*')
      .replace(/EQ/g, '=')
      .replace(/ST/g, '^')
      .replace(/INC/g, '$')
      .replace(/DPS/g, ':')
      .replace(/PNC/g, ';');
  }
  befysize(value: string): string {
    return value
      .replace(/%/g, 'per')
      .replace(/\s+,\s+/g, 'COM')
      .replace(/'/g, `CSP`)
      .replace(/"/g, `CDB`)
      .replace(/-/g, 'MIN')
      .replace(/\+/g, 'PLUS')
      .replace(/\(/g, 'SD')
      .replace(/\)/g, 'ED')
      .replace(/\[/g, 'SE')
      .replace(/\]/g, 'EE')
      .replace(/#/g, 'HASH')
      .replace(/\//g, 'SLASH')
      .replace(/_/g, 'UND')
      .replace(/\s/g, '__')
      .replace(/\./g, '_')
      .replace(/\s+>\s+/g, 'CHILD')
      .replace(/\s+\+\s+/g, 'ADJ')
      .replace(/\s~\s/g, 'SIBL')
      .replace(/\*/g, 'ALL')
      .replace(/=/g, 'EQ')
      .replace(/\^/g, 'ST')
      .replace(/\$/g, 'INC')
      .replace(/:/g, 'DPS')
      .replace(/;/g, 'PNC');
  }
  private getStackTrace(): string {
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
    config.stoper = config.stoper !== undefined ? config.stoper : !this.isDebug;
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
