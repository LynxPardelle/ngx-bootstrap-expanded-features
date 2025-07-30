/* Singletons */
import { ValuesSingleton } from '../singletons/valuesSingleton';
/* Funtions */
import { console_log } from './console_log';
import { manage_sheet } from './manage_sheet';
import { doCssCreate } from './main/doCssCreate';
import { doUseTimer } from './private/doUseTimer';
import { doUseRecurrentStrategy } from './private/doUseRecurrentStrategy';
import { css_camel } from './css-camel';
import { manage_colors } from './manage_colors';
/* Types */
import { TLogPartsOptions } from '../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('cssCreate', t, p);
};
export const cssCreate = {
  cssCreate(
    updateClasses2Create: string[] | null = null,
    primordial: boolean = false
  ): void {
    try {
      if (!values.pseudos[0]) {
        values.pseudos = values.pseudoClasses
          .sort((e1: number | string, e2: number | string) => {
            e1 = e1.toString().length;
            e2 = e2.toString().length;
            return e1 > e2 ? 1 : e1 < e2 ? -1 : 0;
          })
          .map((pse: string) => {
            return {
              mask: pse,
              real: `${values.separator}:${css_camel.camelToCSSValid(pse)}`,
            };
          })
          .concat(
            values.pseudoElements
              .sort((e1: number | string, e2: number | string) => {
                e1 = e1.toString().length;
                e2 = e2.toString().length;
                return e1 > e2 ? 1 : e1 < e2 ? -1 : 0;
              })
              .map((pse: string) => {
                return {
                  mask: pse,
                  real: `${values.separator}::${css_camel.camelToCSSValid(
                    pse
                  )}`,
                };
              })
          );
      }
      if (!values.sheet) {
        log('Checking if sheet exists', 'manage_sheets');
        manage_sheet.checkSheet();
        if (!values.sheet) {
          throw new Error(
            `There is no ${values.styleSheetToManage} style sheet!`
          );
        }
        log('Sheet exists', 'manage_sheets');
      }
      if (!values.colorsRegex) {
        values.colorsRegex = manage_colors.getColorsRegex();
      }
      log('cssCreate');
      if (!!values.useTimer) {
        doUseTimer(
          primordial,
          true,
          (updateClasses2Create as string[]) || undefined
        );
      } else if (!!values.useRecurrentStrategy) {
        doUseRecurrentStrategy(
          primordial,
          false,
          (updateClasses2Create as string[]) || undefined
        );
      } else {
        log('Using direct cssCreate');
        doCssCreate((updateClasses2Create as string[]) || undefined);
      }
    } catch (err) {
      console_log.consoleLog('error', { err: err });
    }
  },
};
