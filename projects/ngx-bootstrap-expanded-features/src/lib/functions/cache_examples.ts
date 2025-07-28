/**
 * Cache Solutions Usage Examples
 * 
 * This file demonstrates how to use the centralized cache management system
 * for ngx-bootstrap-expanded-features. The cache system provides intelligent
 * invalidation based on ValuesSingleton changes.
 * 
 * @fileoverview Cache usage examples and best practices
 * @version 1.0.0
 */

import { 
  cacheManager, 
  invalidateCachesByDomain, 
  handleMethodInvalidation,
  getCacheStatistics,
  getCacheMemoryUsage,
  getCacheContainer,
  CacheDomain,
  CacheInvalidationEvent
} from './cache_solutions';

// =============================================================================
// BASIC USAGE EXAMPLES
// =============================================================================

/**
 * Example 1: Manual Cache Invalidation by Domain
 * Use this when you need to invalidate specific types of caches
 */
export function invalidateColorCaches(): void {
  // This will invalidate all color-related caches and dependent caches
  invalidateCachesByDomain('colors');
  console.log('Color caches invalidated');
}

/**
 * Example 2: Method-Based Cache Invalidation
 * This is automatically called by the service methods
 */
export function handleColorUpdate(): void {
  // This would typically be called internally by pushColors, updateColor, etc.
  handleMethodInvalidation('updateColor');
  console.log('Caches invalidated due to color update');
}

/**
 * Example 3: Get Cache Performance Statistics
 * Use this for monitoring and debugging
 */
export function getCachePerformanceReport(): void {
  const stats = getCacheStatistics();
  const memory = getCacheMemoryUsage();
  
  console.log('Cache Performance Report:');
  console.log('========================');
  console.log(`Total Caches: ${memory.totalCaches}`);
  console.log(`Total Entries: ${memory.totalEntries}`);
  console.log(`Estimated Memory: ${memory.estimatedMemoryKB} KB`);
  
  stats.forEach((stat, cacheName) => {
    console.log(`${cacheName}: ${stat.hits} hits, ${stat.misses} misses, ${(stat.hitRate * 100).toFixed(1)}% hit rate`);
  });
}

// =============================================================================
// ADVANCED USAGE EXAMPLES
// =============================================================================

/**
 * Example 4: Direct Cache Access (Advanced)
 * Only use this when you need direct control over caching
 */
export function advancedCacheUsage(): void {
  const container = getCacheContainer();
  
  // Check if a specific color transformation is cached
  const colorKey = 'rgb(255,0,0)';
  const cachedColor = container.colorTransformCache.get(colorKey);
  
  if (cachedColor) {
    console.log(`Found cached color: ${cachedColor}`);
  } else {
    console.log('Color not in cache');
  }
  
  // Get cache sizes for monitoring
  console.log('Current cache sizes:');
  console.log(`Color transform: ${container.colorTransformCache.size}`);
  console.log(`Button CSS: ${container.buttonCssCache.size}`);
  console.log(`Parse class: ${container.parseClassCache.size}`);
}

/**
 * Example 5: Cache Invalidation Patterns
 * Shows how different operations trigger cache invalidation
 */
export function demonstrateCacheInvalidationPatterns(): void {
  console.log('Cache Invalidation Patterns:');
  console.log('===========================');
  
  // Color operations invalidate:
  // - colorTransformCache
  // - shadeTintCache
  // - buttonCssCache (depends on colors)
  // - parseClassCache (may contain color-based classes)
  console.log('Color update invalidates: colors, buttons, class parsing');
  
  // Abbreviation operations invalidate:
  // - abbreviationTraduceCache
  // - abbreviationConvertCache
  // - parseClassCache (uses abbreviations)
  // - valueTranslationCache (processes abbreviations)
  console.log('Abbreviation update invalidates: abbreviations, class parsing, value translation');
  
  // Combo operations invalidate:
  // - comboDecryptCache
  // - parseClassCache (processes combos)
  console.log('Combo update invalidates: combos, class parsing');
}

// =============================================================================
// INTEGRATION EXAMPLES WITH SERVICE
// =============================================================================

/**
 * Example 6: Service Integration Pattern
 * Shows how the service methods automatically handle cache invalidation
 */
export function serviceIntegrationExample(): void {
  // When using the service, cache invalidation happens automatically:
  
  /*
  // These service calls will automatically invalidate appropriate caches:
  
  // Color operations
  service.pushColors({ newColor: '#ff0000' });     // Invalidates color domain
  service.updateColor('primary', '#0066cc');       // Invalidates color domain
  service.deleteColor('oldColor');                 // Invalidates color domain
  
  // Abbreviation operations  
  service.pushAbreviationsValues({ m: 'margin' }); // Invalidates abbreviation domain
  service.updateAbreviationsClass('p', 'padding'); // Invalidates abbreviation domain
  
  // Combo operations
  service.pushCombos({ btn: ['button', 'style'] }); // Invalidates combo domain
  service.updateCombo('card', ['card', 'component']); // Invalidates combo domain
  
  // Breakpoint operations
  service.pushBPS([{ bp: 'xl', value: '1400px' }]); // Invalidates breakpoint domain
  
  // CSS name operations
  service.pushCssNamesParsed({ 'background': 'bg' }); // Invalidates CSS name domain
  */
  
  console.log('Service methods automatically handle cache invalidation');
}

// =============================================================================
// MONITORING AND DEBUGGING
// =============================================================================

/**
 * Example 7: Cache Monitoring Function
 * Use this for continuous monitoring in development
 */
export function monitorCacheHealth(): void {
  const stats = getCacheStatistics();
  const memory = getCacheMemoryUsage();
  
  // Check for potential issues
  const lowHitRateCaches = Array.from(stats.entries())
    .filter(([_, stat]) => stat.hitRate < 0.5 && stat.hits + stat.misses > 10)
    .map(([name]) => name);
  
  if (lowHitRateCaches.length > 0) {
    console.warn('Caches with low hit rates:', lowHitRateCaches);
  }
  
  if (memory.estimatedMemoryKB > 1000) { // 1MB
    console.warn(`Cache memory usage is high: ${memory.estimatedMemoryKB} KB`);
  }
  
  // Log cache efficiency
  const totalHits = Array.from(stats.values()).reduce((sum, stat) => sum + stat.hits, 0);
  const totalMisses = Array.from(stats.values()).reduce((sum, stat) => sum + stat.misses, 0);
  const overallHitRate = totalHits / (totalHits + totalMisses);
  
  console.log(`Overall cache hit rate: ${(overallHitRate * 100).toFixed(1)}%`);
}

/**
 * Example 8: Development Helper Functions
 * Useful during development and testing
 */
export const cacheDevHelpers = {
  /**
   * Clear all caches for testing
   */
  clearAllCaches(): void {
    invalidateCachesByDomain('all');
    console.log('All caches cleared for testing');
  },
  
  /**
   * Get cache summary for debugging
   */
  getCacheSummary(): any {
    const stats = getCacheStatistics();
    const memory = getCacheMemoryUsage();
    
    return {
      memory,
      topCaches: Array.from(stats.entries())
        .sort(([,a], [,b]) => b.size - a.size)
        .slice(0, 5)
        .map(([name, stat]) => ({ name, size: stat.size, hitRate: stat.hitRate })),
      performanceIssues: Array.from(stats.entries())
        .filter(([_, stat]) => stat.hitRate < 0.3 && stat.hits + stat.misses > 5)
        .map(([name, stat]) => ({ name, hitRate: stat.hitRate, requests: stat.hits + stat.misses }))
    };
  },
  
  /**
   * Force cache warmup for testing
   */
  warmupCaches(): void {
    console.log('Cache warmup would typically involve calling key functions with common parameters');
    // This would involve calling the main functions with typical parameters
    // to populate caches before performance testing
  }
};

// =============================================================================
// CACHE INVALIDATION EVENT EXAMPLES
// =============================================================================

/**
 * Example 9: All Cache Invalidation Events
 * Reference for all available invalidation events
 */
export const cacheInvalidationExamples: Record<CacheInvalidationEvent, string> = {
  // Color events
  'pushColors': 'Adding new colors to the system',
  'updateColor': 'Modifying an existing color value',
  'deleteColor': 'Removing a color from the system',
  'clearAllColors': 'Clearing all colors',
  
  // Abbreviation events
  'pushAbreviationsValues': 'Adding new value abbreviations',
  'pushAbreviationsClasses': 'Adding new class abbreviations',
  'updateAbreviationsClass': 'Modifying class abbreviation',
  'updateAbreviationsValue': 'Modifying value abbreviation',
  
  // Combo events
  'pushCombos': 'Adding new combos',
  'updateCombo': 'Modifying existing combo',
  
  // Breakpoint events
  'pushBPS': 'Adding new breakpoints',
  
  // CSS events
  'pushCssNamesParsed': 'Adding new CSS name mappings',
  'updateCssNamesParsed': 'Modifying CSS name mapping',
  
  // Class events
  'updateClasses': 'Updating class definitions',
  
  // Pseudo events
  'pseudoChange': 'Pseudo-class configuration changed',
  
  // Global events
  'valuesInstanceChange': 'ValuesSingleton instance changed'
};

/**
 * Example 10: Cache Domain Examples
 * Reference for all available cache domains
 */
export const cacheDomainExamples: Record<CacheDomain, string[]> = {
  'colors': [
    'colorTransformCache', 
    'shadeTintCache', 
    'buttonCssCache (color-dependent)', 
    'parseClassCache (color classes)'
  ],
  'abbreviations': [
    'abbreviationTraduceCache', 
    'abbreviationConvertCache', 
    'parseClassCache (abbreviation processing)', 
    'valueTranslationCache'
  ],
  'combos': [
    'comboDecryptCache', 
    'comboKeysCache', 
    'parseClassCache (combo processing)'
  ],
  'breakpoints': [
    'breakpointLookupCache', 
    'parseClassCache (breakpoint processing)'
  ],
  'cssNames': [
    'cssNameConversionCache', 
    'parseClassCache (CSS name processing)', 
    'propertyJoinerCache'
  ],
  'classes': [
    'parseClassCache', 
    'createdClassesCache', 
    'classValidationCache'
  ],
  'pseudos': [
    'pseudoConversionCache', 
    'parseClassCache (pseudo processing)'
  ],
  'styles': [
    'buttonCssCache', 
    'propertyJoinerCache', 
    'styleValidationCache'
  ],
  'regex': [
    'regexCache (all functions)'
  ],
  'all': [
    'All cache containers and maps'
  ]
};

console.log('Cache Solutions Examples Loaded - Use the exported functions for testing and monitoring');
