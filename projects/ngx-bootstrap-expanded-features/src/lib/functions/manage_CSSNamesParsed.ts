/* Singletons */
import { ValuesSingleton } from '../singletons/valuesSingleton';
/* Funtions */
import { console_log } from './console_log';
import { cssCreate } from './cssCreate';
import { manage_cache } from './manage_cache';
/* Types */
import { TLogPartsOptions } from '../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('manageCSSNamesParsed', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('manageCSSNamesParsed', toLog);
};
export const manage_CSSNamesParsed = {
  pushCssNamesParsed(cssNamesParsed: any): void {
    try {
      Object.keys(cssNamesParsed).forEach(key => {
        values.cssNamesParsed[key] = cssNamesParsed[key];
      });
      if (values.cacheActive) {
        manage_cache.clearAllNoneEssential();
      }
      cssCreate.cssCreate();
    } catch (err) {
      console_log.consoleLog('error', { err: err });
    }
  },
  getCssNamesParsed(): any {
    log(values.cssNamesParsed, 'cssNamesParsed');
    return values.cssNamesParsed;
  },
  updateCssNamesParsed(cssNameParsed: string, value: string): void {
    try {
      if (values.cssNamesParsed[cssNameParsed.toString()]) {
        values.cssNamesParsed[cssNameParsed] = value;
        let classesToUpdate: string[] = [];
        for (let createdClass of values.alreadyCreatedClasses) {
          if (createdClass.includes(cssNameParsed)) {
            classesToUpdate.push(createdClass);
          }
        }
        if (values.cacheActive) {
          manage_cache.clearAllNoneEssential();
        }
        if (classesToUpdate.length > 0) {
          cssCreate.cssCreate(classesToUpdate);
        } else {
          cssCreate.cssCreate();
        }
      } else {
        throw new Error(`There is no cssNameParsed named ${cssNameParsed}.`);
      }
    } catch (err) {
      console_log.consoleLog('error', { err: err });
    }
  },
};
