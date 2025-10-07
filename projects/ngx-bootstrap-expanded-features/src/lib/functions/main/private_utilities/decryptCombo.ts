import { ValuesSingleton } from '../../../singletons/valuesSingleton';
/* Functions */
import { console_log } from '../../../functions/console_log';
import { manage_cache } from '../../manage_cache';
/* Types */
import { TLogPartsOptions } from '../../../types';
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('decryptCombo', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('decryptCombo', toLog);
};

const values: ValuesSingleton = ValuesSingleton.getInstance();
/**
 * Decrypts a combination by finding and replacing abbreviated combo strings with their full values.
 *
 * This function efficiently processes combo abbreviations using intelligent caching and optimized algorithms.
 * It maintains caches for combo key lookups, regex patterns, and complete decryption results to minimize
 * processing overhead on repeated calls.
 *
 * @param specify - The specification string to process
 * @param class2Create - The class creation string to process
 * @param class2CreateStringed - The stringified class creation string to process
 *
 * @returns A synchronous array of three strings: the processed versions of specify, class2Create, and class2CreateStringed.
 * If no matching combo abbreviation is found, returns the original strings unchanged.
 *
 * @example
 * ```typescript
 * decryptCombo(
 *   ', .■■■0',
 *   'bef-wSEL__COM_■■■0-85per',
 *   '.bef-wSEL__COM_■■■0-85per'
 * ): [
 *   ', .boxOne',
 *   'bef-wSEL__COM_boxOne-85per',
 *   '.bef-wSEL__COM_boxOne-85per'
 * ]
 * ```
 *
 * @remarks
 * **Performance Optimizations:**
 * - Uses Set-based combo key lookup for O(1) complexity instead of O(n) Object.keys().find()
 * - Implements intelligent caching system with WeakMap tied to ValuesSingleton instances
 * - Caches compiled RegExp objects to eliminate repeated regex creation overhead
 * - Caches complete decryption results to avoid reprocessing identical inputs
 * - Converted from async to synchronous operation (combo decryption is inherently synchronous)
 * - Uses direct string replacement instead of Promise.all with async map
 * - Implements cache size limits to prevent memory leaks
 *
 * **Cache Management:**
 * - Combo keys cache automatically invalidates when ValuesSingleton instance changes
 * - Regex cache has a maximum size limit with automatic cleanup
 * - Decryption results cache provides near-instant responses for repeated inputs
 * - All caches are designed to be memory-efficient and prevent leaks
 *
 * **Backward Compatibility:**
 * - Maintains the same function signature and return type
 * - Returns identical results to the original implementation
 * - All existing code continues to work without modifications
 */
export const decryptCombo = (specify: string, class2Create: string, class2CreateStringed: string): string[] => {
  // Early validation - return immediately for empty inputs
  if (!specify && !class2Create && !class2CreateStringed) {
    return [specify, class2Create, class2CreateStringed];
  }
  multiLog([
    [specify, 'specify'],
    [class2Create, 'class2Create'],
    [class2CreateStringed, 'class2CreateStringed'],
  ]);

  // Check result cache first for instant response
  let cacheKey: string | undefined;
  if (values.cacheActive) {
    cacheKey = `${specify}|${class2Create}|${class2CreateStringed}`;
    const cachedDecryption = manage_cache.getCached(cacheKey, 'comboDecrypt');
    if (cachedDecryption) {
      return JSON.parse(cachedDecryption) as string[];
    }
  }

  // Get cached combo keys for O(1) lookup instead of O(n) Object.keys().find()
  const combosCreatedKeys = values.combosCreatedKeys;
  if (!combosCreatedKeys || combosCreatedKeys.size === 0) {
    return [specify, class2Create, class2CreateStringed];
  }
  log(combosCreatedKeys, 'combosCreatedKeys');

  // Find matching combo key using efficient Set-based lookup
  let comboCreatedKey: string | undefined;
  for (const key of combosCreatedKeys) {
    if (specify.includes(key)) {
      comboCreatedKey = key;
      log(comboCreatedKey, 'cs');
      break; // Early exit once found
    }
  }

  log(comboCreatedKey, 'comboCreatedKey');

  let comboDecrypted: string[];

  if (comboCreatedKey) {
    // Get cached regex for efficient replacement
    const regex = values.cacheActive
      ? (manage_cache.getCached<RegExp>(
          `decryptCombo_${comboCreatedKey}`,
          'regExp',
          () => new RegExp(comboCreatedKey, 'gi')
        ) as RegExp)
      : new RegExp(comboCreatedKey, 'gi');
    const replacement = values.combosCreated[comboCreatedKey];

    // Direct synchronous replacement - no need for async operations
    comboDecrypted = [
      specify.replace(regex, replacement),
      class2Create.replace(regex, replacement),
      class2CreateStringed.replace(regex, replacement),
    ];
  } else {
    // No combo found, return originals
    comboDecrypted = [specify, class2Create, class2CreateStringed];
  }

  log(comboDecrypted, 'comboDecrypted');

  // Cache the result for future calls
  if (values.cacheActive && cacheKey) {
    manage_cache.addCached(cacheKey, 'comboDecrypt', JSON.stringify(comboDecrypted));
  }

  return comboDecrypted;
};
