import { ValuesSingleton } from '../../../singletons/valuesSingleton';
/* Functions */
import { console_log } from '../../../functions/console_log';
import { manage_cache } from '../../manage_cache';
import { valueComboReplacer } from './valueComboReplacer';
import { values4ComboGetter } from './values4ComboGetter';
/* Types */
import { TLogPartsOptions } from '../../../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('comboParser', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('comboParser', toLog);
};
export const comboParser = (class2Create: string, comb: string, class2CreateElement: HTMLElement): string[] => {
  // Performance monitoring
  const startTime = performance.now();

  multiLog([
    [class2Create, 'input class2Create'],
    [comb, 'input comb'],
    [class2CreateElement.tagName, 'element tag name'],
    [class2CreateElement.className, 'element class names'],
  ]);

  // Stage 1: Cache Check
  let cacheKey: string | undefined;
  if (values.cacheActive) {
    // Create comprehensive cache key including element context
    cacheKey = `${class2Create}_${comb}_${class2CreateElement.tagName}_${values.encryptCombo}_${values.combosCreatedKeys.size}`;
    const cachedResult = manage_cache.getCached<string[]>(cacheKey, 'comboParser');
    if (cachedResult) {
      const cacheTime = performance.now() - startTime;
      multiLog([
        [true, 'cache hit'],
        [cachedResult, 'cached result returned'],
        [`${cacheTime.toFixed(2)}ms`, 'cache retrieval time'],
      ]);
      return cachedResult;
    }
    log(false, 'cache miss - proceeding with computation');
  }

  // Stage 2: Initial validation and setup
  const comboClasses2Create: string[] = [];
  const comboClassesSet: Set<string> = new Set(); // For O(1) duplicate checking

  // Optimize combo index lookup
  const combosKeysArray = Array.from(values.combosKeys);
  let combIndex = combosKeysArray.indexOf(comb);

  multiLog([
    [combIndex, 'combo index in combos array'],
    [combosKeysArray.length, 'total combos available'],
    [!!values.combos[comb], 'combo exists in values.combos'],
  ]);

  // Stage 3: Get values for combo processing
  let vals: string[] = values4ComboGetter(class2Create);
  multiLog([
    [vals, 'values from values4ComboGetter'],
    [vals.length, 'number of values retrieved'],
  ]);

  // Stage 4: Pre-compute frequently used values for performance
  const indicatorClass = values.indicatorClass;
  const encryptCombo = values.encryptCombo;
  const combosCreatedKeysSet = values.combosCreatedKeys;
  const combosCreated = values.combosCreated;
  const pseudos = values.pseudos;

  // Stage 5: Process each combo template
  const comboTemplates = values.combos[comb];

  if (!comboTemplates || comboTemplates.length === 0) {
    multiLog([
      [false, 'combo templates found'],
      [comboClasses2Create, 'returning empty result'],
    ]);

    if (values.cacheActive && cacheKey) {
      manage_cache.addCached(cacheKey, 'comboParser', comboClasses2Create);
    }
    return comboClasses2Create;
  }

  log(`processing ${comboTemplates.length} combo templates`, 'templates processing');

  comboTemplates.forEach((originalC: string, templateIndex: number) => {
    log(`processing template ${templateIndex + 1}/${comboTemplates.length}: "${originalC}"`, 'template processing');

    // Stage 6: Apply value replacement
    let c = valueComboReplacer(originalC, vals);
    multiLog([
      [originalC, 'original template'],
      [c, 'after value replacement'],
    ]);

    // Stage 7: Handle indicator class processing
    if (c.startsWith(indicatorClass)) {
      log('template starts with indicator class - processing combo abbreviation', 'combo abbreviation stage');

      // Stage 8: Check for existing abbreviation (optimized lookup)
      let alreadyABBRCombo: boolean = false;
      let existingComboKey: string | undefined;

      // Use more efficient lookup
      for (const cs of combosCreatedKeysSet) {
        if (combosCreated[cs] === class2Create) {
          alreadyABBRCombo = true;
          existingComboKey = cs;
          break;
        }
      }

      multiLog([
        [alreadyABBRCombo, 'abbreviation already exists'],
        [existingComboKey, 'existing combo key'],
        [combosCreatedKeysSet.size, 'total combo keys created'],
      ]);

      // Stage 9: Generate or retrieve combo key
      const combCreatedKey: string = existingComboKey || values.encryptComboCharacters + combosCreatedKeysSet.size;

      log(combCreatedKey, 'combo created key to use');

      // Stage 10: Create new abbreviation if needed
      if (!alreadyABBRCombo) {
        const keyToStore = encryptCombo ? combCreatedKey : class2Create;
        combosCreated[keyToStore] = class2Create;
        combosCreatedKeysSet.add(combCreatedKey);

        multiLog([
          [keyToStore, 'stored combo key'],
          [class2Create, 'stored combo value'],
          [combosCreatedKeysSet.size, 'updated combo keys count'],
        ]);
      }

      // Stage 11: Determine final abbreviation
      const comboABBR: string = encryptCombo ? combCreatedKey : class2Create;

      multiLog([
        [comboABBR, 'final combo abbreviation'],
        [c, 'class before pseudo processing'],
      ]);

      // Stage 12: Process pseudos with optimized filtering
      const cSplit = c.split('-');
      if (cSplit.length > 1) {
        const relevantPseudos = pseudos.filter((p: any) => cSplit[1] && cSplit[1].includes(p.mask));

        multiLog([
          [relevantPseudos.length, 'relevant pseudos found'],
          [relevantPseudos.map((p: any) => p.mask), 'pseudo masks found'],
        ]);

        // Stage 13: Handle pseudo processing
        if (relevantPseudos.length > 0) {
          // Sort pseudos by position in string for correct precedence
          const sortedPseudos = relevantPseudos.sort((p1: any, p2: any) => c.indexOf(p1.mask) - c.indexOf(p2.mask));
          const firstPseudo = sortedPseudos[0];

          log(firstPseudo, 'first pseudo to process');

          // Stage 14: Apply pseudo transformations
          const selIndex = c.indexOf('SEL');
          const pseudoIndex = c.indexOf(firstPseudo.mask);

          if (!c.includes('SEL') || selIndex > pseudoIndex) {
            c = c.replace('SEL', '').replace(firstPseudo.mask, 'SEL__COM_' + comboABBR + firstPseudo.mask);
            log(c, 'after pseudo transformation (case 1)');
          } else if (c.includes('SEL')) {
            c = c.replace('SEL', 'SEL__COM_' + comboABBR + '__');
            log(c, 'after SEL replacement (case 2)');
          }
        } else {
          // Stage 15: Default SEL processing
          if (c.includes('SEL')) {
            c = c.replace('SEL', 'SEL__COM_' + comboABBR + '__');
            log(c, 'after default SEL replacement');
          } else if (cSplit.length > 1) {
            const partToReplace = cSplit[1];
            c = c.replace(partToReplace, partToReplace + 'SEL__COM_' + comboABBR);
            log(c, 'after default part replacement');
          }
        }
      }
    } else {
      // Stage 16: Handle non-indicator classes
      log(c, 'template does not start with indicator class - adding to element');
      class2CreateElement.classList.add(c);
    }

    // Stage 17: Add to results if not already present
    if (!comboClasses2Create.includes(c)) {
      comboClasses2Create.push(c);
      log(`added "${c}" to result array (position ${comboClasses2Create.length})`, 'result addition');
    } else {
      log(`"${c}" already exists in result array`, 'duplicate prevention');
    }
  });

  // Stage 18: Cache and return results
  if (values.cacheActive && cacheKey) {
    manage_cache.addCached(cacheKey, 'comboParser', comboClasses2Create);
    log('result cached successfully', 'cache operation');
  }

  const totalTime = performance.now() - startTime;
  multiLog([
    [comboClasses2Create, 'final combo classes result'],
    [comboClasses2Create.length, 'total classes generated'],
    [`${totalTime.toFixed(2)}ms`, 'total execution time'],
    ['function execution completed', 'completion status'],
  ]);

  return comboClasses2Create;
};
