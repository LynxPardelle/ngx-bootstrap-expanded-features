/* Singletons */
import { ValuesSingleton } from '../singletons/valuesSingleton';
/* Funtions */
import { console_log } from './console_log';
import { cssCreate } from './cssCreate';
/* Types */
import { TLogPartsOptions } from '../types';
import {
  manage_cache,
  TCacheOptions,
  TCacheOptionsPromised,
} from './manage_cache';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('manageColors', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('manageColors', toLog);
};
export const manage_colors = {
  pushColors(newColors: {
    [key: string]: string;
  }): void | { errors: string[] } | { success: boolean; message: string } {
    const errors: string[] = [];
    try {
      Object.keys(newColors).forEach((key: string) => {
        const cleanedValue = newColors[key].replace(
          /!important|!default|(\s{2,})/g,
          ''
        );
        if (
          !!values.commonPropertiesValuesAbreviationsValues.find(
            (abbreviation) => abbreviation === cleanedValue
          )
        ) {
          errors.push(
            `The color name "${key}" is a reserved abbreviation and cannot be used.`
          );
          delete newColors[key];
        }
        values.colors[key] = cleanedValue;
      });
      afterManageColors(newColors);
    } catch (err: unknown) {
      console_log.consoleLog('error', { err: err });
      if (err instanceof Error) {
        errors.push(`Error while pushing colors: ${err.message}`);
      }
    }
    if (errors.length > 0) {
      return { errors };
    } else {
      log(values.colors, 'colors');
      return {
        success: true,
        message: 'Colors added successfully.',
      };
    }
  },
  getColors(): { [key: string]: string } {
    log(values.colors, 'colors');
    return values.colors;
  },
  getColorsNames(): string[] {
    return Object.keys(values.colors);
  },
  getColorValue(color: string): string {
    multiLog([
      [color, 'color'],
      [values.colors[color], 'colorValue'],
    ]);
    return values.colors[color];
  },
  updateColor(color: string, value: string): void {
    try {
      if (values.colors[color.toString()]) {
        values.colors[color] = value.replace(
          /!important|!default|(\s{2,})/g,
          ''
        );
      } else {
        throw new Error(`There is no color named ${color}.`);
      }
      afterManageColors({ [color]: values.colors[color] });
    } catch (err) {
      console_log.consoleLog('error', { err: err });
    }
  },
  deleteColor(color: string): void {
    try {
      if (!!values.colors[color.toString()]) {
        delete values.colors[color];
        afterManageColors({ [color]: values.colors[color] }, true);
      } else {
        throw new Error(`There is no color named ${color}.`);
      }
    } catch (err) {
      console_log.consoleLog('error', { err: err });
    }
  },
  clearAllColors(): void {
    afterManageColors(values.colors, true);
    values.colors = {};
    log(values.colors, 'colors');
  },

  getColorsRegex(): RegExp {
    const sortedColorKeys: string[] = Object.keys(values.colors).sort(
      (c1, c2) => c2.length - c1.length
    );
    const colorsPattern = sortedColorKeys
      .map((c) => `(${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`)
      .join('|');
    return new RegExp(
      `(?<![a-zA-Z0-9])(${colorsPattern})(?![a-zA-Z0-9])`,
      'gi'
    );
  },
};
const afterManageColors = (
  managedColors: { [key: string]: string },
  toDelete: boolean = false
) => {
  const newColorsNames = Object.keys(managedColors);
  if (!toDelete) {
    values.colorNames = Array.from(
      new Set([...values.colorNames, ...newColorsNames])
    );
  }
  values.colorsRegex = manage_colors.getColorsRegex();
  if (values.cacheActive) {
    const newColorsValues = !toDelete ? Object.values(managedColors) : [];
    const revisionForCachedColor: string[] = [
      ...newColorsNames,
      ...newColorsValues,
    ];
    const cacheSettingsToUpdate: (TCacheOptions | TCacheOptionsPromised)[] = [
      'propertyJoiner',
      'buttonCss',
      'buttonShade',
      'buttonCorrection',
      'colorTransform',
    ];
    for (let cacheSetting of cacheSettingsToUpdate) {
      manage_cache.deleteCached<string>(cacheSetting, (args) => {
        for (let i = 0; i < revisionForCachedColor.length; i++) {
          if (
            (args.element &&
              args.element.includes(revisionForCachedColor[i])) ||
            (args.key && args.key.includes(revisionForCachedColor[i]))
          ) {
            return { add2Remove: true };
          }
        }
        return;
      });
    }
  }

  const classesToUpdate: string[] = [];
  for (let color in managedColors) {
    for (let createdClass of values.alreadyCreatedClasses) {
      if (createdClass.includes(color)) {
        classesToUpdate.push(createdClass);
      }
    }
  }
  if (classesToUpdate.length > 0) {
    cssCreate.cssCreate(classesToUpdate);
  }
};
