/* Singletons */
import { ValuesSingleton } from '../singletons/valuesSingleton';
/* Cache Management */
import { manage_cache } from './manage_cache';
const values: ValuesSingleton = ValuesSingleton.getInstance();
/**
 * Pre-compiled regex patterns for optimal performance
 * Cached regex objects eliminate repeated pattern compilation overhead
 */
const cachedRegexPatterns = {
  cssToKebab: /([-_][a-z])/gi,
  camelToKebab: /[\w]([A-Z])/g,
};

/**
 * CSS property name conversion utilities with intelligent caching and optimized algorithms.
 *
 * This module provides bidirectional conversion between CSS property naming conventions:
 * - CSS kebab-case (e.g., 'background-color', 'margin-top')
 * - JavaScript camelCase (e.g., 'backgroundColor', 'marginTop')
 *
 * **Performance Optimizations:**
 * - Intelligent caching system for converted property names
 * - Pre-compiled regex patterns to eliminate creation overhead
 * - Early validation and exit strategies for edge cases
 * - Optimized string operations with minimal allocations
 * - Cache size management to prevent memory leaks
 *
 * @example
 * ```typescript
 * // CSS to camelCase conversion
 * css_camel.cssValidToCamel('background-color'); // 'backgroundColor'
 * css_camel.cssValidToCamel('margin_top'); // 'marginTop'
 *
 * // camelCase to CSS conversion
 * css_camel.camelToCSSValid('backgroundColor'); // 'background-color'
 * css_camel.camelToCSSValid('marginTop'); // 'margin-top'
 * ```
 */
export const css_camel = {
  /**
   * Converts CSS property names from kebab-case or snake_case to camelCase.
   *
   * Transforms CSS property naming conventions to JavaScript-compatible camelCase format.
   * Handles both hyphen-separated (kebab-case) and underscore-separated (snake_case) inputs.
   *
   * @param st - The CSS property name string to convert (e.g., 'background-color', 'margin_top')
   * @returns The camelCase version of the property name (e.g., 'backgroundColor', 'marginTop')
   *
   * @example
   * ```typescript
   * cssValidToCamel('background-color'); // 'backgroundColor'
   * cssValidToCamel('border_top_width'); // 'borderTopWidth'
   * cssValidToCamel('z-index'); // 'zIndex'
   * cssValidToCamel('font-size'); // 'fontSize'
   * ```
   *
   * @remarks
   * **Performance Features:**
   * - Results are cached for instant repeated conversions
   * - Uses pre-compiled regex for optimal pattern matching
   * - Early return for empty/invalid inputs
   * - Minimal string operations for maximum efficiency
   *
   * **Input Validation:**
   * - Handles empty strings gracefully
   * - Processes both hyphen and underscore separators
   * - Maintains case sensitivity for non-separator characters
   */
  cssValidToCamel(st: string): string {
    // Early validation - return immediately for empty/invalid inputs
    if (!st || typeof st !== 'string') {
      return st || '';
    }

    // Check cache first for instant response
    let cacheKey: string | undefined;
    if (values.cacheActive) {
      cacheKey = `css2camel:${st}`;
      const cachedResult = manage_cache.getCached<string>(cacheKey, 'cssValid');
      if (cachedResult !== undefined) {
        return cachedResult;
      }
    }

    // Optimized conversion using pre-compiled regex
    const result = st.replace(cachedRegexPatterns.cssToKebab, match => {
      // Direct character manipulation for optimal performance
      const char = match.charAt(1);
      return char.toUpperCase();
    });

    // Cache the result for future calls
    if (values.cacheActive && cacheKey) {
      manage_cache.addCached<string>(cacheKey, 'cssValid', result);
    }

    return result;
  },

  /**
   * Converts camelCase property names to CSS-valid kebab-case format.
   *
   * Transforms JavaScript camelCase property names to CSS-compatible kebab-case format.
   * Inserts hyphens before uppercase letters and converts the entire string to lowercase.
   *
   * @param st - The camelCase property name string to convert (e.g., 'backgroundColor', 'marginTop')
   * @returns The kebab-case CSS property name (e.g., 'background-color', 'margin-top')
   *
   * @example
   * ```typescript
   * camelToCSSValid('backgroundColor'); // 'background-color'
   * camelToCSSValid('borderTopWidth'); // 'border-top-width'
   * camelToCSSValid('zIndex'); // 'z-index'
   * camelToCSSValid('fontSize'); // 'font-size'
   * ```
   *
   * @remarks
   * **Performance Features:**
   * - Results are cached for instant repeated conversions
   * - Uses pre-compiled regex for optimal pattern matching
   * - Early return for empty/invalid inputs
   * - Single-pass conversion with optimized string operations
   *
   * **Conversion Logic:**
   * - Identifies uppercase letters following lowercase/numbers
   * - Inserts hyphen before uppercase letters
   * - Converts entire result to lowercase
   * - Handles edge cases like single characters gracefully
   */
  camelToCSSValid(st: string): string {
    // Early validation - return immediately for empty/invalid inputs
    if (!st || typeof st !== 'string') {
      return st || '';
    }

    // Check cache first for instant response
    let cacheKey: string | undefined;
    if (values.cacheActive) {
      cacheKey = `camel2css:${st}`;
      const cachedResult = manage_cache.getCached<string>(cacheKey, 'camel');
      if (cachedResult !== undefined) {
        return cachedResult;
      }
    }

    // Optimized conversion using pre-compiled regex with single toLowerCase call
    const result = st
      .replace(cachedRegexPatterns.camelToKebab, match => {
        // Direct character access for optimal performance
        return match[0] + '-' + match[1];
      })
      .toLowerCase();

    // Cache the result for future calls
    if (values.cacheActive && cacheKey) {
      manage_cache.addCached<string>(cacheKey, 'camel', result);
    }

    return result;
  },
};
