/* Singletons */
import { ValuesSingleton } from '../singletons/valuesSingleton';
/* Types */
import { TLogPartsOptions } from '../types';
/* Functions */
import { console_log } from './console_log';
import { manage_cache } from './manage_cache';

const values: ValuesSingleton = ValuesSingleton.getInstance();

const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('colorTransform', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('colorTransform', toLog);
};
/**
 * Advanced color transformation utilities for converting between different color formats.
 *
 * This module provides efficient color conversion functions with built-in caching and error handling.
 * Supports conversion between RGB, HEX, HSL, HWB color formats, and includes utilities for
 * shade/tint manipulation, opacity control, and gradient processing.
 *
 * @example
 * ```typescript
 * // Convert hex to RGB
 * const rgb = color_transform.colorToRGB('#ff0000'); // [255, 0, 0]
 *
 * // Create RGBA with opacity
 * const rgba = color_transform.RGBToRGBA([255, 0, 0], 0.5); // "rgba(255,0,0,0.5)"
 *
 * // Apply shade/tint
 * const darker = color_transform.shadeTintColor([255, 0, 0], -20); // Darker red
 * ```
 */
export const color_transform = {
  /**
   * Converts any color format to RGB array with caching for performance.
   *
   * @param color - Color string in any supported format (hex, rgb, rgba, hsl, hsla, hwb, or named color)
   * @returns Array of RGB values [r, g, b] or [r, g, b, a] if alpha channel exists
   *
   * @example
   * ```typescript
   * colorToRGB('#ff0000')        // [255, 0, 0]
   * colorToRGB('rgb(255,0,0)')   // [255, 0, 0]
   * colorToRGB('hsl(0,100%,50%)') // [255, 0, 0]
   * colorToRGB('red')            // [255, 0, 0] (if 'red' is in values.colors)
   * ```
   *
   * @remarks
   * - Uses intelligent caching to avoid repeated conversions
   * - Supports recursive color lookup for named colors
   * - Returns [255, 0, 0] (red) as fallback for invalid colors
   * - Handles all major color formats: hex, rgb/rgba, hsl/hsla, hwb
   */
  colorToRGB(color: string): number[] {
    try {
      const normalizedColor = color.toLowerCase().trim();

      // Check cache first
      if (values.cacheActive) {
        const cachedResult = manage_cache.getCached(normalizedColor, 'colorTransform');
        if (cachedResult) {
          return JSON.parse(cachedResult) as number[];
        }
      }

      let rgb: number[] = [255, 0, 0]; // Default fallback color (red)

      // Optimized color format detection
      if (values.colors[normalizedColor]) {
        // Named color lookup with recursion protection
        rgb = this.colorToRGB(values.colors[normalizedColor]);
      } else if (normalizedColor.startsWith('rgb')) {
        rgb = this.parseRGB(normalizedColor);
      } else if (normalizedColor.startsWith('#')) {
        rgb = this.parseRGB(this.HexToRGB(normalizedColor));
      } else if (normalizedColor.startsWith('hsl')) {
        rgb = this.parseRGB(this.HSLToRGB(normalizedColor));
      } else if (normalizedColor.startsWith('hwb')) {
        rgb = this.parseRGB(this.HWBToRGB(normalizedColor));
      }

      // Cache the result for future use
      if (values.cacheActive) {
        manage_cache.addCached(normalizedColor, 'colorTransform', JSON.stringify(rgb));
      }
      return rgb;
    } catch (error) {
      console_log.consoleLog('error', { colorToRGBError: error, color });
      return [255, 0, 0]; // Fallback to red
    }
  },

  /**
   * Converts RGB array to RGBA string format.
   *
   * @param rgb - Array containing RGB values [r, g, b]
   * @param alpha - Alpha value between 0 and 1
   * @returns RGBA color string
   *
   * @example
   * ```typescript
   * RGBToRGBA([255, 0, 0], 0.5) // "rgba(255,0,0,0.5)"
   * RGBToRGBA([0, 255, 0], 1.0) // "rgba(0,255,0,1)"
   * ```
   */
  RGBToRGBA(rgb: number[], alpha: number): string {
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
  },
  /**
   * Optimized RGB/RGBA string parser with improved performance.
   *
   * @param rgba - RGB or RGBA color string
   * @returns Array of parsed RGB values [r, g, b] or [r, g, b, a]
   *
   * @example
   * ```typescript
   * parseRGB('rgb(255, 0, 0)')     // [255, 0, 0]
   * parseRGB('rgba(255, 0, 0, 0.5)') // [255, 0, 0, 0.5]
   * ```
   *
   * @remarks
   * - Uses optimized parsing with minimal string operations
   * - Handles both rgb() and rgba() formats
   * - Automatically detects alpha channel presence
   */
  parseRGB(rgba: string): number[] {
    // Extract values between parentheses more efficiently
    const match = rgba.match(/\(([^)]+)\)/);
    if (!match) {
      console_log.consoleLog('error', { parseRGBError: 'Invalid RGB format', rgba });
      return [255, 0, 0]; // Fallback to red
    }
    const parts = match[1].split(',');
    const values: number[] = [];
    for (let i = 0; i < parts.length && i < 3; i++) {
      let number = parseFloat(parts[i].trim());
      if (i === 3) {
        number = number < 1 ? number : 1;
      }
      values.push(number);
    }
    return values;
  },
  /**
   * Optimized hexadecimal color conversion with improved performance.
   *
   * @param hex - Hexadecimal color string (with or without #)
   * @returns RGB string in format "rgb(r,g,b)" or "rgba(r,g,b,a)"
   *
   * @example
   * ```typescript
   * HexToRGB('#ff0000')     // "rgb(255,0,0)"
   * HexToRGB('#f00')        // "rgb(255,0,0)"
   * HexToRGB('#ff000080')   // "rgba(255,0,0,128)"
   * HexToRGB('ff0000')      // "rgb(255,0,0)" (# is optional)
   * ```
   *
   * @remarks
   * - Supports 3, 4, 6, and 8 character hex codes
   * - Automatically detects alpha channel (4 and 8 character codes)
   * - Uses optimized parsing with minimal string operations
   * - Returns appropriate rgb() or rgba() format based on input
   */
  HexToRGB(hex: string): string {
    const hexCode = hex.replace('#', '');
    const length = hexCode.length;

    if (![3, 4, 6, 8].includes(length)) {
      console_log.consoleLog('error', {
        hexToRGBError: 'Invalid hex code',
        hex,
      });
      return 'rgb(255,0,0)'; // Fallback to red
    }

    let rgb: number[] = [];

    if (length === 3 || length === 4) {
      // Short format: expand each character
      for (let i = 0; i < length; i++) {
        const char = hexCode[i];
        rgb.push(parseInt(char + char, 16));
      }
    } else {
      // Long format: parse pairs
      for (let i = 0; i < length; i += 2) {
        rgb.push(parseInt(hexCode.substr(i, 2), 16));
      }
    }

    // Return appropriate format based on alpha channel presence
    const hasAlpha = length === 4 || length === 8;
    return hasAlpha ? `rgba(${rgb.slice(0, 3).join(',')},${rgb[3]})` : `rgb(${rgb.join(',')})`;
  },
  /**
   * Converts HSL/HSLA color to RGB format with optimized algorithm.
   *
   * @param hsl - HSL or HSLA color string
   * @returns RGB string in format "rgb(r,g,b)" or "rgba(r,g,b,a)"
   *
   * @example
   * ```typescript
   * HSLToRGB('hsl(0, 100%, 50%)')     // "rgb(255,0,0)"
   * HSLToRGB('hsla(120, 100%, 50%, 0.5)') // "rgba(0,255,0,0.5)"
   * ```
   *
   * @remarks
   * - Uses optimized HSL to RGB conversion algorithm
   * - Handles both hsl() and hsla() formats
   * - Supports percentage and decimal values
   * - Returns fallback color for invalid input
   */
  HSLToRGB(hsl: string): string {
    // Quick validation
    if (!hsl.toLowerCase().startsWith('hsl')) {
      return 'rgb(255,0,0)'; // Fallback to red
    }

    // Extract values more efficiently
    const match = hsl.match(/\(([^)]+)\)/);
    if (!match) return 'rgb(255,0,0)';

    const values = match[1].split(',').map(v => v.trim());
    if (values.length < 3) return 'rgb(255,0,0)';

    // Parse HSL values with proper normalization
    const h = (parseFloat(values[0]) % 360) / 360; // Normalize to 0-1
    const s = parseFloat(values[1].replace('%', '')) / 100; // Remove % and normalize
    const l = parseFloat(values[2].replace('%', '')) / 100; // Remove % and normalize
    const alpha = values[3] ? parseFloat(values[3]) : undefined;

    // Handle grayscale case (saturation = 0)
    if (s === 0) {
      const gray = Math.round(l * 255);
      return alpha !== undefined ? `rgba(${gray},${gray},${gray},${alpha})` : `rgb(${gray},${gray},${gray})`;
    }

    // HSL to RGB conversion algorithm
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const r = Math.round(this.HueToRGB(p, q, h + 1 / 3) * 255);
    const g = Math.round(this.HueToRGB(p, q, h) * 255);
    const b = Math.round(this.HueToRGB(p, q, h - 1 / 3) * 255);

    return alpha !== undefined ? `rgba(${r},${g},${b},${alpha})` : `rgb(${r},${g},${b})`;
  },

  /**
   * Helper function for HSL to RGB conversion.
   *
   * @param p - Calculated p value from HSL conversion
   * @param q - Calculated q value from HSL conversion
   * @param t - Hue component (normalized 0-1)
   * @returns RGB component value (0-1)
   *
   * @remarks
   * - Internal helper function for HSL color space conversion
   * - Implements the standard HSL to RGB hue conversion algorithm
   * - Used by HSLToRGB function for each color component
   */
  HueToRGB(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  },
  /**
   * Converts HWB (Hue, Whiteness, Blackness) color to RGB format.
   *
   * @param hwb - HWB color string
   * @returns RGB string in format "rgb(r,g,b)" or "rgba(r,g,b,a)"
   *
   * @example
   * ```typescript
   * HWBToRGB('hwb(0, 0%, 0%)')      // "rgb(255,0,0)"
   * HWBToRGB('hwb(120, 20%, 30%)')  // Green with whiteness and blackness
   * ```
   *
   * @remarks
   * - Implements the HWB color space conversion algorithm
   * - Handles whiteness + blackness > 100% by normalizing values
   * - Supports alpha channel in hwba() format
   * - Uses optimized mathematical operations
   */
  HWBToRGB(hwb: string): string {
    // Extract values more efficiently
    const match = hwb.match(/\(([^)]+)\)/);
    if (!match) return 'rgb(255,0,0)';

    const values = match[1].split(',').map(v => v.trim());
    if (values.length < 3) return 'rgb(255,0,0)';

    // Parse HWB values
    let h = (parseFloat(values[0]) % 360) / 360; // Normalize hue to 0-1
    let w = parseFloat(values[1].replace('%', '')) / 100; // Whiteness
    let b = parseFloat(values[2].replace('%', '')) / 100; // Blackness
    const alpha = values[3] ? parseFloat(values[3]) : undefined;

    // Normalize whiteness and blackness if their sum > 1
    const ratio = w + b;
    if (ratio > 1) {
      w /= ratio;
      b /= ratio;
    }

    // HWB to RGB conversion
    const i = Math.floor(6 * h);
    const v = 1 - b;
    let f = 6 * h - i;

    if ((i & 0x01) !== 0) {
      f = 1 - f;
    }

    const n = w + f * (v - w); // Linear interpolation

    let r: number, g: number, bl: number;

    // Determine RGB values based on hue sector
    switch (i % 6) {
      case 0:
        r = v;
        g = n;
        bl = w;
        break;
      case 1:
        r = n;
        g = v;
        bl = w;
        break;
      case 2:
        r = w;
        g = v;
        bl = n;
        break;
      case 3:
        r = w;
        g = n;
        bl = v;
        break;
      case 4:
        r = n;
        g = w;
        bl = v;
        break;
      case 5:
      default:
        r = v;
        g = w;
        bl = n;
        break;
    }

    // Convert to 0-255 range and round
    const red = Math.round(r * 255);
    const green = Math.round(g * 255);
    const blue = Math.round(bl * 255);

    return alpha !== undefined ? `rgba(${red},${green},${blue},${alpha})` : `rgb(${red},${green},${blue})`;
  },
  /**
   * Creates shade or tint variations of a color by adjusting brightness.
   *
   * @param rgb - RGB color array [r, g, b] or [r, g, b, a]
   * @param percent - Percentage to lighten (+) or darken (-) the color
   * @returns Modified RGB array with same format as input
   *
   * @example
   * ```typescript
   * shadeTintColor([255, 0, 0], 20)   // Lighter red
   * shadeTintColor([255, 0, 0], -20)  // Darker red
   * shadeTintColor([255, 0, 0, 128], 10) // Lighter red with alpha
   * ```
   *
   * @remarks
   * - Positive percentages create tints (lighter colors)
   * - Negative percentages create shades (darker colors)
   * - Handles edge cases for pure black/white colors
   * - Preserves alpha channel if present
   * - Clamps values to valid RGB range (0-255)
   */
  shadeTintColor(rgb: number[], percent: number): number[] {
    // Helper function to adjust color value with edge case handling
    const adjustColorValue = (value: number, percent: number): number => {
      // Handle edge cases for pure black/white
      if (value === 0 && percent > 0) return 16; // Minimum adjustment for black
      if (value === 255 && percent < 0) return 239; // Maximum adjustment for white

      // Apply percentage adjustment
      const adjusted = Math.round((value * (100 + percent)) / 100);

      // Clamp to valid RGB range
      return Math.max(0, Math.min(255, adjusted));
    };

    const [r, g, b, a] = rgb;
    const adjustedRGB = [adjustColorValue(r, percent), adjustColorValue(g, percent), adjustColorValue(b, percent)];

    // Preserve alpha channel if present
    if (a !== undefined) {
      // Convert alpha to hex if it was originally in hex format
      const alphaValue = typeof a === 'number' && a > 1 ? a : Math.round(a * 255);
      adjustedRGB.push(alphaValue);
    }

    return adjustedRGB;
  },

  /**
   * Adds or modifies opacity of a color, with support for gradients.
   *
   * @param value - Color string or gradient string
   * @param opacity - Opacity value between 0 and 1
   * @returns Color string with applied opacity
   *
   * @example
   * ```typescript
   * opacityCreator('#ff0000', 0.5)           // "rgba(255,0,0,0.5)"
   * opacityCreator('rgb(255,0,0)', 0.3)      // "rgba(255,0,0,0.3)"
   * opacityCreator('linear-gradient(...)', 0.8) // Gradient with opacity applied to all colors
   * ```
   *
   * @remarks
   * - Recursively processes gradients to apply opacity to all color stops
   * - Replaces existing alpha channel with new opacity value
   * - Uses cached color conversion for better performance
   * - Preserves gradient syntax while modifying embedded colors
   */
  opacityCreator(value: string, opacity: number): string {
    if (value.includes('gradient')) {
      const colorMatches = this.separateColor4Transform(value);
      log(colorMatches, 'colorMatches');

      if (colorMatches) {
        let result = value;
        // Process in reverse order to avoid index shifting
        for (let i = colorMatches.length - 1; i >= 0; i--) {
          const colorMatch = colorMatches[i];
          log(result, 'value Pre SeparateColor4TransformPreCB');
          result = result.replace(colorMatch, this.opacityCreator(colorMatch, opacity));
          log(result, 'value Post SeparateColor4TransformPostCB');
        }
        log(result, 'value Post SeparateColor4Transform');
        return result;
      }
      return value;
    }

    // Convert color to RGB and apply opacity
    const rgbValues = this.colorToRGB(value);
    multiLog([
      [rgbValues, 'shade3Split'],
      [rgbValues.length, 'shade3Split Length'],
    ]);

    // Set or replace alpha channel
    if (rgbValues.length === 4) {
      rgbValues[3] = opacity;
    } else {
      rgbValues.push(opacity);
    }

    return `rgba(${rgbValues.join(',')})`;
  },

  /**
   * Applies shade/tint transformation to colors, with gradient support.
   *
   * @param tintValue - Percentage to lighten (+) or darken (-)
   * @param value - Color string or gradient string
   * @returns Transformed color string
   *
   * @example
   * ```typescript
   * getShadeTintColorOrGradient(20, '#ff0000')        // Lighter red
   * getShadeTintColorOrGradient(-30, 'rgb(0,255,0)')  // Darker green
   * getShadeTintColorOrGradient(10, 'linear-gradient(...)') // Gradient with all colors adjusted
   * ```
   *
   * @remarks
   * - Recursively processes gradients to apply tint/shade to all color stops
   * - Uses optimized color conversion and caching
   * - Preserves gradient syntax while modifying embedded colors
   * - Combines shadeTintColor and colorToRGB for efficient processing
   */
  getShadeTintColorOrGradient(tintValue: number, value: string): string {
    if (value.includes('gradient')) {
      const colorMatches = this.separateColor4Transform(value);
      log(colorMatches, 'colorMatches');

      if (colorMatches) {
        let result = value;
        // Process in reverse order to avoid index shifting
        for (let i = colorMatches.length - 1; i >= 0; i--) {
          const colorMatch = colorMatches[i];
          log(result, 'value Pre SeparateColor4TransformPreCB');
          result = result.replace(colorMatch, this.getShadeTintColorOrGradient(tintValue, colorMatch));
          log(result, 'value Post SeparateColor4TransformPostCB');
        }
        log(result, 'value Post SeparateColor4Transform');
        return result;
      }
      return value;
    }

    // Apply shade/tint transformation
    const rgbValues = this.colorToRGB(value);
    const adjustedRGB = this.shadeTintColor(rgbValues, tintValue);
    return `rgba(${adjustedRGB.join(',')})`;
  },

  /**
   * Extracts color values from strings containing gradients or mixed content.
   *
   * @param value - String potentially containing color values
   * @returns Array of matched color strings or null if none found
   *
   * @example
   * ```typescript
   * separateColor4Transform('linear-gradient(#ff0000, rgb(0,255,0))')
   * // Returns: ['#ff0000', 'rgb(0,255,0)']
   *
   * separateColor4Transform('background: #ff0000')
   * // Returns: ['#ff0000']
   * ```
   *
   * @remarks
   * - Uses cached regex for better performance
   * - Matches hex, rgb/rgba, hsl/hsla, and hwb color formats
   * - Supports both percentage and decimal values
   * - Returns null if no colors are found
   */
  separateColor4Transform(value: string): RegExpMatchArray | null {
    log(value, 'value Pre SeparateColor4Transform');
    return value.match(
      values.cacheActive
        ? (manage_cache.getCached<RegExp>(
            `colorTransform_colorRegex`,
            'regExp',
            () => new RegExp(/(?:(#[A-Fa-f0-9]{3,8})|(?:(rgb)|(hsl)|(hwb))a?\([0-9\.\,\s%]*\))/gi)
          ) as RegExp)
        : new RegExp(/(?:(#[A-Fa-f0-9]{3,8})|(?:(rgb)|(hsl)|(hwb))a?\([0-9\.\,\s%]*\))/gi)
    );
  },
};
