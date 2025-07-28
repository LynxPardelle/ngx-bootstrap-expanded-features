import { ValuesSingleton } from '../../../singletons/valuesSingleton';
import { abreviation_traductors } from '../../abreviation_traductors';
import { console_log } from '../../console_log';
import { color_transform } from './../../color_transform';
/* Cache Management */
import { 
  cacheManager, 
  checkAndHandleValuesChange 
} from '../../cache_solutions';
/* Types */
import { TLogPartsOptions } from '../../../types';

// Cache for performance optimization - now managed by centralized cache system
const cache = cacheManager.getContainer();

const values: ValuesSingleton = ValuesSingleton.getInstance();

// Check for ValuesSingleton instance changes and handle cache invalidation
checkAndHandleValuesChange(values);

// Use centralized cache for value translator data
function getColorsRegex(): RegExp | null {
  if (!cache.regexCache.has('valueTraductor_colorsRegex')) {
    const sortedColorKeys = Object.keys(values.colors).sort((c1, c2) => c2.length - c1.length);
    if (sortedColorKeys.length > 0) {
      const colorsPattern = sortedColorKeys.map(c => `(${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`).join('|');
      const regex = new RegExp(`(?<![a-zA-Z0-9])(${colorsPattern})(?![a-zA-Z0-9])`, 'gi');
      cache.regexCache.set('valueTraductor_colorsRegex', regex);
      return regex;
    }
    return null;
  }
  return cache.regexCache.get('valueTraductor_colorsRegex') || null;
}

function getOpaRegex(): RegExp {
  if (!cache.regexCache.has('valueTraductor_opaRegex')) {
    const regex = new RegExp(/(?:([A-z0-9#]*)|(?:(rgb)|(hsl)|(hwb))a?\([0-9\.\,\s%]*\))\s?OPA\s?0\.[0-9]*/gi);
    cache.regexCache.set('valueTraductor_opaRegex', regex);
    return regex;
  }
  return cache.regexCache.get('valueTraductor_opaRegex')!;
}

function getSortedColorKeys(): string[] {
  if (!cache.pseudoValidationCache.has('valueTraductor_sortedColorKeys_cached')) {
    const sortedKeys = Object.keys(values.colors).sort((c1, c2) => c2.length - c1.length);
    // Store keys as a JSON string in a map that accepts string values
    cache.pseudoConversionCache.set('valueTraductor_sortedColorKeys', JSON.stringify(sortedKeys));
    cache.pseudoValidationCache.set('valueTraductor_sortedColorKeys_cached', true);
    return sortedKeys;
  }
  const cachedKeys = cache.pseudoConversionCache.get('valueTraductor_sortedColorKeys');
  return cachedKeys ? JSON.parse(cachedKeys) : [];
}

const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('valueTraductor', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('valueTraductor', toLog);
};
/**
 * Translates and processes a value string by applying various transformations.
 * 
 * This function performs the following operations:
 * 1. Applies abbreviation translation using predefined abbreviation values
 * 2. Parses the value through OPA parser (if property doesn't contain 'content')
 * 3. Identifies and replaces color names with their corresponding color values
 * 4. Converts color values to rgba format when necessary
 * 
 * @param value - The string value to be translated and processed
 * @param property - The property name that determines processing behavior
 * @returns A promise that resolves to the translated and processed string value
 * 
 * @example
 * ```typescript
 * await valueTraductor("futurePop__OPA__", "text"): rgba(151, 0, 255, 1)
 * // Returns processed string with color values converted to rgba format
 * ```
 * 
 * @remarks
 * - Color matching is case-insensitive and uses word boundaries to prevent partial matches
 * - Colors are sorted by length in descending order to prioritize longer color names
 * - RGB colors without alpha are automatically converted to rgba with alpha value of 1
 * - Hex colors are converted to rgba format using the color_transform utility
 * - OPA parsing is skipped for properties containing 'content'
 */
export const valueTraductor = async (
  value: string,
  property: string
): Promise<string> => {
  multiLog([
    [value, 'value'],
    [property, 'property'],
  ]);

  // Apply abbreviation translation
  const abbreviatedValue = values.abreviationsValues[value];
  if (abbreviatedValue) {
    value = abreviation_traductors.abreviationTraductor(abbreviatedValue);
  } else {
    value = abreviation_traductors.abreviationTraductor(value);
  }
  
  log(value, 'value After AbreviationTraductor');
  
  // Skip OPA and color processing for content properties
  if (property.includes('content')) {
    log(value, 'value Before OPA and Colors');
    return value;
  }
  
  // Process OPA syntax
  value = opaParser(value);
  
  // Process color names only if we have a cached regex and the value might contain colors
  const colorsRegex = getColorsRegex();
  const sortedColorKeys = getSortedColorKeys();
  if (colorsRegex && (value.includes('rgb') || value.includes('#') || sortedColorKeys.some((color: string) => value.includes(color)))) {
    const matches = value.match(colorsRegex);
    log(matches, 'matches');
    
    if (matches) {
      // Process matches in reverse order to avoid index shifting
      for (let i = matches.length - 1; i >= 0; i--) {
        const match = matches[i];
        log(match, 'match');
        
        const colorKey = match.replace(/\s/g, '');
        const realColor = values.colors[colorKey];
        log(realColor, 'realColor');
        
        if (realColor) {
          let realColorValue: string;
          
          if (realColor.startsWith('rgb') && !realColor.includes('rgba')) {
            realColorValue = `rgba(${realColor}, 1)`;
          } else if (realColor.startsWith('#')) {
            realColorValue = `rgba(${color_transform.colorToRGB(realColor)}, 1)`;
          } else {
            realColorValue = realColor;
          }
          
          log(realColorValue, 'realColorValue');
          value = value.replace(match, realColorValue);
          log(value, 'value');
        }
      }
    }
  }
  
  log(value, 'value Before OPA and Colors');
  return value;
};
/**
 * Parses a string value to convert OPA (opacity) color syntax to standard rgba format.
 * 
 * This function searches for custom OPA syntax patterns in the input string and converts them
 * to standard CSS rgba color values. It supports various color formats including hex, rgb, hsl,
 * and hwb with opacity values.
 * 
 * @param value - The input string that may contain OPA color syntax
 * @returns The parsed string with OPA syntax converted to rgba format
 * 
 * @example
 * ```typescript
 * // Input: "randNumA OPA 0.75"
 * // Output: "rgba(255, 0, 0, 0.75)"
 * const result = opaParser("randNumA OPA 0.75");
 * ```
 * 
 * @remarks
 * The function uses a regular expression to match patterns like:
 * - `colorValue OPA opacityValue` where colorValue can be hex, rgb, hsl, or hwb
 * - Converts matched colors using the color_transform utility
 * - Handles color name lookups from a values.colors dictionary
 * - Processes multiple OPA occurrences efficiently
 */
export const opaParser = (value: string): string => {
  multiLog([
    [value.includes('OPA'), 'hasOPA'],
    [value, 'value'],
  ]);
  
  // Early exit if no OPA syntax present
  if (!value.includes('OPA')) {
    return value;
  }
  
  // Use cached regex for better performance
  const matches = value.match(getOpaRegex());
  if (!matches) {
    return value;
  }
  
  // Process matches in reverse order to avoid index shifting during replacement
  let result = value;
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const parts = match.split('OPA');
    if (parts.length !== 2) continue;
    
    const color = parts[0].trim();
    const opaValue = parts[1].trim();
    
    // Look up color in values.colors or use as-is
    const colorKey = color.replace(/\s/g, '');
    const resolvedColor = values.colors[colorKey] || color;
    
    // Convert to RGB and create rgba
    const rgbValues = color_transform.colorToRGB(resolvedColor);
    const rgbaColor = `rgba(${rgbValues},${opaValue})`;
    
    // Replace the entire OPA expression
    result = result.replace(match, rgbaColor);
  }
  
  return result;
};
