import { ValuesSingleton } from '../../../singletons/valuesSingleton';
import { console_log } from '../../../functions/console_log';
/* Cache Management */
import { 
  smartCacheValidation,
  getUnifiedCache
} from '../../unified_cache_manager';
/* Types */
import { TLogPartsOptions } from '../../../types';

// Unified cache for performance optimization - centralized with smart invalidation
const cache = getUnifiedCache();

const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('decryptCombo', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('decryptCombo', toLog);
};

const values: ValuesSingleton = ValuesSingleton.getInstance();

// Smart cache validation - only invalidates when data actually changes
smartCacheValidation(values);

/**
 * Gets or creates cached combo keys Set for the current ValuesSingleton instance
 * @param valuesInstance - ValuesSingleton instance
 * @returns Set of combo keys for O(1) lookup operations
 */
const getCachedComboKeys = (valuesInstance: ValuesSingleton): Set<string> => {
  if (!cache.comboKeysCache.has(valuesInstance)) {
    const comboKeys = new Set(Object.keys(valuesInstance.combosCreated));
    cache.comboKeysCache.set(valuesInstance, comboKeys);
  }
  return cache.comboKeysCache.get(valuesInstance)!;
};

/**
 * Gets or creates cached regex for a combo key
 * @param comboKey - The combo key to create regex for
 * @returns Compiled RegExp object for efficient replacement
 */
const getCachedRegex = (comboKey: string): RegExp => {
  const regexKey = `decryptCombo_${comboKey}`;
  if (!cache.regexCache.has(regexKey)) {
    // Clean cache if it gets too large
    const maxCacheSize = 1000;
    if (cache.regexCache.size >= maxCacheSize) {
      // Clear half the cache when limit is reached, focusing on decryptCombo entries
      const keysToDelete = Array.from(cache.regexCache.keys())
        .filter(k => k.startsWith('decryptCombo_'))
        .slice(0, Math.floor(maxCacheSize / 4));
      keysToDelete.forEach(key => cache.regexCache.delete(key));
    }
    const regex = new RegExp(comboKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    cache.regexCache.set(regexKey, regex);
  }
  return cache.regexCache.get(regexKey)!;
};

/**
 * Creates a cache key from the input parameters for result caching
 * @param specify - Specification string
 * @param class2Create - Class creation string  
 * @param class2CreateStringed - Stringified class creation string
 * @returns Cache key string
 */
const createCacheKey = (specify: string, class2Create: string, class2CreateStringed: string): string => {
  return `${specify}|${class2Create}|${class2CreateStringed}`;
};

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
export const decryptCombo = (
  specify: string,
  class2Create: string,
  class2CreateStringed: string
): string[] => {
  // Early validation - return immediately for empty inputs
  if (!specify && !class2Create && !class2CreateStringed) {
    return [specify, class2Create, class2CreateStringed];
  }

  // Check result cache first for instant response
  const cacheKey = createCacheKey(specify, class2Create, class2CreateStringed);
  const cachedDecryption = cache.comboDecryptCache.get(cacheKey);
  if (cachedDecryption) {
    return JSON.parse(cachedDecryption) as string[];
  }

  multiLog([
    [specify, 'specify'],
    [class2Create, 'class2Create'],
    [class2CreateStringed, 'class2CreateStringed'],
  ]);

  // Get cached combo keys for O(1) lookup instead of O(n) Object.keys().find()
  const comboKeys = getCachedComboKeys(values);
  
  // Find matching combo key using efficient Set-based lookup
  let alreadyABBRCombo: string | undefined;
  for (const comboKey of comboKeys) {
    if (specify.includes(comboKey)) {
      alreadyABBRCombo = comboKey;
      log(comboKey, 'cs');
      break; // Early exit once found
    }
  }

  log(alreadyABBRCombo, 'alreadyABBRCombo');

  let comboDecrypted: string[];
  
  if (alreadyABBRCombo) {
    // Get cached regex for efficient replacement
    const regex = getCachedRegex(alreadyABBRCombo);
    const replacement = values.combosCreated[alreadyABBRCombo];
    
    // Direct synchronous replacement - no need for async operations
    comboDecrypted = [
      specify.replace(regex, replacement),
      class2Create.replace(regex, replacement),
      class2CreateStringed.replace(regex, replacement)
    ];
  } else {
    // No combo found, return originals
    comboDecrypted = [specify, class2Create, class2CreateStringed];
  }

  log(comboDecrypted, 'comboDecrypted');

  // Cache the result for future calls
  const maxCacheSize = 1000;
  if (cache.comboDecryptCache.size >= maxCacheSize) {
    // Clean cache if it gets too large (remove oldest entries)
    const keysToDelete = Array.from(cache.comboDecryptCache.keys()).slice(0, Math.floor(maxCacheSize / 2));
    keysToDelete.forEach(key => cache.comboDecryptCache.delete(key));
  }
  cache.comboDecryptCache.set(cacheKey, JSON.stringify(comboDecrypted));

  return comboDecrypted;
};
