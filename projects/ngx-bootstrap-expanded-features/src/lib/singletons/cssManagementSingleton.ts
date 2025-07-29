import { cssNamesParsed } from '../values/cssNamesParsed';

/**
 * CssManagementSingleton handles CSS creation, management, and storage
 * functionality for the library.
 */
export class CssManagementSingleton {
  private static instance: CssManagementSingleton;

  // CSS Names parsed from external source
  public cssNamesParsed: { [key: string]: string | string[] } = cssNamesParsed;

  // CSS creation tracking
  public alreadyCreatedClasses: string[] = [];
  public sheet: CSSStyleSheet | undefined;
  public cssCreateIsActive: boolean = false;

  // Combos management
  public combos: { [key: string]: string[] } = {};
  public combosKeys: Set<string> = new Set(Object.keys(this.combos));
  public combosCreated: { [key: string]: string } = {};
  public combosCreatedKeys: Set<string> = new Set(Object.keys(this.combosCreated));

  private constructor() {}

  public static getInstance(): CssManagementSingleton {
    if (!CssManagementSingleton.instance) {
      CssManagementSingleton.instance = new CssManagementSingleton();
    }
    return CssManagementSingleton.instance;
  }

  /**
   * Checks if a class has already been created
   */
  public isClassCreated(className: string): boolean {
    return this.alreadyCreatedClasses.includes(className);
  }

  /**
   * Adds a class to the created classes list
   */
  public addCreatedClass(className: string): void {
    if (!this.isClassCreated(className)) {
      this.alreadyCreatedClasses.push(className);
    }
  }

  /**
   * Removes a class from the created classes list
   */
  public removeCreatedClass(className: string): void {
    const index = this.alreadyCreatedClasses.indexOf(className);
    if (index > -1) {
      this.alreadyCreatedClasses.splice(index, 1);
    }
  }

  /**
   * Clears all created classes
   */
  public clearCreatedClasses(): void {
    this.alreadyCreatedClasses = [];
  }

  /**
   * Sets the CSS stylesheet reference
   */
  public setStyleSheet(sheet: CSSStyleSheet): void {
    this.sheet = sheet;
  }

  /**
   * Gets the CSS stylesheet reference
   */
  public getStyleSheet(): CSSStyleSheet | undefined {
    return this.sheet;
  }

  /**
   * Sets CSS creation active state
   */
  public setCssCreateActive(active: boolean): void {
    this.cssCreateIsActive = active;
  }

  /**
   * Checks if CSS creation is currently active
   */
  public isCssCreateActive(): boolean {
    return this.cssCreateIsActive;
  }

  /**
   * Adds a combo
   */
  public addCombo(key: string, classes: string[]): void {
    this.combos[key] = classes;
    this.combosKeys.add(key);
  }

  /**
   * Removes a combo
   */
  public removeCombo(key: string): void {
    delete this.combos[key];
    this.combosKeys.delete(key);
  }

  /**
   * Gets a combo by key
   */
  public getCombo(key: string): string[] | undefined {
    return this.combos[key];
  }

  /**
   * Checks if a combo exists
   */
  public hasCombo(key: string): boolean {
    return this.combosKeys.has(key);
  }

  /**
   * Adds a created combo
   */
  public addCreatedCombo(key: string, cssRule: string): void {
    this.combosCreated[key] = cssRule;
    this.combosCreatedKeys.add(key);
  }

  /**
   * Removes a created combo
   */
  public removeCreatedCombo(key: string): void {
    delete this.combosCreated[key];
    this.combosCreatedKeys.delete(key);
  }

  /**
   * Gets a created combo by key
   */
  public getCreatedCombo(key: string): string | undefined {
    return this.combosCreated[key];
  }

  /**
   * Checks if a combo has been created
   */
  public hasCreatedCombo(key: string): boolean {
    return this.combosCreatedKeys.has(key);
  }

  /**
   * Clears all combos
   */
  public clearCombos(): void {
    this.combos = {};
    this.combosKeys.clear();
  }

  /**
   * Clears all created combos
   */
  public clearCreatedCombos(): void {
    this.combosCreated = {};
    this.combosCreatedKeys.clear();
  }

  /**
   * Gets a CSS name parsed value
   */
  public getCssNameParsed(key: string): string | string[] | undefined {
    return this.cssNamesParsed[key];
  }

  /**
   * Sets a CSS name parsed value
   */
  public setCssNameParsed(key: string, value: string | string[]): void {
    this.cssNamesParsed[key] = value;
  }

  /**
   * Checks if a CSS name is parsed
   */
  public hasCssNameParsed(key: string): boolean {
    return key in this.cssNamesParsed;
  }

  /**
   * Gets all combo keys as an array
   */
  public getComboKeys(): string[] {
    return Array.from(this.combosKeys);
  }

  /**
   * Gets all created combo keys as an array
   */
  public getCreatedComboKeys(): string[] {
    return Array.from(this.combosCreatedKeys);
  }

  /**
   * Gets management statistics
   */
  public getManagementStats(): {
    createdClassesCount: number;
    combosCount: number;
    createdCombosCount: number;
    cssNamesCount: number;
    cssCreateActive: boolean;
  } {
    return {
      createdClassesCount: this.alreadyCreatedClasses.length,
      combosCount: this.combosKeys.size,
      createdCombosCount: this.combosCreatedKeys.size,
      cssNamesCount: Object.keys(this.cssNamesParsed).length,
      cssCreateActive: this.cssCreateIsActive,
    };
  }
}
