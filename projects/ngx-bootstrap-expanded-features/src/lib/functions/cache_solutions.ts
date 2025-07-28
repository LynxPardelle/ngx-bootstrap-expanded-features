/**
 * Centralized Cache Management System for ngx-bootstrap-expanded-features
 * 
 * This file provides a comprehensive caching solution with intelligent invalidation
 * based on ValuesSingleton changes. All caches are organized by functional domains
 * and can be selectively invalidated when related data changes.
 * 
 * @fileoverview Centralized cache management with domain-specific invalidation
 * @version 1.0.0
 * @author ngx-bootstrap-expanded-features
 */

import { ValuesSingleton } from '../singletons/valuesSingleton';
import { IBPS } from '../interfaces';

// =============================================================================
// INTERFACE DEFINITIONS
// =============================================================================

/**
 * Interface for parseClass return values
 */
interface IparseClassReturn {
  class2Create: string;
  bpsStringed: IBPS[];
  classes2CreateStringed: string;
}

// =============================================================================
// CACHE TYPE DEFINITIONS
// =============================================================================

/**
 * Cache domains for organized invalidation
 */
export type CacheDomain = 
  | 'colors' 
  | 'abbreviations' 
  | 'combos' 
  | 'breakpoints' 
  | 'cssNames' 
  | 'classes' 
  | 'pseudos' 
  | 'styles' 
  | 'regex' 
  | 'all';

/**
 * Cache invalidation event types based on ValuesSingleton method calls
 */
export type CacheInvalidationEvent = 
  | 'pushColors' 
  | 'updateColor' 
  | 'deleteColor' 
  | 'clearAllColors'
  | 'pushAbreviationsValues' 
  | 'pushAbreviationsClasses' 
  | 'updateAbreviationsClass' 
  | 'updateAbreviationsValue'
  | 'pushCombos' 
  | 'updateCombo'
  | 'pushBPS'
  | 'pushCssNamesParsed' 
  | 'updateCssNamesParsed'
  | 'updateClasses'
  | 'pseudoChange'
  | 'valuesInstanceChange';

/**
 * Cache configuration interface
 */
interface ICacheConfig {
  maxSize: number;
  ttl?: number; // Time to live in milliseconds
  autoCleanup?: boolean;
}

/**
 * Cache statistics interface
 */
interface ICacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

// =============================================================================
// CACHE STORAGE CONTAINERS
// =============================================================================

/**
 * Global cache containers organized by domain
 */
class CacheContainer {
  // Color-related caches
  public colorTransformCache = new Map<string, string>();
  public shadeTintCache = new Map<string, string>();
  public colorValidationCache = new Map<string, boolean>();

  // Abbreviation-related caches
  public abbreviationTraduceCache = new Map<string, { property: string; value: string }>();
  public abbreviationConvertCache = new Map<string, { property: string; value: string }>();
  public abbreviationLookupCache = new WeakMap<ValuesSingleton, Map<string, string>>();

  // Combo-related caches
  public comboDecryptCache = new Map<string, string>();
  public comboKeysCache = new WeakMap<ValuesSingleton, Set<string>>();
  public comboValidationCache = new Map<string, boolean>();

  // Breakpoint-related caches
  public breakpointLookupCache = new WeakMap<ValuesSingleton, Set<string>>();
  public breakpointValidationCache = new Map<string, boolean>();

  // CSS processing caches
  public cssNameConversionCache = new Map<string, string>();
  public cssValidationCache = new Map<string, boolean>();

  // Class processing caches
  public parseClassCache = new Map<string, IparseClassReturn>();
  public createdClassesCache = new WeakMap<ValuesSingleton, Set<string>>();
  public classValidationCache = new Map<string, boolean>();

  // Button-related caches
  public buttonCssCache = new Map<string, string>();
  public buttonShadeCache = new Map<string, string>();
  public buttonCorrectionCache = new Map<string, string>();

  // Property processing caches
  public propertyJoinerCache = new Map<string, string>();
  public propertyValidationCache = new Map<string, boolean>();

  // Pseudo-class caches
  public pseudoConversionCache = new Map<string, string>();
  public pseudoValidationCache = new Map<string, boolean>();

  // Regex caches
  public regexCache = new Map<string, RegExp>();
  public regexValidationCache = new Map<string, boolean>();

  // Value processing caches
  public valueTranslationCache = new Map<string, string>();
  public opaParserCache = new Map<string, string>();

  // Statistics tracking
  private stats = new Map<string, ICacheStats>();

  constructor() {
    this.initializeStats();
  }

  private initializeStats(): void {
    const cacheNames = [
      'colorTransform', 'shadeTint', 'colorValidation',
      'abbreviationTraduce', 'abbreviationConvert', 'abbreviationLookup',
      'comboDecrypt', 'comboKeys', 'comboValidation',
      'breakpointLookup', 'breakpointValidation',
      'cssNameConversion', 'cssValidation',
      'parseClass', 'createdClasses', 'classValidation',
      'buttonCss', 'buttonShade', 'buttonCorrection',
      'propertyJoiner', 'propertyValidation',
      'pseudoConversion', 'pseudoValidation',
      'regex', 'regexValidation',
      'valueTranslation', 'opaParser'
    ];

    cacheNames.forEach(name => {
      this.stats.set(name, {
        hits: 0,
        misses: 0,
        size: 0,
        hitRate: 0
      });
    });
  }

  /**
   * Updates cache statistics
   */
  public updateStats(cacheName: string, isHit: boolean, currentSize: number): void {
    const stat = this.stats.get(cacheName);
    if (stat) {
      if (isHit) {
        stat.hits++;
      } else {
        stat.misses++;
      }
      stat.size = currentSize;
      stat.hitRate = stat.hits / (stat.hits + stat.misses);
      this.stats.set(cacheName, stat);
    }
  }

  /**
   * Gets cache statistics
   */
  public getStats(cacheName?: string): Map<string, ICacheStats> | ICacheStats | undefined {
    if (cacheName) {
      return this.stats.get(cacheName);
    }
    return this.stats;
  }

  /**
   * Resets statistics for a specific cache or all caches
   */
  public resetStats(cacheName?: string): void {
    if (cacheName) {
      const stat = this.stats.get(cacheName);
      if (stat) {
        stat.hits = 0;
        stat.misses = 0;
        stat.hitRate = 0;
        this.stats.set(cacheName, stat);
      }
    } else {
      this.stats.forEach((stat, name) => {
        stat.hits = 0;
        stat.misses = 0;
        stat.hitRate = 0;
        this.stats.set(name, stat);
      });
    }
  }
}

// =============================================================================
// CACHE MANAGER CLASS
// =============================================================================

/**
 * Main cache manager with intelligent invalidation
 */
class CacheManager {
  private container = new CacheContainer();
  private configs = new Map<string, ICacheConfig>();
  private lastValuesInstance: ValuesSingleton | null = null;

  constructor() {
    this.initializeConfigs();
  }

  private initializeConfigs(): void {
    // Default configurations for different cache types
    const defaultConfigs: Record<string, ICacheConfig> = {
      // High-frequency, small data caches
      regex: { maxSize: 200, autoCleanup: true },
      cssNameConversion: { maxSize: 500, autoCleanup: true },
      
      // Medium-frequency caches
      colorTransform: { maxSize: 300, autoCleanup: true },
      abbreviationTraduce: { maxSize: 400, autoCleanup: true },
      abbreviationConvert: { maxSize: 400, autoCleanup: true },
      pseudoConversion: { maxSize: 200, autoCleanup: true },
      
      // Large result caches
      parseClass: { maxSize: 1000, autoCleanup: true },
      buttonCss: { maxSize: 500, autoCleanup: true },
      propertyJoiner: { maxSize: 600, autoCleanup: true },
      
      // Validation caches (smaller, frequent access)
      colorValidation: { maxSize: 200, autoCleanup: true },
      classValidation: { maxSize: 300, autoCleanup: true },
      comboValidation: { maxSize: 200, autoCleanup: true },
      
      // Processing caches
      valueTranslation: { maxSize: 400, autoCleanup: true },
      opaParser: { maxSize: 300, autoCleanup: true },
      comboDecrypt: { maxSize: 300, autoCleanup: true }
    };

    Object.entries(defaultConfigs).forEach(([name, config]) => {
      this.configs.set(name, config);
    });
  }

  /**
   * Gets a cache configuration
   */
  public getConfig(cacheName: string): ICacheConfig | undefined {
    return this.configs.get(cacheName);
  }

  /**
   * Updates a cache configuration
   */
  public setConfig(cacheName: string, config: ICacheConfig): void {
    this.configs.set(cacheName, config);
  }

  /**
   * Checks if cache size limit is exceeded and cleans up if needed
   */
  private cleanupIfNeeded(cache: Map<any, any>, cacheName: string): void {
    const config = this.configs.get(cacheName);
    if (config && config.autoCleanup && cache.size >= config.maxSize) {
      // Remove oldest 25% of entries (simple LRU approximation)
      const entriesToRemove = Math.floor(config.maxSize * 0.25);
      const iterator = cache.keys();
      for (let i = 0; i < entriesToRemove; i++) {
        const key = iterator.next().value;
        if (key !== undefined) {
          cache.delete(key);
        }
      }
    }
  }

  // =============================================================================
  // DOMAIN-SPECIFIC INVALIDATION METHODS
  // =============================================================================

  /**
   * Invalidates color-related caches
   */
  public invalidateColorCaches(): void {
    this.container.colorTransformCache.clear();
    this.container.shadeTintCache.clear();
    this.container.colorValidationCache.clear();
    this.container.buttonShadeCache.clear(); // Buttons depend on colors
    this.container.buttonCssCache.clear(); // Button CSS depends on colors
    
    // Also clear caches that might use color values
    this.container.parseClassCache.clear();
    this.container.classValidationCache.clear();
    this.container.propertyJoinerCache.clear();
    
    console.log('🎨 Color-related caches invalidated');
  }

  /**
   * Invalidates abbreviation-related caches
   */
  public invalidateAbbreviationCaches(): void {
    this.container.abbreviationTraduceCache.clear();
    this.container.abbreviationConvertCache.clear();
    // WeakMap caches will be automatically invalidated when values instance changes
    
    // Clear dependent caches
    this.container.parseClassCache.clear();
    this.container.classValidationCache.clear();
    this.container.valueTranslationCache.clear();
    this.container.opaParserCache.clear();
    
    console.log('🔤 Abbreviation-related caches invalidated');
  }

  /**
   * Invalidates combo-related caches
   */
  public invalidateComboCaches(): void {
    this.container.comboDecryptCache.clear();
    this.container.comboValidationCache.clear();
    // WeakMap caches will be automatically invalidated when values instance changes
    
    // Clear dependent caches
    this.container.parseClassCache.clear();
    this.container.classValidationCache.clear();
    
    console.log('🎯 Combo-related caches invalidated');
  }

  /**
   * Invalidates breakpoint-related caches
   */
  public invalidateBreakpointCaches(): void {
    this.container.breakpointValidationCache.clear();
    // WeakMap caches will be automatically invalidated when values instance changes
    
    // Clear dependent caches
    this.container.parseClassCache.clear();
    this.container.classValidationCache.clear();
    
    console.log('📱 Breakpoint-related caches invalidated');
  }

  /**
   * Invalidates CSS processing caches
   */
  public invalidateCssNameCaches(): void {
    this.container.cssNameConversionCache.clear();
    this.container.cssValidationCache.clear();
    
    // Clear dependent caches
    this.container.parseClassCache.clear();
    this.container.classValidationCache.clear();
    this.container.propertyJoinerCache.clear();
    
    console.log('🎨 CSS name-related caches invalidated');
  }

  /**
   * Invalidates class processing caches
   */
  public invalidateClassCaches(): void {
    this.container.parseClassCache.clear();
    this.container.classValidationCache.clear();
    // WeakMap caches will be automatically invalidated when values instance changes
    
    console.log('🏷️ Class-related caches invalidated');
  }

  /**
   * Invalidates pseudo-class caches
   */
  public invalidatePseudoCaches(): void {
    this.container.pseudoConversionCache.clear();
    this.container.pseudoValidationCache.clear();
    
    // Clear dependent caches
    this.container.parseClassCache.clear();
    this.container.classValidationCache.clear();
    
    console.log('🎭 Pseudo-class caches invalidated');
  }

  /**
   * Invalidates regex caches
   */
  public invalidateRegexCaches(): void {
    this.container.regexCache.clear();
    this.container.regexValidationCache.clear();
    
    console.log('🔍 Regex caches invalidated');
  }

  /**
   * Invalidates all caches
   */
  public invalidateAllCaches(): void {
    // Clear all Map-based caches
    Object.values(this.container).forEach(cache => {
      if (cache instanceof Map) {
        cache.clear();
      }
    });
    
    // Reset statistics
    this.container.resetStats();
    
    console.log('🧹 All caches invalidated');
  }

  // =============================================================================
  // EVENT-BASED INVALIDATION
  // =============================================================================

  /**
   * Handles cache invalidation based on specific events
   */
  public handleInvalidationEvent(event: CacheInvalidationEvent): void {
    switch (event) {
      case 'pushColors':
      case 'updateColor':
      case 'deleteColor':
      case 'clearAllColors':
        this.invalidateColorCaches();
        break;

      case 'pushAbreviationsValues':
      case 'pushAbreviationsClasses':
      case 'updateAbreviationsClass':
      case 'updateAbreviationsValue':
        this.invalidateAbbreviationCaches();
        break;

      case 'pushCombos':
      case 'updateCombo':
        this.invalidateComboCaches();
        break;

      case 'pushBPS':
        this.invalidateBreakpointCaches();
        break;

      case 'pushCssNamesParsed':
      case 'updateCssNamesParsed':
        this.invalidateCssNameCaches();
        break;

      case 'updateClasses':
        this.invalidateClassCaches();
        break;

      case 'pseudoChange':
        this.invalidatePseudoCaches();
        break;

      case 'valuesInstanceChange':
        this.invalidateAllCaches();
        break;

      default:
        console.warn(`Unknown invalidation event: ${event}`);
    }
  }

  /**
   * Checks if ValuesSingleton instance has changed and invalidates WeakMap caches
   */
  public checkValuesInstanceChange(values: ValuesSingleton): boolean {
    if (this.lastValuesInstance !== values) {
      this.lastValuesInstance = values;
      // WeakMap caches are automatically invalidated, but we clear others for consistency
      this.handleInvalidationEvent('valuesInstanceChange');
      return true;
    }
    return false;
  }

  // =============================================================================
  // CACHE ACCESS METHODS
  // =============================================================================

  /**
   * Gets the cache container for direct access
   */
  public getContainer(): CacheContainer {
    return this.container;
  }

  /**
   * Generic cache getter with statistics tracking
   */
  public getCacheValue<T>(cache: Map<string, T>, key: string, cacheName: string): T | undefined {
    const value = cache.get(key);
    const isHit = value !== undefined;
    this.container.updateStats(cacheName, isHit, cache.size);
    return value;
  }

  /**
   * Generic cache setter with cleanup
   */
  public setCacheValue<T>(cache: Map<string, T>, key: string, value: T, cacheName: string): void {
    cache.set(key, value);
    this.cleanupIfNeeded(cache, cacheName);
    this.container.updateStats(cacheName, false, cache.size);
  }

  /**
   * Gets all cache statistics
   */
  public getAllStats(): Map<string, ICacheStats> {
    return this.container.getStats() as Map<string, ICacheStats>;
  }

  /**
   * Gets memory usage information
   */
  public getMemoryUsage(): { totalCaches: number; totalEntries: number; estimatedMemoryKB: number } {
    let totalEntries = 0;
    let totalCaches = 0;

    Object.values(this.container).forEach(cache => {
      if (cache instanceof Map) {
        totalCaches++;
        totalEntries += cache.size;
      }
    });

    // Rough estimation: 100 bytes per cache entry on average
    const estimatedMemoryKB = (totalEntries * 100) / 1024;

    return {
      totalCaches,
      totalEntries,
      estimatedMemoryKB: Math.round(estimatedMemoryKB * 100) / 100
    };
  }
}

// =============================================================================
// SINGLETON CACHE MANAGER INSTANCE
// =============================================================================

/**
 * Global cache manager instance
 */
export const cacheManager = new CacheManager();

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Invalidates caches based on domain
 */
export function invalidateCachesByDomain(domain: CacheDomain): void {
  switch (domain) {
    case 'colors':
      cacheManager.invalidateColorCaches();
      break;
    case 'abbreviations':
      cacheManager.invalidateAbbreviationCaches();
      break;
    case 'combos':
      cacheManager.invalidateComboCaches();
      break;
    case 'breakpoints':
      cacheManager.invalidateBreakpointCaches();
      break;
    case 'cssNames':
      cacheManager.invalidateCssNameCaches();
      break;
    case 'classes':
      cacheManager.invalidateClassCaches();
      break;
    case 'pseudos':
      cacheManager.invalidatePseudoCaches();
      break;
    case 'regex':
      cacheManager.invalidateRegexCaches();
      break;
    case 'all':
      cacheManager.invalidateAllCaches();
      break;
  }
}

/**
 * Handles invalidation based on method calls
 */
export function handleMethodInvalidation(methodName: CacheInvalidationEvent): void {
  cacheManager.handleInvalidationEvent(methodName);
}

/**
 * Gets cache statistics
 */
export function getCacheStatistics(): Map<string, ICacheStats> {
  return cacheManager.getAllStats();
}

/**
 * Gets memory usage information
 */
export function getCacheMemoryUsage(): { totalCaches: number; totalEntries: number; estimatedMemoryKB: number } {
  return cacheManager.getMemoryUsage();
}

/**
 * Gets the cache container for direct access (use with caution)
 */
export function getCacheContainer(): CacheContainer {
  return cacheManager.getContainer();
}

/**
 * Checks if values instance changed and handles invalidation
 */
export function checkAndHandleValuesChange(values: ValuesSingleton): boolean {
  return cacheManager.checkValuesInstanceChange(values);
}

// =============================================================================
// CACHE HELPER FUNCTIONS
// =============================================================================

/**
 * Generic cache getter with automatic statistics tracking
 */
export function getCachedValue<T>(
  cache: Map<string, T>, 
  key: string, 
  cacheName: string, 
  generator?: () => T
): T | undefined {
  let value = cacheManager.getCacheValue(cache, key, cacheName);
  
  if (value === undefined && generator) {
    value = generator();
    cacheManager.setCacheValue(cache, key, value, cacheName);
  }
  
  return value;
}

/**
 * Generic cache setter with automatic cleanup
 */
export function setCachedValue<T>(
  cache: Map<string, T>, 
  key: string, 
  value: T, 
  cacheName: string
): void {
  cacheManager.setCacheValue(cache, key, value, cacheName);
}

/**
 * Creates a cache key from multiple parameters
 */
export function createCacheKey(...parts: (string | number | boolean)[]): string {
  return parts.map(part => String(part)).join('|');
}

/**
 * Clears specific cache entries matching a pattern
 */
export function clearCachePattern<T>(cache: Map<string, T>, pattern: RegExp): void {
  const keysToDelete: string[] = [];
  
  cache.forEach((_, key) => {
    if (pattern.test(key)) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => cache.delete(key));
}
