/**
 * CacheSingleton manages various cache instances used throughout
 * the library for performance optimization.
 */
export class CacheSingleton {
  private static instance: CacheSingleton;

  // Property joiner cache
  public propertyJoinerCache: Map<string, string> = new Map();
  public propertyJoinerCacheSize: number = 1000;

  // Regular expression cache
  public regExpCache: Map<string, RegExp> = new Map();
  public regExpCacheSize: number = 1000;

  // Button CSS cache
  public buttonCssCache: Map<string, string> = new Map();
  public buttonCssCacheSize: number = 1000;

  // Button shade cache
  public buttonShadeCache: Map<string, string> = new Map();
  public buttonShadeCacheSize: number = 1000;

  // Button correction cache
  public buttonCorrectionCache: Map<string, string> = new Map();
  public buttonCorrectionCacheSize: number = 1000;

  // Camel case cache
  public camelCache: Map<string, string> = new Map();
  public camelCacheSize: number = 1000;

  // CSS validation cache
  public cssValidCache: Map<string, boolean> = new Map();
  public cssValidCacheSize: number = 1000;

  // Color transformation cache
  public colorTransformCache: Map<string, string> = new Map();
  public colorTransformCacheSize: number = 1000;

  // Combo decryption cache
  public comboDecryptCache: Map<string, string> = new Map();
  public comboDecryptCacheSize: number = 1000;

  private constructor() {}

  public static getInstance(): CacheSingleton {
    if (!CacheSingleton.instance) {
      CacheSingleton.instance = new CacheSingleton();
    }
    return CacheSingleton.instance;
  }

  /**
   * Manages cache size by removing oldest entries when limit is reached
   */
  private manageCacheSize<K, V>(cache: Map<K, V>, maxSize: number): void {
    if (cache.size >= maxSize) {
      const keysToDelete = Array.from(cache.keys()).slice(0, Math.floor(maxSize * 0.2));
      keysToDelete.forEach(key => cache.delete(key));
    }
  }

  /**
   * Property joiner cache methods
   */
  public getPropertyJoiner(key: string): string | undefined {
    return this.propertyJoinerCache.get(key);
  }

  public setPropertyJoiner(key: string, value: string): void {
    this.manageCacheSize(this.propertyJoinerCache, this.propertyJoinerCacheSize);
    this.propertyJoinerCache.set(key, value);
  }

  /**
   * Regular expression cache methods
   */
  public getRegExp(key: string): RegExp | undefined {
    return this.regExpCache.get(key);
  }

  public setRegExp(key: string, value: RegExp): void {
    this.manageCacheSize(this.regExpCache, this.regExpCacheSize);
    this.regExpCache.set(key, value);
  }

  /**
   * Button CSS cache methods
   */
  public getButtonCss(key: string): string | undefined {
    return this.buttonCssCache.get(key);
  }

  public setButtonCss(key: string, value: string): void {
    this.manageCacheSize(this.buttonCssCache, this.buttonCssCacheSize);
    this.buttonCssCache.set(key, value);
  }

  /**
   * Button shade cache methods
   */
  public getButtonShade(key: string): string | undefined {
    return this.buttonShadeCache.get(key);
  }

  public setButtonShade(key: string, value: string): void {
    this.manageCacheSize(this.buttonShadeCache, this.buttonShadeCacheSize);
    this.buttonShadeCache.set(key, value);
  }

  /**
   * Button correction cache methods
   */
  public getButtonCorrection(key: string): string | undefined {
    return this.buttonCorrectionCache.get(key);
  }

  public setButtonCorrection(key: string, value: string): void {
    this.manageCacheSize(this.buttonCorrectionCache, this.buttonCorrectionCacheSize);
    this.buttonCorrectionCache.set(key, value);
  }

  /**
   * Camel case cache methods
   */
  public getCamel(key: string): string | undefined {
    return this.camelCache.get(key);
  }

  public setCamel(key: string, value: string): void {
    this.manageCacheSize(this.camelCache, this.camelCacheSize);
    this.camelCache.set(key, value);
  }

  /**
   * CSS validation cache methods
   */
  public getCssValid(key: string): boolean | undefined {
    return this.cssValidCache.get(key);
  }

  public setCssValid(key: string, value: boolean): void {
    this.manageCacheSize(this.cssValidCache, this.cssValidCacheSize);
    this.cssValidCache.set(key, value);
  }

  /**
   * Color transformation cache methods
   */
  public getColorTransform(key: string): string | undefined {
    return this.colorTransformCache.get(key);
  }

  public setColorTransform(key: string, value: string): void {
    this.manageCacheSize(this.colorTransformCache, this.colorTransformCacheSize);
    this.colorTransformCache.set(key, value);
  }

  /**
   * Combo decryption cache methods
   */
  public getComboDecrypt(key: string): string | undefined {
    return this.comboDecryptCache.get(key);
  }

  public setComboDecrypt(key: string, value: string): void {
    this.manageCacheSize(this.comboDecryptCache, this.comboDecryptCacheSize);
    this.comboDecryptCache.set(key, value);
  }

  /**
   * Clears all caches
   */
  public clearAllCaches(): void {
    this.propertyJoinerCache.clear();
    this.regExpCache.clear();
    this.buttonCssCache.clear();
    this.buttonShadeCache.clear();
    this.buttonCorrectionCache.clear();
    this.camelCache.clear();
    this.cssValidCache.clear();
    this.colorTransformCache.clear();
    this.comboDecryptCache.clear();
  }

  /**
   * Gets cache statistics
   */
  public getCacheStats(): { [key: string]: { size: number; maxSize: number } } {
    return {
      propertyJoiner: { size: this.propertyJoinerCache.size, maxSize: this.propertyJoinerCacheSize },
      regExp: { size: this.regExpCache.size, maxSize: this.regExpCacheSize },
      buttonCss: { size: this.buttonCssCache.size, maxSize: this.buttonCssCacheSize },
      buttonShade: { size: this.buttonShadeCache.size, maxSize: this.buttonShadeCacheSize },
      buttonCorrection: { size: this.buttonCorrectionCache.size, maxSize: this.buttonCorrectionCacheSize },
      camel: { size: this.camelCache.size, maxSize: this.camelCacheSize },
      cssValid: { size: this.cssValidCache.size, maxSize: this.cssValidCacheSize },
      colorTransform: { size: this.colorTransformCache.size, maxSize: this.colorTransformCacheSize },
      comboDecrypt: { size: this.comboDecryptCache.size, maxSize: this.comboDecryptCacheSize },
    };
  }
}
