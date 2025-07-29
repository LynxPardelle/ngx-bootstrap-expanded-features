// Individual singleton exports
export { ConfigSingleton } from './configSingleton';
export { ColorsSingleton } from './colorsSingleton';
export { BreakpointsSingleton } from './breakpointsSingleton';
export { PseudosSingleton } from './pseudosSingleton';
export { AbbreviationsSingleton } from './abbreviationsSingleton';
export { CacheSingleton } from './cacheSingleton';
export { TimingSingleton } from './timingSingleton';
export { CssManagementSingleton } from './cssManagementSingleton';

// Main manager export
import { SingletonManager } from './singletonManager';

// Convenience function to get the singleton manager
export const getSingletonManager = () => SingletonManager.getInstance();

// Deprecated: Legacy compatibility with the old ValuesSingleton
// This provides backward compatibility for existing code
export class ValuesSingleton {
  private static instance: ValuesSingleton;
  private manager = SingletonManager.getInstance();

  // Proxy all properties to their respective singletons
  public get indicatorClass() { return this.manager.config.indicatorClass; }
  public set indicatorClass(value: string) { this.manager.config.setIndicatorClass(value); }

  public get colors() { return this.manager.colors.colors; }
  public get colorNames() { return this.manager.colors.colorNames; }
  public get colorsRegex() { return this.manager.colors.colorsRegex; }
  public get opacityRegex() { return this.manager.colors.opacityRegex; }

  public get abreviationsClasses() { return this.manager.abbreviations.abreviationsClasses; }
  public get abreviationsValues() { return this.manager.abbreviations.abreviationsValues; }

  public get combos() { return this.manager.cssManagement.combos; }
  public get combosKeys() { return this.manager.cssManagement.combosKeys; }
  public get combosCreated() { return this.manager.cssManagement.combosCreated; }
  public get combosCreatedKeys() { return this.manager.cssManagement.combosCreatedKeys; }

  public get encryptCombo() { return this.manager.config.encryptCombo; }
  public set encryptCombo(value: boolean) { this.manager.config.encryptCombo = value; }

  public get encryptComboCharacters() { return this.manager.config.encryptComboCharacters; }
  public set encryptComboCharacters(value: string) { this.manager.config.encryptComboCharacters = value; }

  public get encryptComboCreatedCharacters() { return this.manager.config.encryptComboCreatedCharacters; }
  public set encryptComboCreatedCharacters(value: string) { this.manager.config.encryptComboCreatedCharacters = value; }

  public get cssNamesParsed() { return this.manager.cssManagement.cssNamesParsed; }
  public get alreadyCreatedClasses() { return this.manager.cssManagement.alreadyCreatedClasses; }
  public get sheet() { return this.manager.cssManagement.sheet; }
  public set sheet(value: CSSStyleSheet | undefined) { if (value) this.manager.cssManagement.setStyleSheet(value); }

  public get isDebug() { return this.manager.config.isDebug; }
  public set isDebug(value: boolean) { this.manager.config.isDebug = value; }

  public get bps() { return this.manager.breakpoints.bps; }
  public get breakPoints() { return this.manager.breakpoints.breakPoints; }
  public get bpsSpecifyOptions() { return this.manager.config.bpsSpecifyOptions; }
  public get limitBPS() { return this.manager.config.limitBPS; }
  public set limitBPS(value: boolean) { this.manager.config.limitBPS = value; }

  public get styleSheetToManage() { return this.manager.config.styleSheetToManage; }
  public set styleSheetToManage(value: string) { this.manager.config.styleSheetToManage = value; }

  public get separator() { return this.manager.config.separator; }
  public set separator(value: string) { 
    this.manager.config.separator = value;
    this.manager.pseudos.updateSeparator(value);
  }

  public get specify() { return this.manager.config.specify; }
  public set specify(value: string) { this.manager.config.specify = value; }

  public get styleConsole() { return this.manager.config.styleConsole; }

  public get pseudoClasses() { return this.manager.pseudos.pseudoClasses; }
  public get pseudosHasSDED() { return this.manager.pseudos.pseudosHasSDED; }
  public get pseudoElements() { return this.manager.pseudos.pseudoElements; }
  public get pseudos() { return this.manager.pseudos.pseudos; }
  public get pageSpecificSet() { return this.manager.pseudos.pageSpecificSet; }

  public get importantActive() { return this.manager.config.importantActive; }
  public set importantActive(value: boolean) { this.manager.config.importantActive = value; }

  public get abreviationTraductors() { return this.manager.abbreviations.abreviationTraductors; }
  public get translatorMaps() { return this.manager.abbreviations.translatorMaps; }

  public get useTimer() { return this.manager.config.useTimer; }
  public set useTimer(value: boolean) { this.manager.config.useTimer = value; }

  public get lastTimeAsked2Create() { return this.manager.timing.lastTimeAsked2Create; }
  public get timesCSSCreated() { return this.manager.timing.timesCSSCreated; }
  public get timeBetweenReCreate() { return this.manager.timing.timeBetweenReCreate; }
  public set timeBetweenReCreate(value: number) { this.manager.timing.setTimeBetweenReCreate(value); }

  public get lastTimeCssCreateEnded() { return this.manager.timing.lastTimeCssCreateEnded; }
  public get creationPostponed() { return this.manager.timing.creationPostponed; }
  public get setTimeOutID() { return this.manager.timing.setTimeOutID; }

  public get useRecurrentStrategy() { return this.manager.config.useRecurrentStrategy; }
  public set useRecurrentStrategy(value: boolean) { this.manager.config.useRecurrentStrategy = value; }

  public get cssCreateIsActive() { return this.manager.cssManagement.cssCreateIsActive; }
  public set cssCreateIsActive(value: boolean) { this.manager.cssManagement.setCssCreateActive(value); }

  public get commonPropertiesValuesAbreviations() { return this.manager.abbreviations.commonPropertiesValuesAbreviations; }
  public get commonPropertiesValuesAbreviationsValues() { return this.manager.abbreviations.commonPropertiesValuesAbreviationsValues; }

  public get chosenSectionOptions() { return this.manager.config.chosenSectionOptions; }
  public set chosenSectionOptions(value) { this.manager.config.chosenSectionOptions = value; }

  // Cache properties
  public get propertyJoinerCache() { return this.manager.cache.propertyJoinerCache; }
  public get propertyJoinerCacheSize() { return this.manager.cache.propertyJoinerCacheSize; }
  public get regExpCache() { return this.manager.cache.regExpCache; }
  public get regExpCacheSize() { return this.manager.cache.regExpCacheSize; }
  public get buttonCssCache() { return this.manager.cache.buttonCssCache; }
  public get buttonCssCacheSize() { return this.manager.cache.buttonCssCacheSize; }
  public get buttonShadeCache() { return this.manager.cache.buttonShadeCache; }
  public get buttonShadeCacheSize() { return this.manager.cache.buttonShadeCacheSize; }
  public get buttonCorrectionCache() { return this.manager.cache.buttonCorrectionCache; }
  public get buttonCorrectionCacheSize() { return this.manager.cache.buttonCorrectionCacheSize; }
  public get camelCache() { return this.manager.cache.camelCache; }
  public get camelCacheSize() { return this.manager.cache.camelCacheSize; }
  public get cssValidCache() { return this.manager.cache.cssValidCache; }
  public get cssValidCacheSize() { return this.manager.cache.cssValidCacheSize; }
  public get colorTransformCache() { return this.manager.cache.colorTransformCache; }
  public get colorTransformCacheSize() { return this.manager.cache.colorTransformCacheSize; }
  public get comboDecryptCache() { return this.manager.cache.comboDecryptCache; }
  public get comboDecryptCacheSize() { return this.manager.cache.comboDecryptCacheSize; }

  private constructor() {}

  public static getInstance(): ValuesSingleton {
    if (!ValuesSingleton.instance) {
      ValuesSingleton.instance = new ValuesSingleton();
    }
    return ValuesSingleton.instance;
  }

  public init() {
    // This is now handled automatically by the SingletonManager
    this.manager.updateDependencies();
  }
}
