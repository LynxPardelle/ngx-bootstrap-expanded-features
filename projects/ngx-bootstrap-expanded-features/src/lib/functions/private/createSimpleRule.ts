/* Singletons */
import { ValuesSingleton } from '../../singletons/valuesSingleton';
/* Funtions */
import { console_log } from '../console_log';
/* Types */
import { TLogPartsOptions } from '../../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('createSimpleRule', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('createSimpleRule', toLog);
};
export const createSimpleRule = (rule: string): void => {
  log(rule, 'rule');
  if (!values.sheet) return;
  let originalMediaRules: boolean = false;
  let rulesParsed: string[] = rule
    .replace(/{/g, values.separator)
    .replace(/}/g, values.separator)
    .split(values.separator)
    .filter(r => r !== '')
    .map(r => {
      return r.replace(/\n/g, '').replace(/\s{2}/g, '');
    });
  let mediaRule: string = rulesParsed[0].includes('media') ? rulesParsed[0] : '';
  if (mediaRule !== '') {
    if (mediaRule.endsWith(' ')) {
      mediaRule = mediaRule.slice(0, -1);
    }
    rulesParsed.shift();
    [...values.sheet.cssRules].forEach((css: CSSRule | CSSGroupingRule) => {
      if (css.cssText.includes(mediaRule) && css instanceof CSSGroupingRule && css.cssRules) {
        originalMediaRules = true;
        let i = 0;
        while (i <= rulesParsed.length) {
          let index: number = 0;
          let posibleRule: any = [...css.cssRules].some((cssRule: any, ix: number) => {
            if (cssRule.cssText.includes(rulesParsed[i])) {
              index = ix;
              return true;
            } else {
              return false;
            }
          })
            ? [...css.cssRules].find((cs, i) =>
                cs.cssText.split(' ').find((aC: string) => {
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
          let newRule: string = `${rulesParsed[i]}{${rulesParsed[i + 1]}}`;
          log(newRule, 'newRule');
          css.insertRule(newRule, css.cssRules.length);
          i = i + 2;
        }
      }
    });
  }
  if (originalMediaRules === false) {
    log(rule, 'rule');
    values.sheet.insertRule(rule, values.sheet.cssRules.length);
  }
};
