import { allColors } from '../values/colors';
import { manage_colors } from '../functions/manage_colors';

/**
 * ColorsSingleton manages all color-related functionality including
 * color mappings, transformations, and regex patterns.
 */
export class ColorsSingleton {
  private static instance: ColorsSingleton;

  // Color data
  public colors: { [key: string]: string } = allColors;
  public colorNames: string[] = Object.keys(this.colors);
  public colorsRegex: RegExp;

  // Opacity handling
  public opacityRegex: RegExp = new RegExp(
    /(?:([A-z0-9#]*)|(?:(rgb)|(hsl)|(hwb))a?\([0-9\.\,\s%]*\))\s?OPA\s?0\.[0-9]*/gi
  );

  private constructor() {
    this.colorsRegex = manage_colors.getColorsRegex();
  }

  public static getInstance(): ColorsSingleton {
    if (!ColorsSingleton.instance) {
      ColorsSingleton.instance = new ColorsSingleton();
    }
    return ColorsSingleton.instance;
  }

  /**
   * Gets a color value by name
   */
  public getColor(colorName: string): string | undefined {
    return this.colors[colorName];
  }

  /**
   * Checks if a color name exists
   */
  public hasColor(colorName: string): boolean {
    return colorName in this.colors;
  }

  /**
   * Updates the colors and refreshes related data
   */
  public updateColors(newColors: { [key: string]: string }): void {
    this.colors = { ...this.colors, ...newColors };
    this.colorNames = Object.keys(this.colors);
    this.colorsRegex = manage_colors.getColorsRegex();
  }

  /**
   * Gets the mystic color for console styling
   */
  public getMysticColor(): string {
    return this.colors['mystic'] || '#f0f0f0';
  }

  /**
   * Gets the lavenderLP color for console styling
   */
  public getLavenderLPColor(): string {
    return this.colors['lavenderLP'] || '#333';
  }

  /**
   * Refreshes the colors regex pattern
   */
  public refreshColorsRegex(): void {
    this.colorsRegex = manage_colors.getColorsRegex();
  }
}
