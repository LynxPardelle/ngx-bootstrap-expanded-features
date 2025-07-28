/* Singletons */
import { ValuesSingleton } from '../../../singletons/valuesSingleton';
/* Interfaces */
import { IBPS } from '../../../interfaces';
/* Functions */
import { abreviation_traductors } from '../../abreviation_traductors';
import { console_log } from '../../../functions/console_log';
import { convertPseudos } from './convertPseudos';
import { look4BPNVals } from './look4BPNVals';
import { valueTraductor } from './valueTraductor';
import { decryptCombo } from './decryptCombo';
import { property2ValueJoiner } from './property2ValueJoiner';
/* Cache Management */
import {
  cacheManager,
  checkAndHandleValuesChange,
} from '../../cache_solutions';
/* Types */
import { TLogPartsOptions } from '../../../types';

/**
 * Cache for complete parseClass results to avoid repeated processing
 * Now managed by centralized cache system
 */
const cache = cacheManager.getContainer();

/**
 * Maximum cache size to prevent memory issues
 */
const MAX_CACHE_SIZE = 1000;
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('parseClass', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('parseClass', toLog);
};

interface IparseClassReturn {
  class2Create: string;
  bpsStringed: IBPS[];
  classes2CreateStringed: string;
}

/**
 * Creates a cache key for parseClass results
 */
const createParseClassCacheKey = (
  class2Create: string,
  bpsStringed: IBPS[],
  classes2CreateStringed: string,
  isClean: boolean
): string => {
  const bpsKey = bpsStringed.map((bp) => `${bp.bp}:${bp.value}`).join('|');
  return `${class2Create}|${bpsKey}|${classes2CreateStringed}|${isClean}`;
};

/**
 * Gets or creates cached Set of already created classes for O(1) lookups
 */
const getCachedCreatedClasses = (values: ValuesSingleton): Set<string> => {
  let createdClasses = cache.createdClassesCache.get(values);
  if (!createdClasses) {
    createdClasses = new Set(values.alreadyCreatedClasses);
    cache.createdClassesCache.set(values, createdClasses);
  }
  return createdClasses;
};

/**
 * Gets or creates cached Map of abbreviations for efficient lookups
 */
const getCachedAbbreviationLookup = (
  values: ValuesSingleton
): Map<string, string> => {
  let abbrevLookup = cache.abbreviationLookupCache.get(values);
  if (!abbrevLookup) {
    abbrevLookup = new Map(Object.entries(values.abreviationsClasses));
    cache.abbreviationLookupCache.set(values, abbrevLookup);
  }
  return abbrevLookup;
};

/**
 * Gets or creates cached Set of combo keys for efficient lookups
 */
const getCachedComboKeys = (values: ValuesSingleton): Set<string> => {
  let comboKeys = cache.comboKeysCache.get(values);
  if (!comboKeys) {
    comboKeys = new Set(Object.keys(values.combosCreated));
    cache.comboKeysCache.set(values, comboKeys);
  }
  return comboKeys;
};

/**
 * Gets cached regex or creates and caches new one
 */
const getCachedRegex = (pattern: string, flags?: string): RegExp => {
  const cacheKey = `${pattern}|${flags || ''}`;
  let regex = cache.regexCache.get(cacheKey);
  if (!regex) {
    if (cache.regexCache.size >= MAX_CACHE_SIZE) {
      cache.regexCache.clear();
    }
    regex = new RegExp(pattern, flags);
    cache.regexCache.set(cacheKey, regex);
  }
  return regex;
};

/**
 * Optimized check for already created CSS classes
 */
const isClassAlreadyCreated = (
  className: string,
  createdClassesSet: Set<string>
): boolean => {
  if (createdClassesSet.has(className)) {
    return true;
  }

  // Optimized CSS rules checking - only if Set check fails
  const cssRules = values.sheet.cssRules;
  const length = cssRules.length;

  for (let i = 0; i < length; i++) {
    const cssText = cssRules[i].cssText;
    if (cssText.includes(`.${className} `)) {
      return true;
    }
  }

  return false;
};

/**
 * Optimized abbreviation finder using cached Map
 */
const findAbbreviation = (
  className: string,
  abbrevMap: Map<string, string>
): [string, string] | null => {
  for (const [abbrev, expansion] of abbrevMap) {
    if (className.includes(abbrev)) {
      return [abbrev, expansion];
    }
  }
  return null;
};

/**
 * Optimized combo key finder using cached Set
 */
const findComboKey = (
  className: string,
  comboKeysSet: Set<string>
): string | undefined => {
  for (const comboKey of comboKeysSet) {
    if (className.includes(comboKey)) {
      return comboKey;
    }
  }
  return undefined;
};

/**
 * Optimized important flag application
 */
const applyImportantFlags = (cssString: string): string => {
  if (!values.importantActive) {
    return cssString;
  }

  const importantRegex = getCachedRegex('\\s?!important\\s?', 'g');

  return cssString
    .split(';')
    .map((cssProperty) => {
      if (cssProperty.length > 5 && !cssProperty.includes('!important')) {
        return cssProperty + ' !important';
      }
      return cssProperty;
    })
    .join(';')
    .replace(importantRegex, ' !important');
};
/**
 * Parses a CSS class string and converts it into valid CSS rules with breakpoint support.
 *
 * This function takes a class name with abbreviated CSS properties and values, processes it through
 * various transformations including abbreviation expansion, pseudo-class conversion, breakpoint handling,
 * and value translation to generate valid CSS rules.
 *
 * @param class2Create - The CSS class name to parse and create (may contain abbreviations)
 * @param bpsStringed - Array of breakpoint objects containing breakpoint information
 * @param classes2CreateStringed - Accumulated string of CSS classes being created
 * @param isClean - Whether to check for already created classes to avoid duplicates (default: true)
 *
 * @returns Promise resolving to an object containing:
 *   - class2Create: The processed class name
 *   - bpsStringed: Updated breakpoint array with new CSS rules
 *   - classes2CreateStringed: Updated accumulated CSS classes string
 *
 * @example
 * ```typescript
 * await parseClass('bef-overflowX-hidden', [], '', true):
 * {
 *   class2Create: 'lib-margin-10',
 *   bpsStringed: [
 *      {
 *        "bp": "sm",
 *        "value": "576px",
 *        "class2Create": ""
 *      },
 *      {
 *        "bp": "md",
 *        "value": "768px",
 *        "class2Create": ""
 *      },
 *      {
 *        "bp": "lg",
 *        "value": "992px",
 *        "class2Create": ""
 *      },
 *      {
 *        "bp": "xl",
 *        "value": "1200px",
 *        "class2Create": ""
 *      },
 *      {
 *        "bp": "xxl",
 *        "value": "1400px",
 *        "class2Create": ""
 *      }
 *   ],
 *   classes2CreateStringed: '.bef-overflowX-hidden{overflow-x:hidden !important;}þµÞ'
 * }
 * ```
 *
 * @remarks
 * - Handles abbreviation expansion (e.g., 'm' to 'margin')
 * - Processes pseudo-classes and combinators
 * - Supports breakpoint-specific styling
 * - Applies important flags when active
 * - Maintains cache of already created classes to prevent duplicates
 * - Supports encrypted combo classes when encryption is enabled
 */
export const parseClass = async (
  class2Create: string,
  bpsStringed: IBPS[],
  classes2CreateStringed: string,
  isClean: boolean = true
): Promise<IparseClassReturn> => {
  // Check for ValuesSingleton instance changes and handle cache invalidation
  checkAndHandleValuesChange(values);

  // Early validation
  if (!class2Create) {
    return {
      class2Create,
      bpsStringed,
      classes2CreateStringed,
    };
  }

  // Check cache first for instant response
  const cacheKey = createParseClassCacheKey(
    class2Create,
    bpsStringed,
    classes2CreateStringed,
    isClean
  );
  const cachedResult = cache.parseClassCache.get(cacheKey);
  if (cachedResult) {
    return {
      class2Create: cachedResult.class2Create,
      bpsStringed: [...cachedResult.bpsStringed], // Deep copy arrays to prevent mutation
      classes2CreateStringed: cachedResult.classes2CreateStringed,
    };
  }

  multiLog([
    [class2Create, 'class2Create'],
    [bpsStringed, 'bpsStringed'],
    [classes2CreateStringed, 'classes2CreateStringed'],
    [isClean, 'isClean'],
  ]);

  // Get cached created classes Set for O(1) lookups
  const createdClassesSet = getCachedCreatedClasses(values);

  // Check if already created CssClass and return if it is
  if (isClean) {
    if (
      values.alreadyCreatedClasses.find((aC: any) => {
        return aC === class2Create;
      }) ||
      [...values.sheet.cssRules].find((i) =>
        i.cssText.split(' ').find((aC: string) => {
          return aC.replace('.', '') === class2Create;
        })
      )
    ) {
      return {
        class2Create: class2Create,
        bpsStringed: bpsStringed,
        classes2CreateStringed: classes2CreateStringed,
      };
    } else {
      values.alreadyCreatedClasses.push(class2Create);
      createdClassesSet.add(class2Create);
    }
  } else {
    values.alreadyCreatedClasses.push(class2Create);
    createdClassesSet.add(class2Create);
  }

  log(values.alreadyCreatedClasses, 'alreadyCreatedClasses');
  // Get the class for the final string from the original class2Create after the conversion of the abreviations
  let class2CreateStringed = '.' + class2Create;
  log(class2CreateStringed, 'class2CreateStringed');
  // De-abreviate the class if it has abreviations
  if (!class2Create.includes(values.indicatorClass)) {
    let abbrClss = Object.keys(values.abreviationsClasses).find((aC) =>
      class2Create.includes(aC)
    );
    if (!!abbrClss) {
      class2Create = class2Create.replace(
        abbrClss,
        values.abreviationsClasses[abbrClss]
      );
    }
  }

  // Split to decompose and interpret the class to create
  let class2CreateSplited = class2Create.split('-');
  log(class2CreateSplited, 'class2CreateSplited');

  // Optimized combo handling
  const comboKeysSet = getCachedComboKeys(values);
  const comboCreatedKey = findComboKey(class2Create, comboKeysSet);
  if (!!comboCreatedKey) {
    let comboKeyReg = new RegExp(comboCreatedKey, 'g');
    class2CreateSplited[1] = class2CreateSplited[1].replace(
      comboKeyReg,
      values.encryptComboCreatedCharacters
    );
  }

  // Convert pseudos and process selectors
  const classWithPseudosConvertedAndSELSplited = convertPseudos(
    class2CreateSplited[1]
  )
    .replace(/SEL/g, values.separator)
    .split(values.separator);

  log(
    classWithPseudosConvertedAndSELSplited,
    'classWithPseudosConvertedAndSELSplited'
  );

  // Declaring the property to create the combinations and use Pseudos
  const property = classWithPseudosConvertedAndSELSplited[0];
  log(property, 'property');

  // Optimized specify generation
  const specifyParts = classWithPseudosConvertedAndSELSplited.slice(1);
  let specify = abreviation_traductors.abreviationTraductor(
    specifyParts.join('')
  );

  // Handle combo key restoration
  if (comboCreatedKey) {
    log(specify, 'comboCreatedKey');
    const comboKeyCypherReg = getCachedRegex(
      values.encryptComboCreatedCharacters,
      'g'
    );
    class2CreateSplited[1] = class2CreateSplited[1].replace(
      comboKeyCypherReg,
      comboCreatedKey
    );
    log(specify, 'specify Pre ComboKeyRestoration');
    specify = specify.replace(comboKeyCypherReg, comboCreatedKey);
    class2Create = class2Create.replace(comboKeyCypherReg, comboCreatedKey);
    class2CreateStringed = class2CreateStringed.replace(
      comboKeyCypherReg,
      comboCreatedKey
    );
    log(specify, 'specify Post ComboKeyRestoration');
  }
  log(specify, 'specify');

  // Decrypt the combo of the class if it has been encrypted with the encryptCombo flag
  if (specify && values.encryptCombo) {
    multiLog([
      [specify, 'specify PreDecryptCombo'],
      [class2Create, 'class2Create PreDecryptCombo'],
      [class2CreateStringed, 'class2CreateStringed PreDecryptCombo'],
    ]);
    [specify, class2Create, class2CreateStringed] = decryptCombo(
      specify,
      class2Create,
      class2CreateStringed
    );
    multiLog([
      [specify, 'specify PostDecryptCombo'],
      [class2Create, 'class2Create PostDecryptCombo'],
      [class2CreateStringed, 'class2CreateStringed PostDecryptCombo'],
    ]);
  }

  // Getting if the class has breakPoints, the value and the second value if it has
  const bpResult = look4BPNVals(class2CreateSplited);
  const [hasBP, propertyValues]: [boolean, string[]] = Object.values(
    bpResult
  ) as [boolean, string[]];

  multiLog([
    [hasBP, 'hasBP'],
    [propertyValues, 'propertyValues'],
  ]);

  // Optimized value translation with parallel processing
  const translatedValues = await Promise.all(
    propertyValues.map(async (pv: string) => {
      return await valueTraductor(pv, property);
    })
  );

  // Ensure at least one value exists
  if (!translatedValues[0]) {
    translatedValues[0] = 'default';
  }

  log(translatedValues, 'propertyValues');

  multiLog([
    [translatedValues, 'propertyValues AfterValueTraductor'],
    [class2CreateSplited, 'class2CreateStringed BeforeProperty2ValueJoiner'],
  ]);

  // Joining the property and the values
  class2CreateStringed += await property2ValueJoiner(
    property,
    class2CreateSplited,
    class2Create,
    translatedValues,
    specify
  );

  log(class2CreateStringed, 'class2CreateStringed AfterProperty2ValueJoiner');

  // Optimized important flag application
  class2CreateStringed = applyImportantFlags(class2CreateStringed);
  log(class2CreateStringed, 'class2CreateStringed AfterImportant');

  // Process breakpoints and final output
  if (
    class2CreateStringed.includes('{') &&
    class2CreateStringed.includes('}')
  ) {
    if (hasBP === true) {
      const separatorRegex = getCachedRegex(values.separator, 'g');
      class2CreateStringed = class2CreateStringed.replace(separatorRegex, '');

      // Optimized breakpoint assignment
      const targetBp = class2CreateSplited[2];
      for (let i = 0; i < bpsStringed.length; i++) {
        if (bpsStringed[i].bp === targetBp) {
          bpsStringed[i].class2Create += class2CreateStringed;
          break;
        }
      }
    } else {
      classes2CreateStringed += class2CreateStringed + values.separator;
    }
  }

  // Final cleanup
  classes2CreateStringed = classes2CreateStringed.replace(/\s+/g, ' ');

  multiLog([
    [class2Create, 'class2Create AfterSeparators'],
    [bpsStringed, 'bpsStringed AfterSeparators'],
    [classes2CreateStringed, 'classes2CreateStringed AfterSeparators'],
  ]);

  const result = {
    class2Create: class2Create,
    bpsStringed: bpsStringed,
    classes2CreateStringed: classes2CreateStringed,
  };

  // Cache the result for future calls
  if (cache.parseClassCache.size >= MAX_CACHE_SIZE) {
    const keysToDelete = Array.from(cache.parseClassCache.keys()).slice(
      0,
      Math.floor(MAX_CACHE_SIZE / 2)
    );
    keysToDelete.forEach((key) => cache.parseClassCache.delete(key));
  }
  cache.parseClassCache.set(cacheKey, {
    class2Create: result.class2Create,
    bpsStringed: [...result.bpsStringed], // Deep copy for cache
    classes2CreateStringed: result.classes2CreateStringed,
  });

  return result;
};
