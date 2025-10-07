/* Singletons */
import { ValuesSingleton } from '../singletons/valuesSingleton';
/* Funtions */
import { console_log } from './console_log';
import { createMediaRule } from './private/createMediaRule';
import { createSimpleRule } from './private/createSimpleRule';
/* Types */
import { TLogPartsOptions } from '../types';

const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('manageCSSRules', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('manageCSSRules', toLog);
};
export const manage_CSSRules = {
  createCSSRules(rules: string | string[], dontSplitted: boolean = false): void {
    multiLog([
      [rules, 'rules'],
      [dontSplitted, 'dontSplitted'],
    ]);
    try {
      if (!!dontSplitted && !Array.isArray(rules)) {
        for (let rule of rules.split(values.separator)) {
          if (rule !== '') {
            manage_CSSRules.createCSSRule(rule);
          }
        }
      } else if (Array.isArray(rules)) {
        rules.forEach(rule => {
          manage_CSSRules.createCSSRule(rule);
        });
      } else {
        manage_CSSRules.createCSSRule(rules);
      }
    } catch (err: any) {
      console_log.consoleLog('error', { err: err });
    }
  },
  createCSSRule(rule: string): void {
    log(rule, 'rule');
    try {
      if (rule && !rule.startsWith('@media')) {
        createSimpleRule(rule);
      } else {
        createMediaRule(rule);
      }
      log(values.sheet, 'sheet');
    } catch (err: any) {
      console_log.consoleLog('error', { err: err });
    }
  },
};
