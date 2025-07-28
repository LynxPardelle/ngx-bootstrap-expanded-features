/**
 * Unified Cache Management System for ngx-bootstrap-expanded-features
 * 
 * This system combines the best features of both cache_solutions.ts and event_driven_cache.ts:
 * - Centralized cache management with all logic contained in this file
 * - Smart, selective invalidation only when data actually changes
 * - Event-driven architecture for precise cache control
 * - Automatic initialization and cleanup
 * - Performance monitoring and statistics
 * 
 * @fileoverview Unified cache management system with smart invalidation
 * @version 3.0.0
 * @author ngx-bootstrap-expanded-features
 */

import { ValuesSingleton } from '../singletons/valuesSingleton';
import { IBPS } from '../interfaces';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Cache events for precise invalidation control
 */
export type UnifiedCacheEvent = 
  | 'colors:added'
  | 'colors:updated' 
  | 'colors:deleted'
  | 'colors:cleared'
  | 'abbreviations:values-added'
  | 'abbreviations:values-updated'
  | 'abbreviations:classes-added'
  | 'abbreviations:classes-updated'
  | 'combos:added'
  | 'combos:updated'
  | 'breakpoints:added'
  | 'cssnames:added'
  | 'cssnames:updated'
  | 'classes:updated'
  | 'pseudos:changed'
  | 'instance:replaced';

/**
 * Cache configuration for different cache types
 */
interface ICacheConfig {
  maxSize: number;
  ttl?: number;
  autoCleanup: boolean;
  persistOnInstanceChange?: boolean; // Keep cache when ValuesSingleton instance changes but data is same
}

/**
 * Cache statistics for monitoring
 */
interface ICacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
  lastAccessed: number;
  created: number;
}

/**
 * Data hash tracking for change detection
 */
interface IDataHashes {
  colors: string;
  abbreviationClasses: string;
  abbreviationValues: string;
  abbreviationTraductors: string;
  combos: string;
  combosCreated: string;
  breakpoints: string;
  cssNamesParsed: string;
  pseudos: string;
}

// =============================================================================
// UNIFIED CACHE CONTAINER
// =============================================================================

/**
 * Centralized cache container with all cache types
 */
class UnifiedCacheContainer {
  // ========== COLOR CACHES ==========
  private _colorTransformCache = new Map<string, string>();
  private _shadeTintCache = new Map<string, string>();
  private _colorValidationCache = new Map<string, boolean>();
  private _buttonShadeCache = new Map<string, string>();
  private _buttonCssCache = new Map<string, string>();
  private _buttonCorrectionCache = new Map<string, string>();

  // ========== ABBREVIATION CACHES ==========
  private _abbreviationTraduceCache = new Map<string, { property: string; value: string }>();
  private _abbreviationConvertCache = new Map<string, { property: string; value: string }>();
  private _abbreviationLookupCache = new WeakMap<ValuesSingleton, Map<string, string>>();
  private _abbreviationTranslatorMaps = new Map<string, {
    traduceMap: Map<string, { regex: RegExp; replacement: string }>;
    convertMap: Map<string, { regex: RegExp; replacement: string | RegExp }>;
    isInitialized: boolean;
  }>();

  // ========== COMBO CACHES ==========
  private _comboDecryptCache = new Map<string, string>();
  private _comboKeysCache = new WeakMap<ValuesSingleton, Set<string>>();
  private _comboValidationCache = new Map<string, boolean>();

  // ========== BREAKPOINT CACHES ==========
  private _breakpointLookupCache = new WeakMap<ValuesSingleton, Set<string>>();
  private _breakpointValidationCache = new Map<string, boolean>();

  // ========== CSS PROCESSING CACHES ==========
  private _cssNameConversionCache = new Map<string, string>();
  private _cssValidationCache = new Map<string, boolean>();
  private _parseClassCache = new Map<string, any>();
  private _createdClassesCache = new WeakMap<ValuesSingleton, Set<string>>();
  private _classValidationCache = new Map<string, boolean>();

  // ========== PROPERTY CACHES ==========
  private _propertyJoinerCache = new Map<string, string>();
  private _propertyValidationCache = new Map<string, boolean>();
  private _camelCaseConversionCache = new Map<string, string>();

  // ========== PSEUDO CACHES ==========
  private _pseudoConversionCache = new Map<string, string>();
  private _pseudoValidationCache = new Map<string, boolean>();

  // ========== REGEX CACHES ==========
  private _regexCache = new Map<string, RegExp>();
  private _regexValidationCache = new Map<string, boolean>();

  // ========== VALUE PROCESSING CACHES ==========
  private _valueTranslationCache = new Map<string, string>();
  private _opaParserCache = new Map<string, string>();

  // ========== CACHE GETTERS (Public Interface) ==========
  
  // Color caches
  get colorTransformCache() { return this._colorTransformCache; }
  get shadeTintCache() { return this._shadeTintCache; }
  get colorValidationCache() { return this._colorValidationCache; }
  get buttonShadeCache() { return this._buttonShadeCache; }
  get buttonCssCache() { return this._buttonCssCache; }
  get buttonCorrectionCache() { return this._buttonCorrectionCache; }

  // Abbreviation caches
  get abbreviationTraduceCache() { return this._abbreviationTraduceCache; }
  get abbreviationConvertCache() { return this._abbreviationConvertCache; }
  get abbreviationLookupCache() { return this._abbreviationLookupCache; }
  get abbreviationTranslatorMaps() { return this._abbreviationTranslatorMaps; }

  // Combo caches
  get comboDecryptCache() { return this._comboDecryptCache; }
  get comboKeysCache() { return this._comboKeysCache; }
  get comboValidationCache() { return this._comboValidationCache; }

  // Breakpoint caches
  get breakpointLookupCache() { return this._breakpointLookupCache; }
  get breakpointValidationCache() { return this._breakpointValidationCache; }

  // CSS processing caches
  get cssNameConversionCache() { return this._cssNameConversionCache; }
  get cssValidationCache() { return this._cssValidationCache; }
  get parseClassCache() { return this._parseClassCache; }
  get createdClassesCache() { return this._createdClassesCache; }
  get classValidationCache() { return this._classValidationCache; }

  // Property caches
  get propertyJoinerCache() { return this._propertyJoinerCache; }
  get propertyValidationCache() { return this._propertyValidationCache; }
  get camelCaseConversionCache() { return this._camelCaseConversionCache; }

  // Pseudo caches
  get pseudoConversionCache() { return this._pseudoConversionCache; }
  get pseudoValidationCache() { return this._pseudoValidationCache; }

  // Regex caches
  get regexCache() { return this._regexCache; }
  get regexValidationCache() { return this._regexValidationCache; }

  // Value processing caches
  get valueTranslationCache() { return this._valueTranslationCache; }
  get opaParserCache() { return this._opaParserCache; }

  /**
   * Get cache by name for dynamic access
   */
  public getCache(cacheName: string): Map<any, any> | WeakMap<any, any> | undefined {
    const cacheProperty = `_${cacheName}`;
    return (this as any)[cacheProperty] || (this as any)[cacheName];
  }

  /**
   * Clear specific cache by name
   */
  public clearCache(cacheName: string): boolean {
    const cache = this.getCache(cacheName);
    if (cache && 'clear' in cache) {
      cache.clear();
      return true;
    }
    return false;
  }

  /**
   * Get cache size for Map-based caches
   */
  public getCacheSize(cacheName: string): number {
    const cache = this.getCache(cacheName);
    if (cache && 'size' in cache) {
      return (cache as Map<any, any>).size;
    }
    return 0;
  }

  /**
   * Get all cache names for iteration
   */
  public getAllCacheNames(): string[] {
    return [
      'colorTransformCache', 'shadeTintCache', 'colorValidationCache', 'buttonShadeCache', 'buttonCssCache', 'buttonCorrectionCache',
      'abbreviationTraduceCache', 'abbreviationConvertCache', 'abbreviationLookupCache', 'abbreviationTranslatorMaps',
      'comboDecryptCache', 'comboKeysCache', 'comboValidationCache',
      'breakpointLookupCache', 'breakpointValidationCache',
      'cssNameConversionCache', 'cssValidationCache', 'parseClassCache', 'createdClassesCache', 'classValidationCache',
      'propertyJoinerCache', 'propertyValidationCache', 'camelCaseConversionCache',
      'pseudoConversionCache', 'pseudoValidationCache',
      'regexCache', 'regexValidationCache',
      'valueTranslationCache', 'opaParserCache'
    ];
  }
}

// =============================================================================
// UNIFIED CACHE MANAGER
// =============================================================================

/**
 * Main unified cache manager with smart invalidation
 */
class UnifiedCacheManager {
  private container = new UnifiedCacheContainer();
  private configs = new Map<string, ICacheConfig>();
  private stats = new Map<string, ICacheStats>();
  private dataHashes: IDataHashes = {} as IDataHashes;
  private lastKnownInstance: ValuesSingleton | null = null;
  private eventListeners = new Set<(event: UnifiedCacheEvent, details?: any) => void>();

  constructor() {
    this.initializeConfigs();
    this.initializeStats();
  }

  // ========== INITIALIZATION ==========

  /**
   * Initialize cache configurations
   */
  private initializeConfigs(): void {
    const defaultConfigs: Record<string, ICacheConfig> = {
      // Color caches - persistent across instance changes if data is same
      colorTransformCache: { maxSize: 500, autoCleanup: true, persistOnInstanceChange: true },
      shadeTintCache: { maxSize: 300, autoCleanup: true, persistOnInstanceChange: true },
      colorValidationCache: { maxSize: 200, autoCleanup: true, persistOnInstanceChange: false },
      buttonShadeCache: { maxSize: 300, autoCleanup: true, persistOnInstanceChange: true },
      buttonCssCache: { maxSize: 500, autoCleanup: true, persistOnInstanceChange: true },
      buttonCorrectionCache: { maxSize: 300, autoCleanup: true, persistOnInstanceChange: true },

      // Abbreviation caches - some persistent, some not
      abbreviationTraduceCache: { maxSize: 400, autoCleanup: true, persistOnInstanceChange: true },
      abbreviationConvertCache: { maxSize: 400, autoCleanup: true, persistOnInstanceChange: true },
      abbreviationLookupCache: { maxSize: 0, autoCleanup: false, persistOnInstanceChange: false }, // WeakMap
      abbreviationTranslatorMaps: { maxSize: 10, autoCleanup: true, persistOnInstanceChange: true },

      // Combo caches - dependent on instance structure
      comboDecryptCache: { maxSize: 300, autoCleanup: true, persistOnInstanceChange: true },
      comboKeysCache: { maxSize: 0, autoCleanup: false, persistOnInstanceChange: false }, // WeakMap
      comboValidationCache: { maxSize: 200, autoCleanup: true, persistOnInstanceChange: false },

      // Breakpoint caches
      breakpointLookupCache: { maxSize: 0, autoCleanup: false, persistOnInstanceChange: false }, // WeakMap
      breakpointValidationCache: { maxSize: 100, autoCleanup: true, persistOnInstanceChange: false },

      // CSS processing caches - large and frequently accessed
      cssNameConversionCache: { maxSize: 500, autoCleanup: true, persistOnInstanceChange: true },
      cssValidationCache: { maxSize: 300, autoCleanup: true, persistOnInstanceChange: false },
      parseClassCache: { maxSize: 1000, autoCleanup: true, persistOnInstanceChange: false },
      createdClassesCache: { maxSize: 0, autoCleanup: false, persistOnInstanceChange: false }, // WeakMap
      classValidationCache: { maxSize: 300, autoCleanup: true, persistOnInstanceChange: false },

      // Property caches
      propertyJoinerCache: { maxSize: 600, autoCleanup: true, persistOnInstanceChange: true },
      propertyValidationCache: { maxSize: 200, autoCleanup: true, persistOnInstanceChange: false },
      camelCaseConversionCache: { maxSize: 400, autoCleanup: true, persistOnInstanceChange: true },

      // Pseudo caches
      pseudoConversionCache: { maxSize: 200, autoCleanup: true, persistOnInstanceChange: true },
      pseudoValidationCache: { maxSize: 100, autoCleanup: true, persistOnInstanceChange: false },

      // Regex caches - highly persistent
      regexCache: { maxSize: 200, autoCleanup: true, persistOnInstanceChange: true },
      regexValidationCache: { maxSize: 100, autoCleanup: true, persistOnInstanceChange: false },

      // Value processing caches
      valueTranslationCache: { maxSize: 400, autoCleanup: true, persistOnInstanceChange: true },
      opaParserCache: { maxSize: 300, autoCleanup: true, persistOnInstanceChange: true }
    };

    Object.entries(defaultConfigs).forEach(([name, config]) => {
      this.configs.set(name, config);
    });
  }

  /**
   * Initialize cache statistics tracking
   */
  private initializeStats(): void {
    this.container.getAllCacheNames().forEach(cacheName => {
      this.stats.set(cacheName, {
        hits: 0,
        misses: 0,
        size: 0,
        hitRate: 0,
        lastAccessed: Date.now(),
        created: Date.now()
      });
    });
  }

  // ========== CACHE OPERATIONS ==========

  /**
   * Generic cache getter with automatic statistics tracking
   */
  public getCacheValue<T>(
    cache: Map<string, T>, 
    key: string, 
    cacheName: string, 
    generator?: () => T
  ): T | undefined {
    const value = cache.get(key);
    const isHit = value !== undefined;
    
    this.updateStats(cacheName, isHit, cache.size);
    
    if (!isHit && generator) {
      const generatedValue = generator();
      this.setCacheValue(cache, key, generatedValue, cacheName);
      return generatedValue;
    }
    
    return value;
  }

  /**
   * Generic cache setter with automatic cleanup and statistics
   */
  public setCacheValue<T>(
    cache: Map<string, T>, 
    key: string, 
    value: T, 
    cacheName: string
  ): void {
    cache.set(key, value);
    this.cleanupIfNeeded(cache, cacheName);
    this.updateStats(cacheName, false, cache.size);
  }

  /**
   * Cleanup cache if size limit exceeded
   */
  private cleanupIfNeeded(cache: Map<any, any>, cacheName: string): void {
    const config = this.configs.get(cacheName);
    if (config && config.autoCleanup && cache.size >= config.maxSize) {
      // Remove oldest 25% of entries
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

  /**
   * Update cache statistics
   */
  private updateStats(cacheName: string, isHit: boolean, currentSize: number): void {
    const stat = this.stats.get(cacheName);
    if (stat) {
      if (isHit) {
        stat.hits++;
      } else {
        stat.misses++;
      }
      stat.size = currentSize;
      stat.hitRate = stat.hits / (stat.hits + stat.misses);
      stat.lastAccessed = Date.now();
      this.stats.set(cacheName, stat);
    }
  }

  // ========== DATA CHANGE DETECTION ==========

  /**
   * Smart validation that only invalidates when data actually changes
   */
  public validateAndInvalidate(values: ValuesSingleton): boolean {
    let hasChanges = false;

    // Check if this is a new instance
    const isNewInstance = this.lastKnownInstance !== values;
    if (isNewInstance) {
      this.lastKnownInstance = values;
    }

    // Check for actual data changes
    hasChanges = this.detectAndHandleDataChanges(values, isNewInstance);

    if (!hasChanges && isNewInstance) {
      console.log('✅ New ValuesSingleton instance but no data changes - preserving applicable caches');
    }

    return hasChanges;
  }

  /**
   * Detect specific data changes and trigger selective invalidation
   */
  private detectAndHandleDataChanges(values: ValuesSingleton, isNewInstance: boolean): boolean {
    let hasChanges = false;

    // Check colors
    const colorsHash = this.hashObject(values.colors);
    if (this.dataHashes.colors !== colorsHash) {
      this.emitCacheEvent('colors:updated', { oldHash: this.dataHashes.colors, newHash: colorsHash });
      this.dataHashes.colors = colorsHash;
      hasChanges = true;
    }

    // Check abbreviation classes
    const abbrClassesHash = this.hashObject(values.abreviationsClasses);
    if (this.dataHashes.abbreviationClasses !== abbrClassesHash) {
      this.emitCacheEvent('abbreviations:classes-updated', { oldHash: this.dataHashes.abbreviationClasses, newHash: abbrClassesHash });
      this.dataHashes.abbreviationClasses = abbrClassesHash;
      hasChanges = true;
    }

    // Check abbreviation values
    const abbrValuesHash = this.hashObject(values.abreviationsValues);
    if (this.dataHashes.abbreviationValues !== abbrValuesHash) {
      this.emitCacheEvent('abbreviations:values-updated', { oldHash: this.dataHashes.abbreviationValues, newHash: abbrValuesHash });
      this.dataHashes.abbreviationValues = abbrValuesHash;
      hasChanges = true;
    }

    // Check abbreviation traductors
    const abbrTraductorsHash = this.hashArray(values.abreviationTraductors);
    if (this.dataHashes.abbreviationTraductors !== abbrTraductorsHash) {
      this.emitCacheEvent('abbreviations:values-updated', { oldHash: this.dataHashes.abbreviationTraductors, newHash: abbrTraductorsHash });
      this.dataHashes.abbreviationTraductors = abbrTraductorsHash;
      hasChanges = true;
    }

    // Check combos
    const combosHash = this.hashObject(values.combos);
    if (this.dataHashes.combos !== combosHash) {
      this.emitCacheEvent('combos:updated', { oldHash: this.dataHashes.combos, newHash: combosHash });
      this.dataHashes.combos = combosHash;
      hasChanges = true;
    }

    // Check combos created
    const combosCreatedHash = this.hashObject(values.combosCreated);
    if (this.dataHashes.combosCreated !== combosCreatedHash) {
      this.emitCacheEvent('combos:updated', { oldHash: this.dataHashes.combosCreated, newHash: combosCreatedHash });
      this.dataHashes.combosCreated = combosCreatedHash;
      hasChanges = true;
    }

    // Check breakpoints
    const breakpointsHash = this.hashArray(values.bps);
    if (this.dataHashes.breakpoints !== breakpointsHash) {
      this.emitCacheEvent('breakpoints:added', { oldHash: this.dataHashes.breakpoints, newHash: breakpointsHash });
      this.dataHashes.breakpoints = breakpointsHash;
      hasChanges = true;
    }

    // Check CSS names parsed
    const cssNamesHash = this.hashObject(values.cssNamesParsed);
    if (this.dataHashes.cssNamesParsed !== cssNamesHash) {
      this.emitCacheEvent('cssnames:updated', { oldHash: this.dataHashes.cssNamesParsed, newHash: cssNamesHash });
      this.dataHashes.cssNamesParsed = cssNamesHash;
      hasChanges = true;
    }

    // Check pseudos
    const pseudosHash = this.hashArray(values.pseudos);
    if (this.dataHashes.pseudos !== pseudosHash) {
      this.emitCacheEvent('pseudos:changed', { oldHash: this.dataHashes.pseudos, newHash: pseudosHash });
      this.dataHashes.pseudos = pseudosHash;
      hasChanges = true;
    }

    // Handle instance replacement if needed
    if (isNewInstance && hasChanges) {
      this.emitCacheEvent('instance:replaced', { hasDataChanges: true });
    } else if (isNewInstance && !hasChanges) {
      // New instance but same data - only clear non-persistent caches
      this.handleInstanceReplacement();
    }

    return hasChanges;
  }

  /**
   * Handle instance replacement - only clear non-persistent caches
   */
  private handleInstanceReplacement(): void {
    this.container.getAllCacheNames().forEach(cacheName => {
      const config = this.configs.get(cacheName);
      if (!config?.persistOnInstanceChange) {
        this.container.clearCache(cacheName);
        console.log(`🗑️ Cleared non-persistent cache: ${cacheName}`);
      }
    });
  }

  // ========== EVENT SYSTEM ==========

  /**
   * Emit cache invalidation event
   */
  private emitCacheEvent(event: UnifiedCacheEvent, details?: any): void {
    console.log(`🚨 Cache Event: ${event}`, details);

    // Handle event-specific invalidation
    this.handleEventInvalidation(event, details);

    // Notify external listeners
    this.eventListeners.forEach(listener => {
      try {
        listener(event, details);
      } catch (error) {
        console.error('Cache event listener error:', error);
      }
    });
  }

  /**
   * Handle selective cache invalidation based on events
   */
  private handleEventInvalidation(event: UnifiedCacheEvent, details?: any): void {
    switch (event) {
      case 'colors:added':
      case 'colors:updated':
      case 'colors:deleted':
      case 'colors:cleared':
        this.invalidateColorRelatedCaches();
        break;

      case 'abbreviations:values-added':
      case 'abbreviations:values-updated':
      case 'abbreviations:classes-added':
      case 'abbreviations:classes-updated':
        this.invalidateAbbreviationRelatedCaches();
        break;

      case 'combos:added':
      case 'combos:updated':
        this.invalidateComboRelatedCaches();
        break;

      case 'breakpoints:added':
        this.invalidateBreakpointRelatedCaches();
        break;

      case 'cssnames:added':
      case 'cssnames:updated':
        this.invalidateCssNameRelatedCaches();
        break;

      case 'classes:updated':
        this.invalidateClassRelatedCaches();
        break;

      case 'pseudos:changed':
        this.invalidatePseudoRelatedCaches();
        break;

      case 'instance:replaced':
        // Already handled in handleInstanceReplacement
        break;

      default:
        console.warn(`Unknown cache event: ${event}`);
    }
  }

  // ========== SELECTIVE INVALIDATION METHODS ==========

  /**
   * Invalidate only color-related caches
   */
  private invalidateColorRelatedCaches(): void {
    const cachesToClear = [
      'colorTransformCache', 'shadeTintCache', 'colorValidationCache',
      'buttonShadeCache', 'buttonCssCache', 'buttonCorrectionCache'
    ];
    
    cachesToClear.forEach(cacheName => {
      this.container.clearCache(cacheName);
    });
    
    console.log('🎨 Color-related caches invalidated');
  }

  /**
   * Invalidate only abbreviation-related caches
   */
  private invalidateAbbreviationRelatedCaches(): void {
    const cachesToClear = [
      'abbreviationTraduceCache', 'abbreviationConvertCache', 'abbreviationTranslatorMaps'
    ];
    
    cachesToClear.forEach(cacheName => {
      this.container.clearCache(cacheName);
    });
    
    console.log('🔤 Abbreviation-related caches invalidated');
  }

  /**
   * Invalidate only combo-related caches
   */
  private invalidateComboRelatedCaches(): void {
    const cachesToClear = [
      'comboDecryptCache', 'comboValidationCache'
    ];
    
    cachesToClear.forEach(cacheName => {
      this.container.clearCache(cacheName);
    });
    
    console.log('🎯 Combo-related caches invalidated');
  }

  /**
   * Invalidate only breakpoint-related caches
   */
  private invalidateBreakpointRelatedCaches(): void {
    const cachesToClear = [
      'breakpointValidationCache'
    ];
    
    cachesToClear.forEach(cacheName => {
      this.container.clearCache(cacheName);
    });
    
    console.log('📱 Breakpoint-related caches invalidated');
  }

  /**
   * Invalidate only CSS name-related caches
   */
  private invalidateCssNameRelatedCaches(): void {
    const cachesToClear = [
      'cssNameConversionCache', 'cssValidationCache'
    ];
    
    cachesToClear.forEach(cacheName => {
      this.container.clearCache(cacheName);
    });
    
    console.log('🎨 CSS name-related caches invalidated');
  }

  /**
   * Invalidate only class-related caches
   */
  private invalidateClassRelatedCaches(): void {
    const cachesToClear = [
      'parseClassCache', 'classValidationCache'
    ];
    
    cachesToClear.forEach(cacheName => {
      this.container.clearCache(cacheName);
    });
    
    console.log('🏷️ Class-related caches invalidated');
  }

  /**
   * Invalidate only pseudo-related caches
   */
  private invalidatePseudoRelatedCaches(): void {
    const cachesToClear = [
      'pseudoConversionCache', 'pseudoValidationCache', 'regexCache'
    ];
    
    cachesToClear.forEach(cacheName => {
      this.container.clearCache(cacheName);
    });
    
    console.log('🎭 Pseudo-related caches invalidated');
  }

  // ========== UTILITY METHODS ==========

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

  // ========== PUBLIC INTERFACE ==========

  /**
   * Get the unified cache container
   */
  public getContainer(): UnifiedCacheContainer {
    return this.container;
  }

  /**
   * Add event listener for cache events
   */
  public addEventListener(listener: (event: UnifiedCacheEvent, details?: any) => void): void {
    this.eventListeners.add(listener);
  }

  /**
   * Remove event listener
   */
  public removeEventListener(listener: (event: UnifiedCacheEvent, details?: any) => void): void {
    this.eventListeners.delete(listener);
  }

  /**
   * Manually trigger cache event
   */
  public triggerEvent(event: UnifiedCacheEvent, details?: any): void {
    this.emitCacheEvent(event, details);
  }

  /**
   * Get cache statistics
   */
  public getStats(cacheName?: string): Map<string, ICacheStats> | ICacheStats | undefined {
    if (cacheName) {
      return this.stats.get(cacheName);
    }
    return this.stats;
  }

  /**
   * Get memory usage information
   */
  public getMemoryUsage(): { totalCaches: number; totalEntries: number; estimatedMemoryKB: number } {
    let totalEntries = 0;
    let totalCaches = 0;

    this.container.getAllCacheNames().forEach(cacheName => {
      const size = this.container.getCacheSize(cacheName);
      if (size > 0) {
        totalCaches++;
        totalEntries += size;
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

  /**
   * Clear all caches (emergency use only)
   */
  public clearAllCaches(): void {
    this.container.getAllCacheNames().forEach(cacheName => {
      this.container.clearCache(cacheName);
    });
    
    // Reset statistics
    this.initializeStats();
    
    console.log('🧹 All caches cleared');
  }
}

// =============================================================================
// GLOBAL UNIFIED CACHE MANAGER INSTANCE
// =============================================================================

export const unifiedCacheManager = new UnifiedCacheManager();

// =============================================================================
// PUBLIC API FUNCTIONS
// =============================================================================

/**
 * Smart cache validation - replaces both checkAndHandleValuesChange and smartCacheValidation
 */
export function smartCacheValidation(values: ValuesSingleton): boolean {
  return unifiedCacheManager.validateAndInvalidate(values);
}

/**
 * Get the unified cache container for direct access
 */
export function getUnifiedCache(): UnifiedCacheContainer {
  return unifiedCacheManager.getContainer();
}

/**
 * Manually trigger cache invalidation events
 */
export function triggerCacheEvent(event: UnifiedCacheEvent, details?: any): void {
  unifiedCacheManager.triggerEvent(event, details);
}

/**
 * Add cache event listener
 */
export function addCacheEventListener(listener: (event: UnifiedCacheEvent, details?: any) => void): void {
  unifiedCacheManager.addEventListener(listener);
}

/**
 * Remove cache event listener
 */
export function removeCacheEventListener(listener: (event: UnifiedCacheEvent, details?: any) => void): void {
  unifiedCacheManager.removeEventListener(listener);
}

/**
 * Get cache statistics for monitoring
 */
export function getCacheStats(cacheName?: string): Map<string, ICacheStats> | ICacheStats | undefined {
  return unifiedCacheManager.getStats(cacheName);
}

/**
 * Get memory usage information
 */
export function getCacheMemoryUsage(): { totalCaches: number; totalEntries: number; estimatedMemoryKB: number } {
  return unifiedCacheManager.getMemoryUsage();
}

/**
 * Generic cache getter with automatic statistics and cleanup
 */
export function getCachedValue<T>(
  cache: Map<string, T>, 
  key: string, 
  cacheName: string, 
  generator?: () => T
): T | undefined {
  return unifiedCacheManager.getCacheValue(cache, key, cacheName, generator);
}

/**
 * Generic cache setter with automatic cleanup and statistics
 */
export function setCachedValue<T>(
  cache: Map<string, T>, 
  key: string, 
  value: T, 
  cacheName: string
): void {
  unifiedCacheManager.setCacheValue(cache, key, value, cacheName);
}

/**
 * Create standardized cache key from multiple parameters
 */
export function createCacheKey(...parts: (string | number | boolean)[]): string {
  return parts.map(part => String(part)).join('|');
}

/**
 * Clear caches matching a pattern (useful for selective cleanup)
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

// =============================================================================
// CACHE INITIALIZATION HELPERS
// =============================================================================

/**
 * Initialize abbreviation translator maps - centralized in cache
 */
export function initializeAbbreviationTranslators(values: ValuesSingleton): {
  traduceMap: Map<string, { regex: RegExp; replacement: string }>;
  convertMap: Map<string, { regex: RegExp; replacement: string | RegExp }>;
  isInitialized: boolean;
} {
  const cache = getUnifiedCache();
  const instanceKey = JSON.stringify({
    traductors: values.abreviationTraductors.length,
    timestamp: Date.now()
  });

  // Check if we already have initialized maps for this data
  if (cache.abbreviationTranslatorMaps.has(instanceKey)) {
    const cached = cache.abbreviationTranslatorMaps.get(instanceKey);
    if (cached && cached.isInitialized) {
      return cached;
    }
  }

  console.log('🔄 Initializing abbreviation translation maps in unified cache...');
  
  const traduceMap = new Map<string, { regex: RegExp; replacement: string }>();
  const convertMap = new Map<string, { regex: RegExp; replacement: string | RegExp }>();
  
  // Build translation maps
  for (const abr of values.abreviationTraductors) {
    // Cache for "traduce" mode (abbreviation -> traduction)
    traduceMap.set(abr.abreviation, {
      regex: abr.abreviationRegExp,
      replacement: abr.traduction
    });
    
    // Cache for "convert" mode (traduction -> abbreviation)
    convertMap.set(abr.traduction, {
      regex: abr.traductionRegExp,
      replacement: abr.abreviation
    });
  }

  const translatorMaps = {
    traduceMap,
    convertMap,
    isInitialized: true
  };

  // Store in cache
  cache.abbreviationTranslatorMaps.set(instanceKey, translatorMaps);

  return translatorMaps;
}

// =============================================================================
// BACKWARD COMPATIBILITY
// =============================================================================

/**
 * Legacy compatibility - redirects to unified cache system
 * @deprecated Use smartCacheValidation instead
 */
export function legacyCheckAndHandleValuesChange(values: ValuesSingleton): boolean {
  return smartCacheValidation(values);
}

/**
 * Legacy cache manager compatibility
 * @deprecated Use unifiedCacheManager instead
 */
export const legacyCacheManager = {
  getContainer: () => unifiedCacheManager.getContainer(),
  invalidateCache: (domain: string) => {
    // Map legacy domain names to new events
    const eventMap: Record<string, UnifiedCacheEvent> = {
      'colors': 'colors:updated',
      'abbreviations': 'abbreviations:values-updated',
      'combos': 'combos:updated',
      'breakpoints': 'breakpoints:added',
      'cssnames': 'cssnames:updated',
      'pseudos': 'pseudos:changed',
      'classes': 'classes:updated'
    };
    
    const event = eventMap[domain];
    if (event) {
      unifiedCacheManager.triggerEvent(event);
    }
  }
};

/**
 * Enable cache monitoring for debugging
 */
export function enableCacheMonitoring(): void {
  addCacheEventListener((event, details) => {
    console.log(`📊 Unified Cache Event Monitoring:`, {
      event,
      details,
      stats: getCacheStats(),
      memory: getCacheMemoryUsage(),
      timestamp: new Date().toISOString()
    });
  });
  
  console.log('🔍 Unified cache monitoring enabled');
}

/**
 * Log current cache state for debugging
 */
export function logCacheState(): void {
  const stats = getCacheStats() as Map<string, ICacheStats>;
  const memory = getCacheMemoryUsage();
  
  console.group('🗄️ Unified Cache State Report');
  console.log('📊 Cache Statistics:', stats);
  console.log('🗃️ Memory Usage:', memory);
  console.log('🕐 Generated at:', new Date().toISOString());
  console.groupEnd();
}
