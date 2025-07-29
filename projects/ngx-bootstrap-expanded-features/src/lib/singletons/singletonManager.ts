import { ConfigSingleton } from './configSingleton';
import { ColorsSingleton } from './colorsSingleton';
import { BreakpointsSingleton } from './breakpointsSingleton';
import { PseudosSingleton } from './pseudosSingleton';
import { AbbreviationsSingleton } from './abbreviationsSingleton';
import { CacheSingleton } from './cacheSingleton';
import { TimingSingleton } from './timingSingleton';
import { CssManagementSingleton } from './cssManagementSingleton';

/**
 * SingletonManager provides a unified interface to access all singleton instances
 * and manages their initialization and cross-dependencies.
 */
export class SingletonManager {
  private static instance: SingletonManager;
  
  // Singleton instances
  private _config: ConfigSingleton;
  private _colors: ColorsSingleton;
  private _breakpoints: BreakpointsSingleton;
  private _pseudos: PseudosSingleton;
  private _abbreviations: AbbreviationsSingleton;
  private _cache: CacheSingleton;
  private _timing: TimingSingleton;
  private _cssManagement: CssManagementSingleton;

  private constructor() {
    // Initialize all singletons
    this._config = ConfigSingleton.getInstance();
    this._colors = ColorsSingleton.getInstance();
    this._breakpoints = BreakpointsSingleton.getInstance();
    this._pseudos = PseudosSingleton.getInstance();
    this._abbreviations = AbbreviationsSingleton.getInstance();
    this._cache = CacheSingleton.getInstance();
    this._timing = TimingSingleton.getInstance();
    this._cssManagement = CssManagementSingleton.getInstance();
    
    this.initializeCrossDependencies();
  }

  public static getInstance(): SingletonManager {
    if (!SingletonManager.instance) {
      SingletonManager.instance = new SingletonManager();
    }
    return SingletonManager.instance;
  }

  /**
   * Initializes cross-dependencies between singletons
   */
  private initializeCrossDependencies(): void {
    // Update config's style console with actual colors
    this._config.updateStyleConsole(
      this._colors.getMysticColor(),
      this._colors.getLavenderLPColor()
    );

    // Update pseudos with the current separator
    this._pseudos.updateSeparator(this._config.separator);
  }

  // Getter methods for each singleton
  public get config(): ConfigSingleton {
    return this._config;
  }

  public get colors(): ColorsSingleton {
    return this._colors;
  }

  public get breakpoints(): BreakpointsSingleton {
    return this._breakpoints;
  }

  public get pseudos(): PseudosSingleton {
    return this._pseudos;
  }

  public get abbreviations(): AbbreviationsSingleton {
    return this._abbreviations;
  }

  public get cache(): CacheSingleton {
    return this._cache;
  }

  public get timing(): TimingSingleton {
    return this._timing;
  }

  public get cssManagement(): CssManagementSingleton {
    return this._cssManagement;
  }

  /**
   * Updates dependencies when configuration changes
   */
  public updateDependencies(): void {
    this.initializeCrossDependencies();
  }

  /**
   * Resets all singletons to their initial state
   */
  public resetAll(): void {
    this._cache.clearAllCaches();
    this._timing.resetTiming();
    this._cssManagement.clearCreatedClasses();
    this._cssManagement.clearCombos();
    this._cssManagement.clearCreatedCombos();
    this._abbreviations.clearAbbreviations();
    
    // Reinitialize cross-dependencies
    this.initializeCrossDependencies();
  }

  /**
   * Gets comprehensive statistics from all singletons
   */
  public getAllStats(): {
    cache: ReturnType<CacheSingleton['getCacheStats']>;
    timing: ReturnType<TimingSingleton['getTimingStats']>;
    management: ReturnType<CssManagementSingleton['getManagementStats']>;
    breakpoints: {
      count: number;
      names: string[];
    };
    colors: {
      count: number;
    };
    pseudos: {
      classesCount: number;
      elementsCount: number;
      totalCount: number;
    };
  } {
    return {
      cache: this._cache.getCacheStats(),
      timing: this._timing.getTimingStats(),
      management: this._cssManagement.getManagementStats(),
      breakpoints: {
        count: this._breakpoints.getBreakpointNames().length,
        names: this._breakpoints.getBreakpointNames(),
      },
      colors: {
        count: this._colors.colorNames.length,
      },
      pseudos: {
        classesCount: this._pseudos.pseudoClasses.length,
        elementsCount: this._pseudos.pseudoElements.length,
        totalCount: this._pseudos.pseudos.length,
      },
    };
  }
}
