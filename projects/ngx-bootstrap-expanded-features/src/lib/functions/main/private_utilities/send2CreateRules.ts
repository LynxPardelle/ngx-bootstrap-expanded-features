import { ValuesSingleton } from '../../../singletons/valuesSingleton';
/* Interfaces */
import { IBPS } from '../../../interfaces';
/* Functions */
import { console_log } from '../../console_log';
import { manage_CSSRules } from '../../manage_CSSRules';
/* Types */
import { TLogPartsOptions } from '../../../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('send2CreateRules', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('send2CreateRules', toLog);
};

export const send2CreateRules = async (classes2CreateStringed: string, bpsStringed: IBPS[]): Promise<void> => {
  multiLog([
    [classes2CreateStringed, 'classes2CreateStringed'],
    [bpsStringed, 'bpsStringed'],
  ]);
  bpsStringed = bpsStringed
    .sort((b1, b2) => {
      return parseInt(b1.value.replace('px', '')) - parseInt(b2.value.replace('px', ''));
    })
    .reverse();
  let responsiveClasses2CreateStringed: string = '';
  for (const [i, b] of bpsStringed.entries()) {
    if (b.class2Create !== '') {
      multiLog([
        [b.bp, 'bp'],
        [b.value, 'value'],
        [b.class2Create, 'class2Create'],
      ]);

      for (const specifyOption of values.bpsSpecifyOptions) {
        responsiveClasses2CreateStringed += `@media only screen and (min-width: ${b.value})${
          values.limitBPS
            ? bpsStringed.length > 1 && i !== 0
              ? `and (max-width: ${bpsStringed[i - 1].value})`
              : ''
            : ''
        } { ${specifyOption} ${b.class2Create}}${values.separator}`;
      }
      b.class2Create = '';
    }
  }
  if (classes2CreateStringed !== '') {
    log(classes2CreateStringed, 'classes2CreateStringed');

    for (const class2Create of classes2CreateStringed.split(values.separator)) {
      if (class2Create !== '') {
        await manage_CSSRules.createCSSRules(class2Create);
      }
    }
  }
  if (responsiveClasses2CreateStringed !== '') {
    log(responsiveClasses2CreateStringed, 'responsiveClasses2CreateStringed');

    for (const class2Create of responsiveClasses2CreateStringed.split(values.separator)) {
      if (class2Create !== '') {
        await manage_CSSRules.createCSSRules(class2Create);
      }
    }
  }
};
