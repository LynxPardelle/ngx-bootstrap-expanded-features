import { ValuesSingleton } from '../../../singletons/valuesSingleton';
/* Funtions */
import { console_log } from '../../console_log';
import { manage_cache } from '../../manage_cache';
import { comboParser } from './comboParser';
/* Types */
import { TLogPartsOptions } from '../../../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('getNewClasses2Create', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('getNewClasses2Create', toLog);
};
export const getNewClasses2Create = (): string[] => {
  multiLog([
    [values.combos, 'combos'],
    [values.indicatorClass, 'indicatorClass'],
    [values.abreviationsClasses, 'abreviationsClasses'],
    [values.alreadyCreatedClasses, 'alreadyCreatedClasses'],
  ]);

  // Create a lightweight cache key based on the current state
  const allElementsWithClassAtribute: NodeListOf<HTMLElement> = document.querySelectorAll('[class]');
  let cacheKey: string | undefined;
  if (values.cacheActive) {
    cacheKey = `${values.indicatorClass}_${values.combosKeys.size}_${values.abreviationsClassesKeys.size}_${
      values.abreviationsValuesKeys.size
    }_${values.alreadyCreatedClasses.size}_${allElementsWithClassAtribute.length}_${Math.floor(Date.now() / 1000)}`;

    // Try to get cached result first
    const cachedResult = manage_cache.getCached<string[]>(cacheKey, 'getNewClasses2Create');

    if (cachedResult !== null && cachedResult !== undefined) {
      log(cachedResult, 'cached classes2Create');
      return cachedResult;
    }
  }

  const classes2Create: Set<string> = new Set();
  // Get all HTMLElements
  for (let i = 0; i < allElementsWithClassAtribute.length; i++) {
    const value = allElementsWithClassAtribute[i] as HTMLElement;
    for (const item of allElementsWithClassAtribute[i].classList) {
      let comb: string | undefined;
      for (const cs of values.combosKeys) {
        if (item.includes(cs)) {
          comb = cs;
          break;
        }
      }
      if (!!comb && values.combos[comb]) {
        comboParser(item, comb, allElementsWithClassAtribute[i]).forEach((c: string) => {
          if (!classes2Create.has(c) && !values.alreadyCreatedClasses.has(c)) {
            classes2Create.add(c);
          }
        });
      } else if (
        !comb &&
        !classes2Create.has(item) &&
        !values.alreadyCreatedClasses.has(item) &&
        item !== values.indicatorClass &&
        (item.startsWith(values.indicatorClass) || values.abreviationsClassesKeys.has(item.split('-')[0]))
      ) {
        classes2Create.add(item);
      }
    }
  }
  const result = Array.from(classes2Create);
  log(result, 'classes2Create');

  // Cache the final result
  if (values.cacheActive && cacheKey) {
    manage_cache.addCached(cacheKey, 'getNewClasses2Create', result);
  }

  return result;
};
