import { ValuesSingleton } from '../../../singletons/valuesSingleton';
/* Funtions */
import { comboParser } from './comboParser';
import { console_log } from '../../console_log';
import { manage_cache } from '../../manage_cache';
/* Types */
import { TLogPartsOptions } from '../../../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('getNewClasses2Create', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('getNewClasses2Create', toLog);
};
export const getNewClasses2Create = async (): Promise<string[]> => {
  multiLog([
    [values.combos, 'combos'],
    [values.indicatorClass, 'indicatorClass'],
    [values.abreviationsClasses, 'abreviationsClasses'],
    [values.alreadyCreatedClasses, 'alreadyCreatedClasses'],
  ]);

  // Create a lightweight cache key based on the current state
  const allElementsWithClassAtribute: NodeListOf<HTMLElement> = document.querySelectorAll('[class]');
  const totalElements = allElementsWithClassAtribute.length;
  const configHash = `${Array.from(values.combosKeys).length}_${values.indicatorClass}_${Array.from(values.abreviationsClassesKeys).length}_${Array.from(values.alreadyCreatedClasses).length}`;
  const cacheKey = `${configHash}_${totalElements}_${Math.floor(Date.now() / 1000)}`;

  // Try to get cached result first
  const cachedResult = manage_cache.getCached<string[]>(
    cacheKey,
    'getNewClasses2Create'
  );

  if (cachedResult !== null && cachedResult !== undefined) {
    log(cachedResult, 'cached classes2Create');
    return cachedResult;
  }

  const classes2Create: Set<string> = new Set();

  // Optimize DOM traversal with early exit conditions
  const elementsToProcess = Array.from(allElementsWithClassAtribute);
  
  // Pre-compute frequently used values
  const combosKeysArray = Array.from(values.combosKeys);
  const abreviationsClassesKeysSet = values.abreviationsClassesKeys;
  const alreadyCreatedClassesSet = values.alreadyCreatedClasses;
  const indicatorClass = values.indicatorClass;

  // Process elements in batches to avoid blocking the main thread
  const batchSize = 50;
  for (let batchStart = 0; batchStart < elementsToProcess.length; batchStart += batchSize) {
    const batch = elementsToProcess.slice(batchStart, batchStart + batchSize);
    
    await Promise.all(
      batch.map(async (element) => {
        const classList = Array.from(element.classList);
        
        for (const item of classList) {
          // Skip if already processed
          if (classes2Create.has(item) || alreadyCreatedClassesSet.has(item) || item === indicatorClass) {
            continue;
          }

          // Find combo match with optimized search
          let comb: string | undefined;
          for (const cs of combosKeysArray) {
            if (item.startsWith(cs)) {
              comb = cs;
              break;
            }
          }

          if (comb && values.combos[comb]) {
            // Cache combo parsing results
            const comboKey = `${item}_${comb}_${element.tagName}`;
            const cachedComboResult = manage_cache.getCached<string[]>(
              comboKey,
              'comboParser'
            );

            let comboClasses: string[];
            if (cachedComboResult) {
              comboClasses = cachedComboResult;
            } else {
              comboClasses = await comboParser(item, comb, element);
              manage_cache.addCached(comboKey, 'comboParser', comboClasses);
            }

            comboClasses.forEach((c: string) => {
              if (!classes2Create.has(c) && !alreadyCreatedClassesSet.has(c)) {
                classes2Create.add(c);
              }
            });
          } else if (
            !comb &&
            (item.startsWith(indicatorClass) ||
              abreviationsClassesKeysSet.has(item.split('-')[0]))
          ) {
            classes2Create.add(item);
          }
        }
      })
    );

    // Allow other tasks to run between batches
    if (batchStart + batchSize < elementsToProcess.length) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  const result = Array.from(classes2Create);
  log(result, 'classes2Create');

  // Cache the final result
  manage_cache.addCached(cacheKey, 'getNewClasses2Create', result);

  return result;
};
