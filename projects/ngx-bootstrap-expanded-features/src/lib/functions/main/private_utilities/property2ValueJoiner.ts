/* Singletons */
import { ValuesSingleton } from '../../../singletons/valuesSingleton';
import { css_camel } from '../../css-camel';
import { btnCreator } from './btnCreator';
/* Cache Management */
import { 
  smartCacheValidation,
  getUnifiedCache
} from '../../unified_cache_manager';

// Unified cache for performance optimization - centralized with smart invalidation
const cache = getUnifiedCache();

const values: ValuesSingleton = ValuesSingleton.getInstance();

// Smart cache validation - only invalidates when data actually changes
smartCacheValidation(values);

/**
 * Maximum cache size to prevent memory issues
 */
const MAX_CACHE_SIZE = 1000;

/**
 * Pre-defined CSS rule templates for common patterns
 */
const CSS_TEMPLATES = {
  single: (specify: string, property: string, value: string) => `${specify}{${property}:${value};}`,
  multiple: (specify: string, properties: string[]) => `${specify}{${properties.join('')}}`,
  link: (specify: string, value: string) => ` a${specify}{color:${value};}`,
} as const;

/**
 * Optimized property type detection using efficient string matching
 */
const detectPropertyType = (property: string, class2CreateSplited: string[]): string => {
  if (!class2CreateSplited[1]) return 'default';
  
  const secondElement = class2CreateSplited[1];
  
  // Use startsWith for most efficient prefix matching
  if (secondElement.startsWith('btnOutline')) return 'btnOutline';
  if (secondElement.startsWith('btn')) return 'btn';
  if (secondElement.startsWith('link')) return 'link';
  
  return 'default';
};

/**
 * Creates a cache key for CSS generation results
 */
const createCacheKey = (
  property: string,
  class2CreateSplited: string[],
  class2Create: string,
  propertyValues: string[],
  specify: string
): string => {
  return `${property}|${class2CreateSplited.join('-')}|${class2Create}|${propertyValues.join(',')}|${specify}`;
};

/**
 * Gets cached camelCase conversion or creates and caches new one
 */
const getCachedCamelCase = (property: string): string => {
  const camelCacheKey = `property2Value_camel_${property}`;
  let result = cache.cssNameConversionCache.get(camelCacheKey);
  if (result === undefined) {
    if (cache.cssNameConversionCache.size >= MAX_CACHE_SIZE) {
      const keysToDelete = Array.from(cache.cssNameConversionCache.keys())
        .filter(k => k.startsWith('property2Value_camel_'))
        .slice(0, Math.floor(MAX_CACHE_SIZE / 4));
      keysToDelete.forEach(key => cache.cssNameConversionCache.delete(key));
    }
    result = css_camel.camelToCSSValid(property);
    cache.cssNameConversionCache.set(camelCacheKey, result);
  }
  return result;
};

/**
 * Optimized CSS names parsed processor
 */
const processCssNamesParsed = (specify: string, property: string, propertyValues: string[]): string => {
  const cssNameParsed = values.cssNamesParsed[property];
  
  if (typeof cssNameParsed === 'string') {
    return CSS_TEMPLATES.single(specify, cssNameParsed, propertyValues[0]);
  } else {
    // Optimized array processing with pre-allocated array
    const properties: string[] = [];
    const length = cssNameParsed.length;
    
    for (let i = 0; i < length; i++) {
      const value = propertyValues[i] || propertyValues[0] || '';
      properties.push(`${cssNameParsed[i]}:${value};`);
    }
    
    return CSS_TEMPLATES.multiple(specify, properties);
  }
};
/**
 * Optimized property-value CSS joiner with intelligent caching and streamlined algorithms.
 * 
 * This function efficiently processes CSS property and value combinations to generate valid CSS rules.
 * It handles special cases like button generation, link styling, and complex CSS property mappings
 * while maintaining high performance through intelligent caching and optimized algorithms.
 * 
 * @param property - The CSS property name to process
 * @param class2CreateSplited - Array of class name segments after splitting
 * @param class2Create - The complete class name being created
 * @param propertyValues - Array of property values to apply (default: [''])
 * @param specify - The CSS selector specification (including pseudo-classes/combinators)
 * 
 * @returns Promise resolving to a CSS rule string
 * 
 * @example
 * ```typescript
 * // Regular property
 * await property2ValueJoiner('margin', ['bef', 'margin', '10px'], 'bef-margin-10px', ['10px'], '');
 * // Button generation
 * await property2ValueJoiner('btn', ['bef', 'btn', 'primary'], 'bef-btn-primary', ['#007bff'], ':hover');
 * // Link styling
 * await property2ValueJoiner('link', ['bef', 'link', 'blue'], 'bef-link-blue', ['blue'], '');
 * ```
 * 
 * @remarks
 * **Performance Optimizations:**
 * - Intelligent caching system for complete CSS generation results
 * - Cached camelCase conversions to avoid repeated property name processing
 * - Optimized property type detection using efficient string matching
 * - Pre-defined CSS templates for common patterns to reduce string operations
 * - Early validation and exit strategies for invalid inputs
 * - Streamlined array processing with minimal allocations
 * - Cache size management with automatic cleanup to prevent memory leaks
 * 
 * **Supported Property Types:**
 * - **CSS Names Parsed**: Complex property mappings from ValuesSingleton
 * - **Button Generation**: Special handling for 'btn' and 'btnOutline' prefixes
 * - **Link Styling**: Special anchor tag styling for 'link' prefix
 * - **Default Properties**: Standard CSS property-value pairs
 * 
 * **CSS Generation Features:**
 * - Single property CSS rules for simple mappings
 * - Multiple property CSS rules for complex mappings
 * - Button CSS generation with full state support (hover, focus, active)
 * - Link-specific styling with anchor tag targeting
 * - Automatic property name conversion from camelCase to kebab-case
 * 
 * **Cache Management:**
 * - CSS generation cache for instant repeated rule creation
 * - CamelCase conversion cache for property name transformations
 * - Automatic cache cleanup to prevent memory leaks
 * - Efficient cache key generation for optimal lookup performance
 * 
 * **Backward Compatibility:**
 * - Maintains identical CSS output to original implementation
 * - Same function signature and return type
 * - All existing CSS generation patterns continue to work correctly
 * - Full support for all button variants and special cases
 */
export const property2ValueJoiner = async (
  property: string,
  class2CreateSplited: string[],
  class2Create: string,
  propertyValues: string[] = [''],
  specify: string = ''
): Promise<string> => {
  // Early validation
  if (!property && !class2CreateSplited[1]) {
    return '';
  }

  // Check cache first for instant response
  const cacheKey = createCacheKey(property, class2CreateSplited, class2Create, propertyValues, specify);
  const cachedResult = cache.propertyJoinerCache.get(cacheKey);
  if (cachedResult !== undefined) {
    return cachedResult;
  }

  let result: string;

  // Check if property exists in cssNamesParsed first (most common case)
  if (values.cssNamesParsed[property]) {
    result = processCssNamesParsed(specify, property, propertyValues);
  } else {
    // Optimized property type detection
    const propertyType = detectPropertyType(property, class2CreateSplited);
    
    switch (propertyType) {
      case 'link':
        result = CSS_TEMPLATES.link(specify, propertyValues[0]);
        break;
        
      case 'btnOutline':
        result = await btnCreator(
          class2Create,
          specify,
          propertyValues[0],
          propertyValues[1] || '',
          true
        );
        break;
        
      case 'btn':
        result = await btnCreator(class2Create, specify, propertyValues[0]);
        break;
        
      default:
        // Default case: standard CSS property-value pair
        const cssProperty = getCachedCamelCase(property);
        result = CSS_TEMPLATES.single(specify, cssProperty, propertyValues[0]);
        break;
    }
  }

  // Cache the result for future calls
  if (cache.propertyJoinerCache.size >= MAX_CACHE_SIZE) {
    const keysToDelete = Array.from(cache.propertyJoinerCache.keys()).slice(0, Math.floor(MAX_CACHE_SIZE / 2));
    keysToDelete.forEach(key => cache.propertyJoinerCache.delete(key));
  }
  cache.propertyJoinerCache.set(cacheKey, result);

  return result;
};
