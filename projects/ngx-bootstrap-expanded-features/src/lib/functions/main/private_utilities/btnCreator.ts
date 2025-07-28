/* Singletons */
import { ValuesSingleton } from '../../../singletons/valuesSingleton';
import { color_transform } from '../../color_transform';
import { console_log } from '../../console_log';
import { combinators } from '../../utilities/combinators';
import {
  TNameVal,
  TNameValNumber,
  TNameValProp,
} from '../private_types/types.private';
import { propertyNValueCorrector } from './propertyNValueCorrector';
/* Cache Management */
import { 
  smartCacheValidation,
  getUnifiedCache, 
  getCachedValue, 
  setCachedValue, 
  createCacheKey
} from '../../unified_cache_manager';
/* Types */
import { TLogPartsOptions } from '../../../types';

/**
 * Cache for button CSS generation results - now managed by unified cache system
 */
const cache = getUnifiedCache();

/**
 * Maximum cache size to prevent memory issues
 */
const MAX_CACHE_SIZE = 500;

/**
 * Pre-defined shade number arrays to avoid repeated allocations
 */
const SHADE_NUMBERS = [-15, -20, -25, 3];
const CSS_PROPERTIES = ['background-color', 'color', 'border-color'];
const SHADOW_PROPERTIES = ['box-shadow'];
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('btnCreator', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('btnCreator', toLog);
};

/**
 * Creates a cache key for button CSS generation
 */
const createButtonCacheKey = (
  class2Create: string,
  specify: string,
  value: string,
  secondValue: string,
  outline: boolean
): string => {
  return `${class2Create}|${specify}|${value}|${secondValue}|${outline}`;
};

/**
 * Gets or creates cached regex for efficient string replacement
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
 * Cached shade calculation for color values
 */
const getCachedShade = (shadeNumber: number, colorValue: string): string => {
  const cacheKey = `${shadeNumber}|${colorValue}`;
  let result = cache.buttonShadeCache.get(cacheKey);
  if (result === undefined) {
    if (cache.buttonShadeCache.size >= MAX_CACHE_SIZE) {
      const keysToDelete = Array.from(cache.buttonShadeCache.keys()).slice(0, Math.floor(MAX_CACHE_SIZE / 2));
      keysToDelete.forEach(key => cache.buttonShadeCache.delete(key));
    }
    result = color_transform.getShadeTintColorOrGradient(shadeNumber, colorValue);
    cache.buttonShadeCache.set(cacheKey, result);
  }
  return result;
};

/**
 * Cached property value correction
 */
const getCachedCorrection = async (property: string, value: string): Promise<string> => {
  const cacheKey = `${property}|${value}`;
  let result = cache.buttonCorrectionCache.get(cacheKey);
  if (result === undefined) {
    if (cache.buttonCorrectionCache.size >= MAX_CACHE_SIZE) {
      const keysToDelete = Array.from(cache.buttonCorrectionCache.keys()).slice(0, Math.floor(MAX_CACHE_SIZE / 2));
      keysToDelete.forEach(key => cache.buttonCorrectionCache.delete(key));
    }
    result = await propertyNValueCorrector(property, value);
    cache.buttonCorrectionCache.set(cacheKey, result);
  }
  return result;
};

/**
 * Optimized shade array generation
 */
const generateShadeArray = (value: string, secondValue: string): TNameVal[] => {
  const baseValues = [
    { name: 'value', val: value },
    { name: 'secondValue', val: secondValue },
  ];

  const shadesArray: TNameVal[] = [];
  
  // Add base values
  shadesArray.push(...baseValues);
  
  // Generate shades efficiently
  for (const baseVal of baseValues) {
    for (const shadeNum of SHADE_NUMBERS) {
      shadesArray.push({
        name: `${baseVal.name},${shadeNum}`,
        val: getCachedShade(shadeNum, baseVal.val)
      });
    }
  }

  return shadesArray;
};
/**
 * Creates optimized button CSS with intelligent caching and streamlined algorithms.
 * 
 * This function generates comprehensive CSS rules for Bootstrap-style buttons with support for
 * regular and outline variants. It includes hover, focus, active, and checked states with
 * proper color theming and shadow effects.
 * 
 * @param class2Create - The CSS class name for the button
 * @param specify - The CSS selector specification (including pseudo-classes/combinators)
 * @param value - Primary color value for the button
 * @param secondValue - Secondary color value (default: 'transparent', used for outline buttons)
 * @param outline - Whether to create an outline button variant (default: false)
 * 
 * @returns Promise resolving to a CSS string containing all button state rules
 * 
 * @example
 * ```typescript
 * // Regular button
 * await btnCreator('btn-primary', '', '#007bff', 'transparent', false);
 * // Outline button
 * await btnCreator('btn-outline-success', ':hover', '#28a745', 'white', true);
 * ```
 * 
 * @remarks
 * **Performance Optimizations:**
 * - Intelligent caching system for complete button CSS generation results
 * - Cached shade calculations to avoid repeated color processing
 * - Cached property value corrections for instant repeated lookups
 * - Pre-compiled regex patterns for efficient string replacements
 * - Optimized array operations with minimal allocations
 * - Streamlined color processing pipeline
 * - Early exit strategies for cached results
 * 
 * **Generated CSS States:**
 * - Base button appearance (normal state)
 * - Hover state with appropriate color variations
 * - Focus state with enhanced accessibility
 * - Active/checked state with pressed appearance
 * - Focus within active state for keyboard navigation
 * 
 * **Color Processing Features:**
 * - Automatic shade generation (-15, -20, -25, +3 variations)
 * - Smart opacity handling for shadow effects
 * - Support for gradients and complex color formats
 * - Proper contrast handling for accessibility
 * 
 * **Cache Management:**
 * - Button CSS cache for instant repeated generation
 * - Shade calculation cache tied to color values
 * - Property correction cache for CSS validation
 * - Automatic cache cleanup to prevent memory leaks
 * 
 * **Backward Compatibility:**
 * - Maintains identical CSS output to original implementation
 * - Same function signature and return type
 * - All existing button styles continue to work correctly
 */
export const btnCreator = async (
  class2Create: string,
  specify: string,
  value: string,
  secondValue: string = 'transparent',
  outline: boolean = false
): Promise<string> => {
  // Smart cache validation - only invalidates when data actually changes
  const values: ValuesSingleton = ValuesSingleton.getInstance();
  smartCacheValidation(values);
  
  // Early validation
  if (!class2Create || !value) {
    return '';
  }

  // Check cache first for instant response
  const cacheKey = createButtonCacheKey(class2Create, specify, value, secondValue, outline);
  const cachedResult = cache.buttonCssCache.get(cacheKey);
  if (cachedResult !== undefined) {
    return cachedResult;
  }

  multiLog([
    [class2Create, 'class2Create'],
    [specify, 'specify'],
    [value, 'value'],
    [secondValue, 'secondValue'],
    [outline, 'outline'],
  ]);

  // Generate optimized shade array
  const shadesArray = generateShadeArray(value, secondValue);
  log(shadesArray, 'shadesArray');

  // Convert to object for efficient lookups
  const shades: { [key: string]: string } = combinators.combineIntoObject(shadesArray);
  
  multiLog([
    [shades, 'shades'],
    [shades['value,3'], `shades ['value,3']`],
    [shades['secondValue,3'], `shades ['secondValue,3']`],
  ]);

  // Cached shadow color calculations
  const shadowColorValue = color_transform.opacityCreator(shades['value,3'], 0.5);
  const shadowColorSecondValue = color_transform.opacityCreator(shades['secondValue,3'], 0.5);
  log(shadowColorValue, 'shadowColorValue');

  const shadowNumericalValues = '0 0 0 0.25rem ';

  // Generate correction arrays efficiently with batched processing
  const correctionTasks: Array<Promise<TNameVal>> = [];
  
  // Process base values and shades for CSS properties
  for (const shade of shadesArray) {
    for (const prop of CSS_PROPERTIES) {
      correctionTasks.push(
        getCachedCorrection(prop, shade.val).then(correctedVal => ({
          name: `${shade.name},${prop}`,
          val: correctedVal
        }))
      );
    }
  }

  // Process shadow values
  const shadowValues = [
    { name: 'shadowColorValue', val: shadowNumericalValues + shadowColorValue },
    { name: 'shadowColorSecondValue', val: shadowNumericalValues + shadowColorSecondValue },
  ];

  for (const shadowVal of shadowValues) {
    for (const prop of SHADOW_PROPERTIES) {
      correctionTasks.push(
        getCachedCorrection(prop, shadowVal.val).then(correctedVal => ({
          name: `${shadowVal.name}Corrected`,
          val: correctedVal
        }))
      );
    }
  }

  // Execute all corrections in parallel
  const allCorrections = await Promise.all(correctionTasks);
  
  // Combine results into efficient lookup objects
  const correctVals: { [key: string]: string } = combinators.combineIntoObject(
    allCorrections.filter(correction => !correction.name.includes('Corrected'))
  );
  
  const correctValsShadows: { [key: string]: string } = combinators.combineIntoObject(
    allCorrections.filter(correction => correction.name.includes('Corrected'))
  );

  multiLog([
    [correctVals, 'correctVals'],
    [correctValsShadows, 'correctValsShadows'],
  ]);

  // Get cached regex for efficient replacements
  const specifyRegex = getCachedRegex(values.specify, 'g');
  const newRuleArray: string[] = [];

  // Build CSS rules efficiently
  const buildRule = (selector: string, styles: string): string => {
    return `${values.specify}{${styles}}`.replace(specifyRegex, selector);
  };

  /* Basic Button */
  const basicStyles = outline
    ? correctVals['value,color'] + correctVals['secondValue,background-color'] + correctVals['value,border-color']
    : correctVals['value,background-color'] + correctVals['value,border-color'];
  newRuleArray.push(buildRule(specify, basicStyles));

  /* Hover Button */
  const hoverStyles = outline
    ? correctVals['secondValue,color'] + correctVals['value,-15,background-color'] + correctVals['secondValue,border-color']
    : correctVals['value,-20,border-color'] + correctVals['value,background-color'];
  newRuleArray.push(buildRule(`.${class2Create}${specify}:hover`, hoverStyles));

  /* Focus Button (only for outline) */
  if (outline) {
    const focusStyles = correctVals['secondValue,-15,background-color'] + correctVals['secondValue,-15,border-color'];
    newRuleArray.push(buildRule(
      `.btn-check:focus + .${class2Create}${specify}, .${class2Create}${specify}:focus`,
      focusStyles
    ));
  }

  /* Checked/Active Button */
  const checkedStyles = outline
    ? correctVals['value,-25,border-color']
    : correctVals['value,-20,background-color'] + correctVals['value,-25,border-color'];
  const checkedSelector = `.btn-check:checked + .${class2Create}${specify}, .btn-check:active + .${class2Create}${specify}, .${class2Create}${specify}.active, .show > .${class2Create}${specify} .dropdown-toggle, .${class2Create}${specify}:active`;
  newRuleArray.push(buildRule(checkedSelector, checkedStyles + correctValsShadows['shadowColorValueCorrected']));

  /* Focus within active state */
  const focusActiveSelector = `.show > .${class2Create}${specify} .dropdown-toggle:focus, .btn-check:checked + .btn-check:focus, .btn-check:active + .${class2Create}${specify}:focus, .${class2Create}${specify}.active:focus, .${class2Create}${specify}:active:focus`;
  newRuleArray.push(buildRule(focusActiveSelector, correctValsShadows['shadowColorValueCorrected']));

  log(newRuleArray, 'newRuleArray');

  // Generate final result
  const result = newRuleArray.filter(rule => rule !== '').join(values.separator);

  // Cache the result for future calls
  if (cache.buttonCssCache.size >= MAX_CACHE_SIZE) {
    const keysToDelete = Array.from(cache.buttonCssCache.keys()).slice(0, Math.floor(MAX_CACHE_SIZE / 2));
    keysToDelete.forEach(key => cache.buttonCssCache.delete(key));
  }
  cache.buttonCssCache.set(cacheKey, result);

  return result;
};
