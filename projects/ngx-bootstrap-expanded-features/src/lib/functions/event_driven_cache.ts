/**
 * Event-Driven Cache Management System for ngx-bootstrap-expanded-features
 * 
 * This system provides selective cache invalidation based on specific data changes
 * rather than aggressive instance-based clearing. Caches are preserved until
 * their specific domain data actually changes.
 * 
 * @fileoverview Event-driven cache management with selective invalidation
 * @version 2.0.0
 * @author ngx-bootstrap-expanded-features
 */

import { ValuesSingleton } from '../singletons/valuesSingleton';
import { IBPS } from '../interfaces';

// =============================================================================
// EVENT-DRIVEN CACHE SYSTEM
// =============================================================================

/**
 * Cache invalidation events - only specific data changes trigger invalidation
 */
export type CacheEvent = 
  | 'colors:changed'
  | 'colors:added' 
  | 'colors:removed'
  | 'abbreviations:changed'
  | 'abbreviations:added'
  | 'combos:changed'
  | 'combos:added'
  | 'breakpoints:changed'
  | 'cssnames:changed'
  | 'pseudos:changed'
  | 'classes:cleared'
  | 'instance:created'; // Only when a completely new instance is created

/**
 * Cache domain mapping for selective invalidation
 */
export const CACHE_DOMAIN_MAP = {
  'colors:changed': ['colorTransformCache', 'shadeTintCache', 'colorValidationCache'],
  'colors:added': ['colorValidationCache'], // Only validation needs update when adding
  'colors:removed': ['colorTransformCache', 'shadeTintCache', 'colorValidationCache'],
  'abbreviations:changed': ['abbreviationTraduceCache', 'abbreviationConvertCache', 'abbreviationLookupCache'],
  'abbreviations:added': ['abbreviationLookupCache'], // Only lookup needs update when adding
  'combos:changed': ['comboDecryptCache', 'comboKeysCache', 'comboValidationCache'],
  'combos:added': ['comboKeysCache', 'comboValidationCache'],
  'breakpoints:changed': ['breakpointLookupCache', 'breakpointValidationCache'],
  'cssnames:changed': ['cssNameConversionCache', 'cssValidationCache'],
  'pseudos:changed': ['pseudoConversionCache', 'pseudoValidationCache', 'regexCache'],
  'classes:cleared': ['parseClassCache', 'createdClassesCache', 'classValidationCache'],
  'instance:created': [] // Handled specially - only clear if completely new singleton
} as const;

/**
 * Event listener type for cache invalidation
 */
type CacheEventListener = (event: CacheEvent, details?: any) => void;

/**
 * Cache container with persistent storage
 */
class EventDrivenCacheContainer {
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
  public parseClassCache = new Map<string, any>();
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

  /**
   * Get cache by name for dynamic access
   */
  public getCache(cacheName: string): Map<any, any> | WeakMap<any, any> | undefined {
    return (this as any)[cacheName];
  }

  /**
   * Clear specific cache
   */
  public clearCache(cacheName: string): void {
    const cache = this.getCache(cacheName);
    if (cache && 'clear' in cache) {
      cache.clear();
    }
  }

  /**
   * Get cache size (for Map-based caches only)
   */
  public getCacheSize(cacheName: string): number {
    const cache = this.getCache(cacheName);
    if (cache && 'size' in cache) {
      return (cache as Map<any, any>).size;
    }
    return 0;
  }
}

/**
 * Event-driven cache manager with selective invalidation
 */
class EventDrivenCacheManager {
  private container = new EventDrivenCacheContainer();
  private listeners: CacheEventListener[] = [];
  private lastKnownInstance: ValuesSingleton | null = null;
  private lastKnownDataHashes: Map<string, string> = new Map();

  /**
   * Get the cache container
   */
  public getContainer(): EventDrivenCacheContainer {
    return this.container;
  }

  /**
   * Add event listener for cache invalidation
   */
  public addEventListener(listener: CacheEventListener): void {
    this.listeners.push(listener);
  }

  /**
   * Remove event listener
   */
  public removeEventListener(listener: CacheEventListener): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Emit cache event and trigger selective invalidation
   */
  public emitEvent(event: CacheEvent, details?: any): void {
    console.log(`🗑️ Cache Event: ${event}`, details);

    // Get affected cache domains for this event
    const affectedCaches = CACHE_DOMAIN_MAP[event] || [];

    // Clear only the affected caches
    for (const cacheName of affectedCaches) {
      this.container.clearCache(cacheName);
      console.log(`🧹 Cleared cache: ${cacheName} due to event: ${event}`);
    }

    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(event, details);
      } catch (error) {
        console.error('Cache event listener error:', error);
      }
    });
  }

  /**
   * Smart cache validation - only invalidate if data actually changed
   */
  public validateAndUpdate(values: ValuesSingleton): boolean {
    let hasChanges = false;

    // Check if this is a completely new instance
    if (this.lastKnownInstance !== values) {
      console.log('🆕 New ValuesSingleton instance detected');
      this.lastKnownInstance = values;
      
      // Don't clear everything - instead check what actually changed
      hasChanges = this.detectDataChanges(values);
      
      if (!hasChanges) {
        console.log('✅ No actual data changes detected - preserving caches');
      }
      
      return hasChanges;
    }

    // Check for specific data changes
    return this.detectDataChanges(values);
  }

  /**
   * Detect actual data changes by comparing data snapshots
   */
  private detectDataChanges(values: ValuesSingleton): boolean {
    let hasChanges = false;

    // Check colors
    const colorsHash = this.hashObject(values.colors);
    if (this.lastKnownDataHashes.get('colors') !== colorsHash) {
      this.emitEvent('colors:changed', { hash: colorsHash });
      this.lastKnownDataHashes.set('colors', colorsHash);
      hasChanges = true;
    }

    // Check abbreviations
    const abbrClassesHash = this.hashObject(values.abreviationsClasses);
    const abbrValuesHash = this.hashObject(values.abreviationsValues);
    const abbrTraductorsHash = this.hashArray(values.abreviationTraductors);
    const abbrHash = abbrClassesHash + abbrValuesHash + abbrTraductorsHash;
    if (this.lastKnownDataHashes.get('abbreviations') !== abbrHash) {
      this.emitEvent('abbreviations:changed', { hash: abbrHash });
      this.lastKnownDataHashes.set('abbreviations', abbrHash);
      hasChanges = true;
    }

    // Check combos
    const combosHash = this.hashObject(values.combos);
    const combosCreatedHash = this.hashObject(values.combosCreated);
    const combosFullHash = combosHash + combosCreatedHash;
    if (this.lastKnownDataHashes.get('combos') !== combosFullHash) {
      this.emitEvent('combos:changed', { hash: combosFullHash });
      this.lastKnownDataHashes.set('combos', combosFullHash);
      hasChanges = true;
    }

    // Check breakpoints
    const bpsHash = this.hashArray(values.bps);
    if (this.lastKnownDataHashes.get('breakpoints') !== bpsHash) {
      this.emitEvent('breakpoints:changed', { hash: bpsHash });
      this.lastKnownDataHashes.set('breakpoints', bpsHash);
      hasChanges = true;
    }

    // Check CSS names
    const cssNamesHash = this.hashObject(values.cssNamesParsed);
    if (this.lastKnownDataHashes.get('cssnames') !== cssNamesHash) {
      this.emitEvent('cssnames:changed', { hash: cssNamesHash });
      this.lastKnownDataHashes.set('cssnames', cssNamesHash);
      hasChanges = true;
    }

    // Check pseudos
    const pseudosHash = this.hashArray(values.pseudos);
    if (this.lastKnownDataHashes.get('pseudos') !== pseudosHash) {
      this.emitEvent('pseudos:changed', { hash: pseudosHash });
      this.lastKnownDataHashes.set('pseudos', pseudosHash);
      hasChanges = true;
    }

    return hasChanges;
  }

  /**
   * Create hash for object comparison
   */
  private hashObject(obj: any): string {
    try {
      return JSON.stringify(obj, Object.keys(obj).sort());
    } catch {
      return String(obj);
    }
  }

  /**
   * Create hash for array comparison
   */
  private hashArray(arr: any[]): string {
    try {
      return JSON.stringify(arr);
    } catch {
      return String(arr);
    }
  }

  /**
   * Force clear specific cache domain
   */
  public clearDomain(event: CacheEvent): void {
    this.emitEvent(event);
  }

  /**
   * Get cache statistics
   */
  public getStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    
    // Get sizes for Map-based caches
    const mapCaches = [
      'colorTransformCache', 'shadeTintCache', 'colorValidationCache',
      'abbreviationTraduceCache', 'abbreviationConvertCache',
      'comboDecryptCache', 'comboValidationCache',
      'breakpointValidationCache', 'cssNameConversionCache', 'cssValidationCache',
      'parseClassCache', 'classValidationCache',
      'buttonCssCache', 'buttonShadeCache', 'buttonCorrectionCache',
      'propertyJoinerCache', 'propertyValidationCache',
      'pseudoConversionCache', 'pseudoValidationCache',
      'regexCache', 'regexValidationCache'
    ];

    mapCaches.forEach(cacheName => {
      stats[cacheName] = this.container.getCacheSize(cacheName);
    });

    return stats;
  }
}

// =============================================================================
// GLOBAL CACHE MANAGER INSTANCE
// =============================================================================

export const eventDrivenCacheManager = new EventDrivenCacheManager();

// =============================================================================
// SMART CACHE VALIDATION FUNCTION
// =============================================================================

/**
 * Smart cache validation that only invalidates when data actually changes
 * This replaces the aggressive checkAndHandleValuesChange function
 */
export function smartCacheValidation(values: ValuesSingleton): boolean {
  return eventDrivenCacheManager.validateAndUpdate(values);
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Get the event-driven cache container
 */
export function getEventDrivenCache(): EventDrivenCacheContainer {
  return eventDrivenCacheManager.getContainer();
}

/**
 * Manually trigger cache invalidation for specific domains
 */
export function invalidateCacheDomain(event: CacheEvent): void {
  eventDrivenCacheManager.clearDomain(event);
}

/**
 * Get cache statistics for monitoring
 */
export function getCacheStats(): Record<string, number> {
  return eventDrivenCacheManager.getStats();
}

/**
 * Add cache event listener for monitoring
 */
export function addCacheEventListener(listener: CacheEventListener): void {
  eventDrivenCacheManager.addEventListener(listener);
}

/**
 * Remove cache event listener
 */
export function removeCacheEventListener(listener: CacheEventListener): void {
  eventDrivenCacheManager.removeEventListener(listener);
}

// =============================================================================
// BACKWARD COMPATIBILITY
// =============================================================================

/**
 * Legacy cache manager for backward compatibility
 * @deprecated Use eventDrivenCacheManager instead
 */
export const legacyCacheManager = {
  getContainer: () => eventDrivenCacheManager.getContainer(),
  invalidateCache: (domain: string) => {
    // Map legacy domain names to new events
    const eventMap: Record<string, CacheEvent> = {
      'colors': 'colors:changed',
      'abbreviations': 'abbreviations:changed',
      'combos': 'combos:changed',
      'breakpoints': 'breakpoints:changed',
      'cssnames': 'cssnames:changed',
      'pseudos': 'pseudos:changed',
      'classes': 'classes:cleared'
    };
    
    const event = eventMap[domain];
    if (event) {
      eventDrivenCacheManager.clearDomain(event);
    }
  }
};

/**
 * Backward compatibility function - now uses smart validation
 * @deprecated Use smartCacheValidation instead
 */
export function legacyCheckAndHandleValuesChange(values: ValuesSingleton): boolean {
  return smartCacheValidation(values);
}

// =============================================================================
// CACHE MONITORING AND DEBUGGING
// =============================================================================

/**
 * Enable cache monitoring for debugging
 */
export function enableCacheMonitoring(): void {
  addCacheEventListener((event, details) => {
    console.log(`📊 Cache Event Monitoring:`, {
      event,
      details,
      stats: getCacheStats(),
      timestamp: new Date().toISOString()
    });
  });
  
  console.log('🔍 Cache monitoring enabled');
}

/**
 * Log current cache state for debugging
 */
export function logCacheState(): void {
  const stats = getCacheStats();
  const totalCachedItems = Object.values(stats).reduce((sum, count) => sum + count, 0);
  
  console.group('🗄️ Cache State Report');
  console.log('📊 Cache Statistics:', stats);
  console.log('📈 Total cached items:', totalCachedItems);
  console.log('🕐 Generated at:', new Date().toISOString());
  console.groupEnd();
}
