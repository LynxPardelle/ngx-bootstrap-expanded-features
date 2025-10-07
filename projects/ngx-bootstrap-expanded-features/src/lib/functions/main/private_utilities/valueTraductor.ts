import { ValuesSingleton } from '../../../singletons/valuesSingleton';
/* Functions */
import { abreviation_traductors } from '../../abreviation_traductors';
import { console_log } from '../../console_log';
import { color_transform } from './../../color_transform';
/* Types */
import { TLogPartsOptions } from '../../../types';

const values: ValuesSingleton = ValuesSingleton.getInstance();

const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('valueTraductor', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('valueTraductor', toLog);
};
/**
 * Translates and processes a value string by applying various transformations.
 *
 * This function performs the following operations:
 * 1. Applies abbreviation translation using predefined abbreviation values
 * 2. Parses the value through opacity parser (if property doesn't contain 'content')
 * 3. Identifies and replaces color names with their corresponding color values
 * 4. Converts color values to rgba format when necessary
 *
 * @param value - The string value to be translated and processed
 * @param property - The property name that determines processing behavior
 * @returns A String that resolves to the translated and processed string value
 *
 * @example
 * ```typescript
 * valueTraductor("futurePop__OPA__", "text"): rgba(151, 0, 255, 1)
 * // Returns processed string with color values converted to rgba format
 * ```
 *
 * @remarks
 * - Color matching is case-insensitive and uses word boundaries to prevent partial matches
 * - Colors are sorted by length in descending order to prioritize longer color names
 * - RGB colors without alpha are automatically converted to rgba with alpha value of 1
 * - Hex colors are converted to rgba format using the color_transform utility
 * - opacity parsing is skipped for properties containing 'content'
 */
export const valueTraductor = (value: string, property: string): string => {
  multiLog([
    [value, 'value'],
    [property, 'property'],
  ]);

  // Apply abbreviation translation
  const abbreviatedValue = values.abreviationsValues[value];
  if (abbreviatedValue) {
    value = abbreviatedValue;
  }
  value = abreviation_traductors.abreviationTraductor(value);

  log(value, 'value After AbreviationTraductor');

  // Skip opacity and color processing for content properties
  if (property.includes('content')) {
    return value;
  }

  // Process opacity syntax
  log(value, 'value Before opacity and Colors');
  value = opacityParser(value);
  log(value, 'value After opacity and Colors');

  let itHasAColorToReplace: boolean = false;
  for (let i = 0; i < values.colorNames.length; i++) {
    if (value.includes(values.colorNames[i])) {
      itHasAColorToReplace = true;
      break;
    }
  }
  if (values.colorsRegex && itHasAColorToReplace) {
    const matches = value.match(values.colorsRegex);
    log(matches, 'matches');

    if (matches) {
      // Process matches in reverse order to avoid index shifting
      for (let i = matches.length - 1; i >= 0; i--) {
        const match = matches[i];
        log(match, 'match');

        const colorKey = match.replace(/\s/g, '');
        const realColor = values.colors[colorKey];
        log(realColor, 'realColor');

        if (realColor) {
          let realColorValue: string;

          if (realColor.startsWith('rgb') && !realColor.includes('rgba')) {
            realColorValue = `rgba(${realColor}, 1)`;
          } else if (realColor.startsWith('#')) {
            realColorValue = `rgba(${color_transform.colorToRGB(realColor)}, 1)`;
          } else {
            realColorValue = realColor;
          }

          log(realColorValue, 'realColorValue');
          value = value.replace(match, realColorValue);
          log(value, 'value');
        }
      }
    }
  }

  log(value, 'value Before opacity and Colors');
  return value;
};
/**
 * Parses a string value to convert opacity color syntax to standard rgba format.
 *
 * This function searches for custom opacity syntax patterns in the input string and converts them
 * to standard CSS rgba color values. It supports various color formats including hex, rgb, hsl,
 * and hwb with opacity values.
 *
 * @param value - The input string that may contain opacity color syntax
 * @returns The parsed string with opacity syntax converted to rgba format
 *
 * @example
 * ```typescript
 * opacityParser("randNumA OPA 0.75"): "rgba(255, 0, 0, 0.75)"
 * ```
 *
 * @remarks
 * The function uses a regular expression to match patterns like:
 * - `colorValue opacityValue` where colorValue can be hex, rgb, hsl, or hwb
 * - Converts matched colors using the color_transform utility
 * - Handles color name lookups from a values.colors dictionary
 * - Processes multiple opacity occurrences efficiently
 */
export const opacityParser = (value: string): string => {
  log([[value, 'value']]);
  const hasOpacity = value.includes('OPA');
  log([hasOpacity, 'hasOpacity']);
  // Early exit if no opacity syntax present
  if (!hasOpacity) {
    return value;
  }
  const matches = value.match(values.opacityRegex);
  if (!matches) {
    return value;
  }
  // Process matches in reverse order to avoid index shifting during replacement
  let result = value;
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const parts = match.split('OPA');
    if (parts.length !== 2) continue;

    const color = parts[0].trim();
    const opacityValue = parts[1].trim();

    // Look up color in values.colors or use as-is
    const colorKey = color.replace(/\s/g, '');
    const resolvedColor = values.colors[colorKey] || color;

    // Convert to RGB and create rgba
    const rgbValues = color_transform.colorToRGB(resolvedColor);
    const rgbaColor = `rgba(${rgbValues},${opacityValue})`;

    // Replace the entire opacity expression
    result = result.replace(match, rgbaColor);
  }

  return result;
};
