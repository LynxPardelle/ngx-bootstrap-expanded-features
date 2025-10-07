/* Singletons */
import { ValuesSingleton } from '../../../singletons/valuesSingleton';
/* Functions */
import { console_log } from '../../../functions/console_log';
import { manage_cache } from '../../manage_cache';
/* Types */
import { TLogPartsOptions } from '../../../types';
const log = (t: unknown, p?: TLogPartsOptions) => {
  console_log.betterLogV1('values4ComboGetter', t, p);
};
const multiLog = (toLog: [unknown, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('values4ComboGetter', toLog);
};
const values = ValuesSingleton.getInstance();

type TVals2Sort = {
  index: number;
  val: string;
};
export const values4ComboGetter = (class2Create: string): string[] => {
  // Performance monitoring
  const startTime = performance.now();
  log(class2Create, 'class2Create');

  // Stage 1: Cache Check
  let cacheKey: string | undefined;
  if (values.cacheActive) {
    cacheKey = `${class2Create}`;
    const cachedResult = manage_cache.getCached<string[]>(cacheKey, 'values4ComboGetter');
    if (cachedResult) {
      const cacheTime = performance.now() - startTime;
      multiLog([
        [cachedResult, 'cached result returned'],
        [`${cacheTime.toFixed(2)}ms`, 'cache retrieval time'],
      ]);
      return cachedResult;
    }
    log(false, 'cache miss - proceeding with computation');
  }

  // Stage 2: Initial validation and setup
  let result: string[] = [];

  if (!class2Create.includes('VALS')) {
    multiLog([
      [false, 'contains VALS'],
      [result, 'returning empty result'],
    ]);

    if (values.cacheActive && cacheKey) {
      manage_cache.addCached(cacheKey, 'values4ComboGetter', result);
    }
    return result;
  }

  // Stage 3: Extract values source
  const valsSource: string = class2Create.split('VALS')[1];
  multiLog([
    [valsSource, 'extracted valsSource'],
    [valsSource.length, 'valsSource length'],
  ]);

  // Stage 4: Regex validation and matching
  const valueReg = values.cacheActive
    ? (manage_cache.getCached<RegExp>(
        'VAL_REGEX_PATTERN',
        'regExp',
        () => new RegExp(/VAL([0-9_]+)N[A-z0-9]+VAL\1N/, 'g')
      ) as RegExp)
    : new RegExp(/VAL([0-9_]+)N[A-z0-9]+VAL\1N/, 'g');
  const hasValueRegex = valueReg.test(valsSource);

  multiLog([
    [hasValueRegex, 'contains value regex pattern'],
    [valueReg.source, 'regex pattern used'],
  ]);

  // Stage 5: Basic split (fallback case)
  result = valsSource.split('VL');
  log(result, 'result VL split');

  if (!hasValueRegex) {
    multiLog([
      [false, 'regex pattern found'],
      [result, 'using basic split result'],
    ]);

    if (values.cacheActive && cacheKey) {
      manage_cache.addCached(cacheKey, 'values4ComboGetter', result);
    }
    return result;
  }

  // Stage 6: Advanced parsing with regex matches
  // Reset regex for new match operation
  valueReg.lastIndex = 0;
  const valsToSortSource: RegExpMatchArray | null = valsSource.match(valueReg);

  multiLog([
    [valsToSortSource, 'regex matches found'],
    [valsToSortSource?.length || 0, 'number of matches'],
  ]);

  if (!valsToSortSource) {
    if (values.cacheActive && cacheKey) {
      manage_cache.addCached(cacheKey, 'values4ComboGetter', result);
    }
    return result;
  }

  // Stage 7: Process matched values and build sorted structure
  const valsToSortExtras: TVals2Sort[] = [];
  let valsToSort: TVals2Sort[] = valsToSortSource.map((v: string, mapIndex: number) => {
    log(`processing match ${mapIndex + 1}/${valsToSortSource.length}: ${v}`, 'match processing');

    const index: string = v.split('VAL')[1].split('N')[0];
    const valReplace: RegExp = values.cacheActive
      ? (manage_cache.getCached<RegExp>(index, 'regExp', () => new RegExp(`VAL${index}N`, 'g')) as RegExp)
      : new RegExp(`VAL${index}N`, 'g');
    let firstIndex: number = parseInt(index);

    multiLog([
      [index, 'extracted index string'],
      [firstIndex, 'parsed first index'],
      [index.includes('_'), 'has multiple indexes'],
    ]);

    if (index.includes('_')) {
      const indexes: string[] = index.split('_');
      log(indexes, 'indexes splitted from index');

      indexes.forEach((i: string, it: number) => {
        if (it > 0) {
          const extraVal = {
            index: parseInt(i),
            val: v.replace(valReplace, ''),
          };
          valsToSortExtras.push(extraVal);
        }
      });
    }

    const processedValue = {
      index: firstIndex,
      val: v.replace(valReplace, ''),
    };

    log(processedValue, `processedValue ${mapIndex + 1}`);
    return processedValue;
  });

  multiLog([
    [valsToSort.length, 'primary values count'],
    [valsToSortExtras.length, 'extra values count'],
  ]);

  // Stage 8: Combine primary and extra values
  valsToSort = valsToSort.concat(valsToSortExtras);
  log(valsToSort, 'valsToSort');

  // Stage 9: Process unsorted values from VL splits
  const valsNotSorted: string[] = valsSource.split('VL');
  log(valsNotSorted, 'valsNotSorted');

  let noValsNotSorted: boolean = false;
  if (valsNotSorted.length >= 1) {
    valsNotSorted.shift(); // Remove first empty element
    log(valsNotSorted, 'valsNotSorted after removing first element');
  }

  if (valsNotSorted.length <= 0) {
    noValsNotSorted = true;
  }

  multiLog([
    [valsNotSorted.length, 'valsNotSorted count'],
    [noValsNotSorted, 'noValsNotSorted'],
  ]);

  // Stage 10: Calculate occupied indexes - using Set for O(1) lookup performance
  const ocupedIndexes: Set<number> = new Set(valsToSort.map(v => v.index));
  multiLog([
    [ocupedIndexes, 'ocupedIndexes for fast lookup'],
    [ocupedIndexes.size, 'ocupedIndexes count'],
  ]);

  // Stage 11: Process unsorted values if they exist
  if (!noValsNotSorted) {
    log('processing unsorted values', 'unsorted processing stage');

    const valsNotSortedSorted: TVals2Sort[] = valsNotSorted.map((v, mapIndex) => {
      let index = 1;
      while (ocupedIndexes.has(index)) {
        index++;
      }
      ocupedIndexes.add(index);

      const sortedVal = {
        index: index,
        val: v,
      };

      log(`assigned index ${index} to unsorted value ${mapIndex + 1}: "${v}"`, 'unsorted assignment');
      return sortedVal;
    });

    multiLog([
      [valsNotSortedSorted, 'processed unsorted values'],
      [valsNotSortedSorted.length, 'processed unsorted count'],
    ]);

    valsNotSortedSorted.sort((v1, v2) => v1.index - v2.index);
    log(valsNotSortedSorted, 'sorted unsorted values');

    // Stage 12: Combine and sort all values
    valsToSort = valsToSort.concat(valsNotSortedSorted);
    valsToSort.sort((v1, v2) => v1.index - v2.index);

    multiLog([
      [valsToSort.length, 'total values after combining'],
      [valsToSort, 'all values combined and sorted'],
    ]);
  }

  // Stage 13: Fill empty positions
  const emptyValsToFillValsSorted: TVals2Sort[] = [];
  const sortedValsToSort = [...valsToSort].sort((v1, v2) => v1.index - v2.index);
  const lastValIndex = sortedValsToSort[sortedValsToSort.length - 1].index;

  multiLog([
    [lastValIndex, 'last index found'],
    [sortedValsToSort.map(v => v.index), 'all indexes before filling'],
  ]);

  for (let i = 0; i < lastValIndex; i++) {
    if (!ocupedIndexes.has(i)) {
      emptyValsToFillValsSorted.push({
        index: i,
        val: '',
      });
      log(`filled empty position at index ${i}`, 'empty position fill');
    }
  }

  multiLog([
    [emptyValsToFillValsSorted, 'empty positions filled'],
    [emptyValsToFillValsSorted.length, 'empty positions count'],
  ]);

  // Stage 14: Final sorting and result generation
  const valsSorted: TVals2Sort[] = valsToSort.concat(emptyValsToFillValsSorted).sort((v1, v2) => v1.index - v2.index);

  multiLog([
    [valsSorted, 'final sorted values'],
    [valsSorted.length, 'final sorted count'],
    [valsSorted.map(v => `${v.index}:${v.val}`), 'index:value pairs'],
  ]);

  result = valsSorted.map(v => v.val);

  // Stage 15: Cache the result and return
  if (values.cacheActive && cacheKey) {
    manage_cache.addCached(cacheKey, 'values4ComboGetter', result);
    log('final result cached successfully', 'cache operation');
  }

  const totalTime = performance.now() - startTime;
  multiLog([
    [result, 'final result'],
    [result.length, 'final result length'],
    [`${totalTime.toFixed(2)}ms`, 'total execution time'],
    ['function execution completed', 'completion status'],
  ]);

  return result;
};
