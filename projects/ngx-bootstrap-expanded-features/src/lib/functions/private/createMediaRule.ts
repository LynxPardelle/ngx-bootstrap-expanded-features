/* Singletons */
import { ValuesSingleton } from '../../singletons/valuesSingleton';
/* Funtions */
import { console_log } from '../console_log';
/* Types */
import { TLogPartsOptions } from '../../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('createMediaRule', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('createMediaRule', toLog);
};
export const createMediaRule = (rule: string): void => {
  log(rule, 'rule');
  let index: number | undefined;
  if (!values.sheet) return;
  let originalRule: any = [...values.sheet.cssRules].some(
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
    ? [...values.sheet.cssRules].find(
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
  if (originalRule && index !== undefined) {
    values.sheet.deleteRule(index);
  }
  log(rule, 'rule');
  values.sheet.insertRule(rule, values.sheet.cssRules.length);
};
