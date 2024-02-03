/* Interfaces */
import { IBPS, IPseudo } from '../../interfaces';
/* Singletons */
import { ValuesSingleton } from '../../singletons/valuesSingleton';
import { abrevviation_traductors } from '../abreviation_traductors';
/* Funtions */
import { console_log } from '../console_log';
import { manage_sheet } from '../manage_sheet';
import { color_transform } from '../color_transform';
import { css_camel } from '../css-camel';
import { manage_CSSRules } from '../manage_CSSRules';

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const doCssCreate = {
  async start(updateBefs: string[] | null = null): Promise<void> {
    try {
      if (!values.sheet) {
        manage_sheet.checkSheet();
        if (!values.sheet) {
          throw new Error('There is no bef-styles style sheet!');
        }
      }
      const startTimeCSSCreate = performance.now();
      let befs: string[] = [];
      if (!updateBefs) {
        let befElements: any = document.getElementsByClassName('bef');
        for (let befElement of befElements) {
          befElement.classList.forEach((item: any) => {
            let comb = Object.keys(values.combos).find((cs) => {
              return item.includes(cs);
            });
            if (!!comb) {
              if (values.combos[comb]) {
                let vals: string[] = !!item.includes('VALS')
                  ? item.split('VALS')[1].split('VL')
                  : [];
                values.combos[comb].forEach((c: string) => {
                  let reg = new RegExp(/VAL[0-9]+(DEF[.]*DEF)?/, 'g');
                  if (reg.test(c)) {
                    let matches = c.match(reg);
                    console_log.consoleLog(
                      'info',
                      { matches: matches },
                      values.styleConsole
                    );
                    if (!!matches) {
                      for (let match of matches) {
                        let val = parseInt(
                          match.split('VAL')[1].split('DEF')[0]
                        );
                        console_log.consoleLog(
                          'info',
                          { val: val },
                          values.styleConsole
                        );
                        console_log.consoleLog(
                          'info',
                          { match: match },
                          values.styleConsole
                        );
                        let pattern = `VAL${val}(DEF[.]*DEF)?`;
                        let nreg = new RegExp(pattern, 'g');
                        console_log.consoleLog(
                          'info',
                          { nreg: nreg },
                          values.styleConsole
                        );
                        let def = match.split('DEF')[1];
                        if (
                          !!vals[val] &&
                          vals[val] !== '' &&
                          vals[val] !== 'undefined' &&
                          vals[val] !== 'DEF' &&
                          vals[val] !== 'null'
                        ) {
                          console_log.consoleLog(
                            'info',
                            { vals_val: vals[val] },
                            values.styleConsole
                          );
                          if (/VAL[0-9]+/.test(vals[val])) {
                            let valval = vals[val].replace('VAL', '');
                            console_log.consoleLog(
                              'info',
                              { valval: valval },
                              values.styleConsole
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
                            console_log.consoleLog(
                              'info',
                              { c: c },
                              values.styleConsole
                            );
                          }
                        } else {
                          console_log.consoleLog(
                            'info',
                            { def: def },
                            values.styleConsole
                          );
                          c = c.replace(nreg, def ? def : '');
                        }
                      }
                    }
                  }
                  if (c.startsWith('bef')) {
                    let combosCreatedABBR = Object.keys(values.combosCreated);
                    console_log.consoleLog(
                      'info',
                      { combosCreatedABBR: combosCreatedABBR },
                      values.styleConsole
                    );
                    let alreadyABBRCombo = combosCreatedABBR.find((cs) => {
                      return values.combosCreated[cs] === item;
                    });
                    console_log.consoleLog(
                      'info',
                      { alreadyABBRCombo: alreadyABBRCombo },
                      values.styleConsole
                    );
                    let combosCreatedLenght = combosCreatedABBR.length;
                    if (!alreadyABBRCombo) {
                      values.combosCreated['■■■' + combosCreatedLenght] = item;
                      console_log.consoleLog(
                        'info',
                        {
                          cStartsWithBef:
                            values.combosCreated['■■■' + combosCreatedLenght],
                        },
                        values.styleConsole
                      );
                    }
                    console_log.consoleLog(
                      'info',
                      { combosCreatedABBR: combosCreatedABBR },
                      values.styleConsole
                    );
                    let comboABBR: string =
                      '■■■' +
                      (combosCreatedLenght !== 0 ? combosCreatedLenght - 1 : 0);
                    console_log.consoleLog(
                      'info',
                      { comboABBR: comboABBR },
                      values.styleConsole
                    );
                    console_log.consoleLog(
                      'info',
                      { c: c },
                      values.styleConsole
                    );
                    let pseudos = values.pseudos.filter((p: any) =>
                      c.split('-')[1].includes(p.mask)
                    );
                    let firstPseudo =
                      pseudos.sort((p1: any, p2: any) => {
                        return c.indexOf(p1.mask) - c.indexOf(p2.mask);
                      })[0] || -1;

                    switch (true) {
                      case pseudos.length > 0 &&
                        !!(
                          !c.includes('SEL') ||
                          c.indexOf('SEL') > c.indexOf(firstPseudo.mask)
                        ):
                        console_log.consoleLog(
                          'info',
                          { firstPseudo: firstPseudo },
                          values.styleConsole
                        );
                        c = c
                          .replace('SEL', '')
                          .replace(
                            firstPseudo.mask,
                            'SEL__COM_' + comboABBR + firstPseudo.mask
                          );
                        console_log.consoleLog(
                          'info',
                          { cIncludesPseudoAfter: c },
                          values.styleConsole
                        );
                        break;
                      case !!c.includes('SEL'):
                        c = c.replace('SEL', 'SEL__COM_' + comboABBR + '__');
                        console_log.consoleLog(
                          'info',
                          { cIncludesSELAfter: c },
                          values.styleConsole
                        );
                        break;
                      default:
                        console_log.consoleLog(
                          'info',
                          { cDoesntIncludesSEL: c },
                          values.styleConsole
                        );
                        c = c.replace(
                          c.split('-')[1],
                          c.split('-')[1] + 'SEL__COM_' + comboABBR
                        );
                        console_log.consoleLog(
                          'info',
                          { cDoesntIncludesSELAfter: c },
                          values.styleConsole
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
                    console_log.consoleLog(
                      'info',
                      { cDoesntStartsWithBef: c },
                      values.styleConsole
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
                Object.keys(values.abreviationsClasses).find((aC) =>
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
      console_log.consoleLog('info', { befs: befs }, values.styleConsole);
      let befsStringed = '';
      let bpsStringed: IBPS[] = values.bps.map((b: any) => b);
      for (let bef of befs) {
        if (!updateBefs) {
          if (
            values.alreadyCreatedClasses.find((aC: any) => {
              return aC === bef;
            })
          ) {
            continue;
          }
          if (
            [...values.sheet.cssRules].find((i) =>
              i.cssText.split(' ').find((aC: string) => {
                return aC.replace('.', '') === bef;
              })
            )
          ) {
            continue;
          }
        }
        if (
          !values.alreadyCreatedClasses.find((aC: any) => {
            return aC === bef;
          })
        ) {
          values.alreadyCreatedClasses.push(bef);
        }
        let befStringed = '.' + bef;
        if (!bef.includes('bef')) {
          let abbrClss = Object.keys(values.abreviationsClasses).find((aC) =>
            bef.includes(aC)
          );
          if (!!abbrClss) {
            bef = bef.replace(abbrClss, values.abreviationsClasses[abbrClss]);
          }
        }
        let befSplited = bef.split('-');
        /* if (befSplited[1].includes('SLASH')) {
          debugger;
        } */
        console_log.consoleLog(
          'info',
          { befSplited1: befSplited[1] },
          values.styleConsole
        );
        let befSRP = this.removePseudos(befSplited[1])
          .replace(/SEL/g, values.separator)
          .split(`${values.separator}`);
        console_log.consoleLog('info', { befSRP: befSRP }, values.styleConsole);
        let selector = befSRP[0];
        let specify = abrevviation_traductors.abreviationTraductor(
          befSRP
            .map((bs: any, i: any) => {
              if (i !== 0) {
                return bs;
              } else {
                return '';
              }
            })
            .join('')
        );
        if (!!specify) {
          let alreadyABBRCombo = Object.keys(values.combosCreated).find((cs) =>
            specify.includes(cs)
          );
          if (!!alreadyABBRCombo) {
            console_log.consoleLog(
              'info',
              { OPalreadyABBRCombo: alreadyABBRCombo },
              values.styleConsole
            );
            specify = specify.replace(
              alreadyABBRCombo,
              values.combosCreated[alreadyABBRCombo]
            );
            bef = bef.replace(
              alreadyABBRCombo,
              values.combosCreated[alreadyABBRCombo]
            );
          }
        }
        let hasBP = false;
        let value = '';
        let secondValue = '';
        if (values.bps.find((b: any) => befSplited[2] === b.bp)) {
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
        value = abrevviation_traductors.abreviationTraductor(
          !!values.abreviationsValues[value]
            ? values.abreviationsValues[value]
            : value
        );
        secondValue = abrevviation_traductors.abreviationTraductor(
          !!values.abreviationsValues[secondValue]
            ? values.abreviationsValues[secondValue]
            : secondValue
        );
        let vals: any = {
          value: value,
          secondValue: secondValue,
        };
        if (!selector.includes('content')) {
          Object.keys(vals).forEach((v) => {
            let hasOPA: boolean = vals[v].includes('OPA');
            if (!!hasOPA) {
              const reg = new RegExp(
                /(?:([A-z0-9#]*)|(?:(rgb)|(hsl)|(hwb))a?\([0-9\.\,\s%]*\))\s?OPA\s?0\.[0-9]*/gi
              );
              const OPAS = vals[v].match(reg);
              for (let OPA of OPAS) {
                const color = OPA.split('OPA')[0];
                const OPAValue = OPA.split('OPA')[1];
                let realColor = `${color_transform
                  .colorToRGB(
                    !!values.colors[color.toString().replace(/\s/g, '')]
                      ? values.colors[color.toString().replace(/\s/g, '')]
                      : color
                  )
                  .toString()}`;
                vals[v] = !!OPAValue
                  ? vals[v]
                      .replace(color, `rgba(${realColor},${OPAValue})`)
                      .replace('OPA' + OPAValue, '')
                  : vals[v];
              }
            }
            let colors = Object.keys(values.colors)
              .sort((c1, c2) => {
                return c2.length - c1.length;
              })
              .map((c) => `(${c})`)
              .join('|');
            let reg = new RegExp('(?:' + colors + ')', 'gi');
            let matches = vals[v].match(reg);
            if (!!matches) {
              for (let match of matches) {
                let realColor: string | undefined =
                  values.colors[match.replace(/\s/g, '')];
                if (!!realColor) {
                  vals[v] = vals[v].replace(
                    match,
                    `rgba(${color_transform.colorToRGB(realColor)})`
                  );
                }
              }
            }
          });
        }
        value = vals.value;
        secondValue = vals.secondValue;
        console_log.consoleLog(
          'info',
          { value: value, secondValue: secondValue },
          values.styleConsole
        );
        /* MatchForColors */
        /* MatchForColorsEnd */
        switch (true) {
          case !!values.cssNamesParsed[selector.toString()]:
            if (
              typeof values.cssNamesParsed[selector.toString()] === 'string'
            ) {
              befStringed += `${specify}{${
                values.cssNamesParsed[selector.toString()]
              }:${value};}`;
            } else {
              befStringed += `${specify}{${
                values.cssNamesParsed[selector.toString()][0]
              }:${value};${
                values.cssNamesParsed[selector.toString()][1]
              }:${value};}`;
            }
            break;
          case befSplited[1].startsWith('link'):
            befStringed += ` a${specify}{color:${value};}`;
            break;
          case befSplited[1] === 'btn':
            befStringed += `{
                    background-color:${value};
                    border-color:${value};}
                  ${
                    values.separator
                  }.${bef}:hover{background-color:rgba(${color_transform
              .shadeTintColor(color_transform.colorToRGB(value), -15)
              .toString()});border-color:rgba(${color_transform
              .shadeTintColor(color_transform.colorToRGB(value), -20)
              .toString()});}
                  ${
                    values.separator
                  }.btn-check:focus + .${bef}, .${bef}:focus{background-color:rgba(${color_transform
              .shadeTintColor(color_transform.colorToRGB(value), -15)
              .toString()});border-color:rgba(${color_transform
              .shadeTintColor(color_transform.colorToRGB(value), -20)
              .toString()});}
                  ${
                    values.separator
                  }.btn-check:checked + .${bef}, .btn-check:active + .${bef}, .${bef}:active, .${bef}.active, .show > .${bef}.dropdown-toggle{background-color:${color_transform.shadeTintColor(
              color_transform.colorToRGB(value),
              -20
            )};border-color:rgba(${color_transform
              .shadeTintColor(color_transform.colorToRGB(value), -25)
              .toString()});box-shadow: 0 0 0 0.25rem
                  rgba(${color_transform
                    .shadeTintColor(color_transform.colorToRGB(value), 3)
                    .toString()}, 0.5)
                  ;}
                  ${
                    values.separator
                  }.btn-check:checked + .btn-check:focus, .btn-check:active + .${bef}:focus, .${bef}:active:focus, .${bef}.active:focus, .show > .${bef}.dropdown-toggle:focus{box-shadow: 0 0 0 0.25rem
                    rgba(${color_transform
                      .shadeTintColor(color_transform.colorToRGB(value), 3)
                      .toString()}, 0.5)
                  ;}`;
            break;
          case befSplited[1] === 'btnOutline':
            befStringed += `{
                    color:${value};
                    background-color:${secondValue ? secondValue : 'default'};
                      border-color:${value};}
                    ${values.separator}.${bef}:hover{
                      background-color:${value};
                      color:${secondValue ? secondValue : 'default'};
                      border-color:rgba(${color_transform
                        .shadeTintColor(color_transform.colorToRGB(value), -20)
                        .toString()});}
                    ${
                      values.separator
                    }.btn-check:focus + .${bef}, .${bef}:focus{
                      border-color:rgba(${color_transform
                        .shadeTintColor(color_transform.colorToRGB(value), -20)
                        .toString()});}
                    ${
                      values.separator
                    }.btn-check:checked + .${bef}, .btn-check:active + .${bef}, .${bef}:active, .${bef}.active, .show > .${bef}.dropdown-toggle{
                      border-color:rgba(${color_transform
                        .shadeTintColor(color_transform.colorToRGB(value), -25)
                        .toString()});
                    box-shadow: 0 0 0 0.25rem
                    rgba(${color_transform
                      .shadeTintColor(color_transform.colorToRGB(value), 3)
                      .toString()}, 0.5)
                    ;}
                    ${
                      values.separator
                    }.btn-check:checked + .btn-check:focus, .btn-check:active + .${bef}:focus, .${bef}:active:focus, .${bef}.active:focus, .show > .${bef}.dropdown-toggle:focus{
                      box-shadow: 0 0 0 0.25rem
                      rgba(${color_transform
                        .shadeTintColor(color_transform.colorToRGB(value), 3)
                        .toString()}, 0.5)
                    ;}`;
            break;
          default:
            befStringed += `${specify}{${css_camel.camelToCSSValid(
              selector
            )}:${value};}`;
            break;
        }
        if (!!values.importantActive) {
          for (let cssProperty of befStringed.split(';')) {
            if (!cssProperty.includes('!important') && cssProperty.length > 5) {
              befStringed = befStringed.replace(
                cssProperty,
                cssProperty + ' !important'
              );
            }
          }
        }
        if (befStringed.includes('{') && befStringed.includes('}')) {
          if (hasBP === true) {
            befStringed = befStringed.replace(
              new RegExp(values.separator, 'g'),
              ''
            );
            bpsStringed = bpsStringed.map((b) => {
              if (befSplited[2] === b.bp) {
                b.bef += befStringed;
              }
              return b;
            });
          } else {
            befsStringed += befStringed + values.separator;
          }
        }
      }
      if (befsStringed !== '') {
        console_log.consoleLog(
          'info',
          { befsStringed: befsStringed },
          values.styleConsole
        );
        for (let bef of befsStringed.split(values.separator)) {
          if (bef !== '') {
            manage_CSSRules.createCSSRules(bef);
          }
        }
      }
      bpsStringed = bpsStringed
        .sort((b1, b2) => {
          return (
            parseInt(b1.value.replace('px', '')) -
            parseInt(b2.value.replace('px', ''))
          );
        })
        .reverse();
      bpsStringed.forEach((b, i) => {
        if (b.bef !== '') {
          console_log.consoleLog(
            'info',
            { bp: b.bp, value: b.value, bef: b.bef },
            values.styleConsole
          );
          manage_CSSRules.createCSSRules(
            `@media only screen and (min-width: ${b.value}) { html body ${b.bef}}`
          );
          /*
          ${
              bpsStringed.length > 1 && i !== 0
                ? `and (max-width: ${bpsStringed[i - 1].value})`
                : ''
            }
          */
          manage_CSSRules.createCSSRules(
            `@media only screen and (min-width: ${b.value}) ${
              bpsStringed.length > 1 && i !== 0
                ? `and (max-width: ${bpsStringed[i - 1].value})`
                : ''
            } { #bef-bp ${b.bef}}`
          );
          b.bef = '';
        }
      });
      const endTimeCSSCreate = performance.now();
      console_log.consoleLog(
        'info',
        `Call to cssCreate() took ${
          endTimeCSSCreate - startTimeCSSCreate
        } milliseconds`,
        values.styleConsole
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
      console_log.consoleLog('error', { err: err }, values.styleConsole);
    }
  },
  /* private */ removePseudos(thing: string, remove: boolean = false): string {
    console_log.consoleLog('info', { thing_beforeRemovePseudos: thing });
    let pseudoFiltereds: IPseudo[] = values.pseudos.filter(
      (pseudo: IPseudo) => {
        return thing.includes(pseudo.mask);
      }
    );
    pseudoFiltereds.forEach((pse: IPseudo) => {
      let regMask = new RegExp(':*' + pse.mask, 'gi');
      switch (true) {
        case values.pseudosHasSDED.includes(pse.mask):
          regMask = new RegExp(':*' + pse.mask + '\\' + '(', 'gi');
          break;
        case ['Right', 'Left'].includes(pse.mask):
          regMask = new RegExp('page' + pse.mask, 'gi');
          break;
        default:
          break;
      }
      thing = thing
        .replace('SD', '(')
        .replace('ED', ')')
        .replace(
          regMask,
          !remove
            ? values.pseudosHasSDED.includes(pse.mask)
              ? pse.real + '('
              : ['Right', 'Left'].includes(pse.mask)
              ? 'page' + pse.real
              : pse.real
            : ''
        );
    });
    console_log.consoleLog('info', { thing_afterRemovePseudos: thing });
    return thing;
  },
};
