/* Singletons */
import { ValuesSingleton } from '../singletons/valuesSingleton';
/* Funtions */
import { console_log } from './console_log';
import { cssCreate } from './cssCreate';
/* Types */
import { TLogPartsOptions } from '../types';
import { manage_cache } from './manage_cache';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('manageAbreviations', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('manageAbreviations', toLog);
};
export const manage_abreviations = {
  pushAbreviationsValues(abreviationsValues: { [key: string]: string }): void {
    try {
      let prevIgnoredAbreviationsValues: string[] = [];
      Object.keys(abreviationsValues).forEach(key => {
        values.abreviationsValues[key] = abreviationsValues[key];
        prevIgnoredAbreviationsValues = Array.from(values.alreadyCreatedClasses).filter((aC: any) => {
          return aC.includes(key);
        });
      });
      values.abreviationsValuesKeys = new Set(Object.keys(values.abreviationsValues));
      if (values.cacheActive) {
        manage_cache.clearAllNoneEssential();
      }
      if (prevIgnoredAbreviationsValues.length > 0) {
        cssCreate.cssCreate(prevIgnoredAbreviationsValues);
      } else {
        cssCreate.cssCreate();
      }
    } catch (err) {
      console_log.consoleLog('error', { err: err });
    }
  },
  pushAbreviationsClasses(abreviationsClasses: { [key: string]: string }): void {
    let prevIgnoredAbreviationsValues: string[] = [];
    try {
      Object.keys(abreviationsClasses).forEach(key => {
        values.abreviationsClasses[key] = abreviationsClasses[key];
        prevIgnoredAbreviationsValues = Array.from(values.alreadyCreatedClasses).filter((aC: any) => {
          return aC.includes(key);
        });
      });
      values.abreviationsClassesKeys = new Set(Object.keys(values.abreviationsClasses));
      if (values.cacheActive) {
        manage_cache.clearAllNoneEssential();
      }
      if (prevIgnoredAbreviationsValues.length > 0) {
        cssCreate.cssCreate(prevIgnoredAbreviationsValues);
      } else {
        cssCreate.cssCreate();
      }
    } catch (err) {
      console_log.consoleLog('error', { err: err });
    }
  },
  getAbreviationsClasses(): any {
    log(values.abreviationsClasses, 'abreviationsClasses');
    return values.abreviationsClasses;
  },
  getAbreviationsValues(): any {
    log(values.abreviationsValues, 'abreviationsValues');
    return values.abreviationsValues;
  },
  updateAbreviationsClass(abreviationsClass: string, value: string): void {
    try {
      if (values.abreviationsClasses[abreviationsClass]) {
        values.abreviationsClasses[abreviationsClass] = value;
        let classesToUpdate: string[] = [];
        for (let createdClass of values.alreadyCreatedClasses) {
          if (createdClass.includes(abreviationsClass)) {
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
        throw new Error(`There is no abreviationsClass named ${abreviationsClass}.`);
      }
    } catch (err) {
      console_log.consoleLog('error', { err: err });
    }
  },
  updateAbreviationsValue(abreviationsValue: string, value: string): void {
    try {
      if (values.abreviationsValues[abreviationsValue.toString()]) {
        values.abreviationsValues[abreviationsValue] = value;
        let classesToUpdate: string[] = [];
        for (let createdClass of values.alreadyCreatedClasses) {
          if (createdClass.includes(abreviationsValue)) {
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
        throw new Error(`There is no abreviationsValue named ${abreviationsValue}.`);
      }
    } catch (err) {
      console_log.consoleLog('error', { err: err });
    }
  },
};
