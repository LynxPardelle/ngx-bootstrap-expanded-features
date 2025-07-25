/* Singletons */
import { ValuesSingleton } from '../singletons/valuesSingleton';
/* Funtions */
import { console_log } from './console_log';
import { manage_sheet } from './manage_sheet';
import { doCssCreate } from './main/doCssCreate';
import { doUseTimer } from './private/doUseTimer';
import { doUseRecurrentStrategy } from './private/doUseRecurrentStrategy';
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
      log('cssCreate');
      if (!!values.useTimer) {
        doUseTimer(primordial, true, (updateClasses2Create as string[] || undefined));
      } else if (!!values.useRecurrentStrategy) {
        doUseRecurrentStrategy(primordial, false, (updateClasses2Create as string[] || undefined));
      } else {
        log('Using direct cssCreate');
        doCssCreate((updateClasses2Create as string[] || undefined));
      }
    } catch (err) {
      console_log.consoleLog('error', { err: err });
    }
  },
};
