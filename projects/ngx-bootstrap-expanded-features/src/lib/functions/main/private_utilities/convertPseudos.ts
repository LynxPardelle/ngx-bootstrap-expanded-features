import { IPseudo } from '../../../interfaces';
import { ValuesSingleton } from '../../../singletons/valuesSingleton';
import { console_log } from '../../console_log';
/* Cache Management */
import { 
  cacheManager, 
  checkAndHandleValuesChange 
} from '../../cache_solutions';
/* Types */
import { TLogPartsOptions } from '../../../types';

// Cache for performance optimization - now managed by centralized cache system
const cache = cacheManager.getContainer();
let cachedPseudoData: {
  pseudosHasSDEDSet: Set<string>;
  pageSpecificSet: Set<string>;
  lastValuesInstance: ValuesSingleton | null;
} = {
  pseudosHasSDEDSet: new Set(),
  pageSpecificSet: new Set(['Right', 'Left']),
  lastValuesInstance: null
};

const values = ValuesSingleton.getInstance();

// Check for ValuesSingleton instance changes and handle cache invalidation
checkAndHandleValuesChange(values);

// Initialize cache if values instance changed
if (cachedPseudoData.lastValuesInstance !== values) {
  cachedPseudoData.pseudosHasSDEDSet = new Set(values.pseudosHasSDED);
  cache.regexCache.clear();
  cachedPseudoData.lastValuesInstance = values;
}

const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('convertPseudos', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('convertPseudos', toLog);
};
/**
 * Converts pseudo-class masks in a string to their real counterparts or removes them entirely.
 *
 * This function processes a string containing pseudo-class masks and either converts them to
 * their actual pseudo-class selectors or removes them based on the remove parameter.
 * It handles special cases for pseudo-classes with parameters (SDED format) and page-specific
 * pseudo-classes (Right/Left).
 *
 * @param thing - The input string containing pseudo-class masks to be converted
 * @param remove - Optional flag to determine whether to remove pseudo-classes instead of converting them. Defaults to false
 *
 * @returns The processed string with pseudo-class masks either converted to real pseudo-classes or removed
 *
 * @example
 * ```typescript
 * // Convert pseudo-class masks to real pseudo-classes
 * const result = convertPseudos("bgHover", false): "bgþµÞ:hover"
 *
 * // Remove pseudo-class masks entirely
 * const cleaned = convertPseudos("bgHover", true): "bg"
 * ```
 */
export const convertPseudos = (
  thing: string,
  remove: boolean = false
): string => {
  multiLog([
    [thing, 'thing'],
    [remove, 'remove'],
  ]);

  // Find matching pseudos efficiently
  const pseudoFiltereds: IPseudo[] = [];
  for (const pseudo of values.pseudos) {
    if (thing.includes(pseudo.mask)) {
      pseudoFiltereds.push(pseudo);
    }
  }

  log(pseudoFiltereds, 'pseudoFiltereds');

  // Early exit if no pseudos found
  if (pseudoFiltereds.length === 0) {
    return thing;
  }

  // Batch SD/ED replacements once
  let result = thing.replace(/SD/g, '(').replace(/ED/g, ')');

  // Process each matching pseudo
  for (const pse of pseudoFiltereds) {
    // Get or create cached regex
    let regexKey = pse.mask;
    let replacement = '';

    if (cachedPseudoData.pseudosHasSDEDSet.has(pse.mask)) {
      regexKey = `${pse.mask}_SDED`;
      if (!cache.regexCache.has(regexKey)) {
        cache.regexCache.set(regexKey, new RegExp(':*' + pse.mask + '\\(', 'gi'));
      }
      replacement = remove ? '' : pse.real + '(';
    } else if (cachedPseudoData.pageSpecificSet.has(pse.mask)) {
      regexKey = `${pse.mask}_PAGE`;
      if (!cache.regexCache.has(regexKey)) {
        cache.regexCache.set(regexKey, new RegExp('page' + pse.mask, 'gi'));
      }
      replacement = remove ? '' : 'page' + pse.real;
    } else {
      if (!cache.regexCache.has(regexKey)) {
        cache.regexCache.set(regexKey, new RegExp(':*' + pse.mask, 'gi'));
      }
      replacement = remove ? '' : pse.real;
    }

    // Apply the replacement
    const regex = cache.regexCache.get(regexKey)!;
    result = result.replace(regex, replacement);
  }

  log(result, 'thing After convertPseudos');
  return result;
};
