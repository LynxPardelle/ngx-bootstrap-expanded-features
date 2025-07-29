# Migration Guide: ValuesSingleton Refactoring

## Overview

The `ValuesSingleton` has been refactored and split into multiple focused singleton classes for better maintainability, testability, and separation of concerns.

## New Structure

The original monolithic `ValuesSingleton` has been split into these specialized singletons:

### 1. `ConfigSingleton`
- **Purpose**: Basic configuration settings and global flags
- **Properties**: `indicatorClass`, `separator`, `isDebug`, `importantActive`, etc.

### 2. `ColorsSingleton`
- **Purpose**: Color-related functionality and regex patterns
- **Properties**: `colors`, `colorNames`, `colorsRegex`, `opacityRegex`

### 3. `BreakpointsSingleton`
- **Purpose**: Responsive design breakpoints management
- **Properties**: `bps`, `breakPoints`

### 4. `PseudosSingleton`
- **Purpose**: CSS pseudo-classes and pseudo-elements
- **Properties**: `pseudoClasses`, `pseudoElements`, `pseudos`

### 5. `AbbreviationsSingleton`
- **Purpose**: Translation mappings and abbreviation handling
- **Properties**: `abreviationTraductors`, `translatorMaps`, `abreviationsClasses`

### 6. `CacheSingleton`
- **Purpose**: Various cache management for performance
- **Properties**: All cache-related properties and methods

### 7. `TimingSingleton`
- **Purpose**: Time-related properties for performance optimization
- **Properties**: `lastTimeAsked2Create`, `timesCSSCreated`, etc.

### 8. `CssManagementSingleton`
- **Purpose**: CSS creation and management
- **Properties**: `alreadyCreatedClasses`, `combos`, `cssNamesParsed`

### 9. `SingletonManager`
- **Purpose**: Unified interface to access all singletons
- **Features**: Cross-dependency management, statistics, reset functionality

## Migration Options

### Option 1: Use the New Modular Approach (Recommended)

```typescript
import { SingletonManager } from './singletons';

const manager = SingletonManager.getInstance();

// Access specific functionality
const colors = manager.colors.colors;
const breakpoints = manager.breakpoints.bps;
const config = manager.config.indicatorClass;
```

### Option 2: Use Individual Singletons

```typescript
import { ColorsSingleton, ConfigSingleton } from './singletons';

const colors = ColorsSingleton.getInstance();
const config = ConfigSingleton.getInstance();

// Use specific singletons
const allColors = colors.colors;
const indicatorClass = config.indicatorClass;
```

### Option 3: Legacy Compatibility (Temporary)

For existing code that uses `ValuesSingleton`, a compatibility layer is provided in `./singletons/index.ts`:

```typescript
import { ValuesSingleton } from './singletons';

const values = ValuesSingleton.getInstance();
// All existing properties work as before
const colors = values.colors;
const bps = values.bps;
```

## Benefits of the New Structure

1. **Separation of Concerns**: Each singleton has a single, well-defined responsibility
2. **Better Testability**: Individual singletons can be tested in isolation
3. **Improved Maintainability**: Easier to locate and modify specific functionality
4. **Performance**: More granular cache management and optimizations
5. **Type Safety**: Better TypeScript support with focused interfaces
6. **Extensibility**: Easier to add new functionality without affecting existing code

## Breaking Changes

None - the original `ValuesSingleton` interface is preserved through the compatibility layer.

## Performance Improvements

- **Cache Management**: More sophisticated cache sizing and cleanup
- **Cross-Dependencies**: Optimized initialization order
- **Memory Usage**: Better memory management with focused responsibilities

## Best Practices

1. **Use SingletonManager**: For most use cases, use the `SingletonManager` for coordinated access
2. **Avoid Direct Singleton Access**: Prefer accessing through the manager to ensure proper initialization
3. **Cache Awareness**: Use the cache methods provided by `CacheSingleton` for performance-critical operations
4. **Statistics Monitoring**: Use `getAllStats()` to monitor performance and memory usage

## Example Usage

```typescript
import { getSingletonManager } from './singletons';

const manager = getSingletonManager();

// Access colors
const primaryColor = manager.colors.getColor('primary');

// Manage breakpoints
manager.breakpoints.addBreakpoint({
  bp: 'xxxl',
  value: '1600px',
  class2Create: ''
});

// Cache management
const cachedValue = manager.cache.getPropertyJoiner('key');
if (!cachedValue) {
  const newValue = computeExpensiveValue();
  manager.cache.setPropertyJoiner('key', newValue);
}

// Get comprehensive statistics
const stats = manager.getAllStats();
console.log('Performance Stats:', stats);
```
