/* Singletons */
import { ValuesSingleton } from '../singletons/valuesSingleton';
/* Funtions */
import { console_log } from './console_log';
/* Types */
import { TCacheOptions, TCacheOptionsPromised, TLogPartsOptions } from '../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('manageColors', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('manageColors', toLog);
};
export const manage_cache = {
  getCached: <T = string>(cacheKey: string, cache: TCacheOptions, callBack?: () => T): T | undefined => {
    const cacheContainer: Map<string, T> = values[`${cache}Cache`] as Map<string, T>;
    let result: T | undefined = cacheContainer.get(cacheKey);
    if (result === undefined && callBack !== undefined) {
      result = callBack();
      manage_cache.addCached<T>(cacheKey, cache, result);
    }
    return result;
  },

  getCachedPromised: async <T = string>(
    cacheKey: string,
    cache: TCacheOptionsPromised,
    callBack: () => Promise<T>
  ): Promise<T> => {
    const cacheContainer: Map<string, T> = values[`${cache}Cache`] as Map<string, T>;
    let result: T | undefined = cacheContainer.get(cacheKey);
    if (result === undefined) {
      result = await callBack();
      manage_cache.addCached<T>(cacheKey, cache, result);
    }
    return result;
  },

  addCached: <T>(cacheKey: string, cache: TCacheOptionsPromised | TCacheOptions, result: T): void => {
    const cacheContainer: Map<string, T> = values[`${cache}Cache`] as Map<string, T>;
    if (cacheContainer.size >= values.cacheSize) {
      manage_cache.deleteCached(cache, args => {
        if (args.index && args.index < Math.floor(values.cacheSize / 4)) {
          return { add2Remove: true, last: false };
        }
        return { add2Remove: false, last: true };
      });
    }
    cacheContainer.set(cacheKey, result);
  },
  deleteCached: <T>(
    cache: TCacheOptionsPromised | TCacheOptions,
    cb: (args: { key?: string; index?: number; element?: T }) =>
      | {
          add2Remove?: boolean;
          last?: boolean;
        }
      | undefined
  ): void => {
    const cacheContainer: Map<string, T> = values[`${cache}Cache`] as Map<string, T>;
    const keysToDelete: string[] = [];
    const cacheContainerKeys: string[] = Array.from(cacheContainer.keys());
    for (let i = 0; i < cacheContainerKeys.length; i++) {
      const containerKey: string = cacheContainerKeys[i];
      const cacheElement = cacheContainer.get(containerKey) as T;
      const { add2Remove, last } =
        cb({
          key: containerKey,
          index: i,
          element: cacheElement,
        }) || {};
      if (add2Remove) {
        keysToDelete.push(containerKey);
      }
      if (last) {
        break;
      }
    }
    keysToDelete.forEach(key => cacheContainer.delete(key));
  },
  clearCached: (cache: TCacheOptions | TCacheOptionsPromised): void => {
    values[`${cache}Cache`].clear();
  },
  clearAllNoneEssential: (): void => {
    const noEssential: (TCacheOptions | TCacheOptionsPromised)[] = [
      'propertyJoiner',
      'buttonShade',
      'camel',
      'buttonCss',
      'cssValid',
      'colorTransform',
      'comboDecrypt',
      'buttonCorrection',
      'parseClass',
      'getNewClasses2Create',
      'comboParser',
      'values4ComboGetter',
    ];
    for (const key of noEssential) {
      manage_cache.clearCached(key);
    }
  },
};
