/*
 * Public API Surface of ngx-bootstrap-expanded-features
 */

export * from './lib/ngx-bootstrap-expanded-features.service';
export * from './lib/bef-init.directive';
export * from './lib/interfaces';
export * from './lib/types';
export * from './lib/functions/unified_cache_manager';
export * from './lib/functions/cache_examples';
// Legacy cache exports for backward compatibility
export { legacyCacheManager as cacheManager, legacyCheckAndHandleValuesChange as checkAndHandleValuesChange } from './lib/functions/unified_cache_manager';
