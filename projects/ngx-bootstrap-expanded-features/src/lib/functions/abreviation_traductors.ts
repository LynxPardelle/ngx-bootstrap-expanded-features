/* Singletons */
import { ValuesSingleton } from '../singletons/valuesSingleton';
/* Functions */
import { console_log } from './console_log';
/* Types */
import { TLogPartsOptions } from '../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();

const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('abreviationTraductors', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('abreviationTraductors', toLog);
};
export const abreviation_traductors = {
  /**
   * Translates between abbreviations and their correct css.
   *
   * @param value - The string to be processed for abbreviation translation or conversion
   * @param type - The operation type: "traduce" converts abbreviations to correct css, "convert" converts correct css to abbreviations
   * @returns The processed string with abbreviations translated or converted according to the specified type
   *
   * @example
   * ```typescript
   * // Convert abbreviations to correct css
   * const result = abreviationTraductor("__COM_🜔🜔🜔", "traduce"):" , .🜔🜔🜔"
   *
   * // Convert correct css to abbreviations
   * const result = abreviationTraductor(" , .🜔🜔🜔", "convert"):"__COM_🜔🜔🜔"
   * ```
   */
  abreviationTraductor(value: string, type: 'traduce' | 'convert' = 'traduce'): string {
    multiLog([
      [value, 'value'],
      [type, 'type'],
    ]);

    // Early exit for empty or undefined values
    if (!value || value === '') {
      return value;
    }

    log(value, 'value BeforeAbreviationTraductor');

    // Use appropriate cached map based on type
    const translatorMap = type === 'traduce' ? values.translatorMaps.traduceMap : values.translatorMaps.convertMap;
    log(translatorMap, 'translatorMap');

    let result = value;
    let hasMatches = false;

    // Process translations using cached maps
    for (const [key, translator] of translatorMap) {
      // Quick check if the value contains the key before running expensive regex
      if (type === 'traduce' ? result.includes(key) : translator.regex.test(result)) {
        const previousResult = result;
        result = result.replace(translator.regex, translator.replacement as string);

        // Track if any changes were made for logging purposes
        if (previousResult !== result) {
          hasMatches = true;
        }

        // Reset regex lastIndex for global regexes to ensure consistent behavior
        translator.regex.lastIndex = 0;
      }
    }

    if (hasMatches) {
      log(result, 'value AfterAbreviationTraductor');
    }

    return result;
  },

  unbefysize(value: string): string {
    return this.abreviationTraductor(value, 'traduce');
  },

  befysize(value: string): string {
    return this.abreviationTraductor(value, 'convert');
  },
};
