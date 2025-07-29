# Singletons Module

This module contains optimized singleton classes that manage the core functionality of the ngx-bootstrap-expanded-features library. The original monolithic `ValuesSingleton` has been refactored into focused, maintainable singleton classes.

## Architecture

### Core Singletons

#### 1. **ConfigSingleton**
- **Purpose**: Manages basic configuration settings and global flags
- **Key Features**:
  - Indicator class management
  - Feature flags (debug, encryption, etc.)
  - Global separators and delimiters
  - Logging configuration

#### 2. **ColorsSingleton** 
- **Purpose**: Handles all color-related functionality
- **Key Features**:
  - Color mappings and validation
  - Color regex patterns
  - Opacity handling
  - Color transformation utilities

#### 3. **BreakpointsSingleton**
- **Purpose**: Manages responsive design breakpoints
- **Key Features**:
  - Breakpoint definitions (sm, md, lg, xl, xxl)
  - Dynamic breakpoint addition/removal
  - Breakpoint validation and sorting

#### 4. **PseudosSingleton**
- **Purpose**: Manages CSS pseudo-classes and pseudo-elements
- **Key Features**:
  - Comprehensive pseudo-class definitions
  - Pseudo-element support
  - Special delimiter handling
  - Page-specific pseudo support

#### 5. **AbbreviationsSingleton**
- **Purpose**: Handles abbreviation translations and mappings
- **Key Features**:
  - Abbreviation-to-CSS translation
  - Performance-optimized translation maps
  - Dynamic abbreviation management
  - Common properties values abbreviations

#### 6. **CacheSingleton**
- **Purpose**: Provides comprehensive caching mechanisms
- **Key Features**:
  - Multiple specialized caches
  - Automatic cache size management
  - Cache statistics and monitoring
  - Memory optimization

#### 7. **TimingSingleton**
- **Purpose**: Manages performance timing and CSS creation scheduling
- **Key Features**:
  - CSS creation timing control
  - Performance metrics tracking
  - Postponed creation management
  - Configurable timing intervals

#### 8. **CssManagementSingleton**
- **Purpose**: Handles CSS creation, management, and storage
- **Key Features**:
  - CSS rule tracking
  - Combo management
  - Stylesheet reference handling
  - CSS creation state management

### Coordination Layer

#### **SingletonManager**
- **Purpose**: Provides unified access to all singletons
- **Key Features**:
  - Cross-dependency management
  - Centralized initialization
  - Comprehensive statistics
  - Reset and cleanup functionality

## Usage Examples

### Modern Approach (Recommended)

```typescript
import { SingletonManager } from './singletons';

const manager = SingletonManager.getInstance();

// Access colors
const primaryColor = manager.colors.getColor('primary');
manager.colors.updateColors({ newColor: '#ff0000' });

// Manage breakpoints
manager.breakpoints.addBreakpoint({
  bp: 'xxxl',
  value: '1600px',
  class2Create: ''
});

// Configure settings
manager.config.setIndicatorClass('my-custom-class');
manager.config.isDebug = true;

// Use cache
const cachedValue = manager.cache.getPropertyJoiner('key');
if (!cachedValue) {
  const newValue = computeExpensiveValue();
  manager.cache.setPropertyJoiner('key', newValue);
}
```

### Legacy Compatibility

```typescript
import { ValuesSingleton } from './singletons';

const values = ValuesSingleton.getInstance();
// All existing code continues to work unchanged
const colors = values.colors;
const breakpoints = values.bps;
```

## Performance Optimizations

### Cache Management
- **Automatic sizing**: Caches automatically manage their size to prevent memory leaks
- **LRU-style cleanup**: Oldest entries are removed when cache limits are reached
- **Specialized caches**: Different cache types for different use cases

### Cross-Dependencies
- **Lazy initialization**: Singletons are initialized only when needed
- **Dependency coordination**: The SingletonManager ensures proper initialization order
- **Memory efficiency**: Shared data structures where appropriate

### Timing Control
- **Throttled CSS creation**: Prevents excessive CSS generation
- **Postponed execution**: Batches operations for better performance
- **Performance monitoring**: Built-in metrics tracking

## Testing Support

Each singleton can be tested independently:

```typescript
import { ConfigSingleton, ColorsSingleton } from './singletons';

describe('ConfigSingleton', () => {
  let config: ConfigSingleton;
  
  beforeEach(() => {
    config = ConfigSingleton.getInstance();
  });
  
  it('should set indicator class', () => {
    config.setIndicatorClass('test');
    expect(config.indicatorClass).toBe('test');
  });
});
```

## Migration Guide

See `MIGRATION.md` for detailed instructions on migrating from the original `ValuesSingleton` to the new modular structure.

## File Structure

```
singletons/
├── configSingleton.ts          # Configuration management
├── colorsSingleton.ts          # Color functionality
├── breakpointsSingleton.ts     # Breakpoint management
├── pseudosSingleton.ts         # Pseudo-classes/elements
├── abbreviationsSingleton.ts   # Translation mappings
├── cacheSingleton.ts           # Cache management
├── timingSingleton.ts          # Performance timing
├── cssManagementSingleton.ts   # CSS management
├── singletonManager.ts         # Unified manager
├── index.ts                    # Main exports
├── valuesSingleton.ts          # Legacy compatibility
├── MIGRATION.md               # Migration guide
└── README.md                  # This file
```

## Best Practices

1. **Use SingletonManager**: Always access singletons through the manager for proper coordination
2. **Leverage caching**: Use the cache singletons for performance-critical operations
3. **Monitor performance**: Use the statistics methods to monitor memory and performance
4. **Handle dependencies**: Let the SingletonManager handle cross-dependencies
5. **Test independently**: Write focused tests for individual singletons
