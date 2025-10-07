/* Singletons */
import { ValuesSingleton } from '../singletons/valuesSingleton';
/* Funtions */
import { console_log } from './console_log';
import { cssCreate } from './cssCreate';
/* Types */
import { TCacheOptions, TCacheOptionsPromised, TLogPartsOptions, TReturnFromChanges } from '../types';
import { manage_cache } from './manage_cache';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('manageColors', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('manageColors', toLog);
};
export const manage_colors = {
  pushColor(color: string, value: string, fromPushColors: boolean = false): TReturnFromChanges {
    try {
      const cleanedValue = value.replace(/!important|!default|(\s{2,})/g, '');
      if (!!values.commonPropertiesValuesAbreviationsValues.find(abbreviation => abbreviation === cleanedValue)) {
        const errMsg = `The color value "${cleanedValue}" is a reserved abbreviation and cannot be used for color "${color}".`;
        return { success: false, message: 'Error while pushing color.', errors: [errMsg] };
      }
      values.colors[color] = cleanedValue;
      if (!fromPushColors) {
        return afterManageColors({ [color]: cleanedValue });
      } else {
        return {
          success: true,
          data: { [color]: cleanedValue },
          message: `The color ${color} has been pushed successfully with the value ${cleanedValue}.`,
        };
      }
    } catch (err: unknown) {
      console_log.consoleLog('error', { err });
      const errors: string[] = [];
      if (err instanceof Error) {
        errors.push(`Error while pushing color "${color}": ${err.message}`);
      }
      return { success: false, message: 'Error while pushing color.', errors };
    }
  },
  pushColors(newColors: { [key: string]: string }): TReturnFromChanges {
    const errors: string[] = [];
    const managedColors: { [key: string]: string } = {};
    try {
      const keys = Object.keys(newColors);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const rawValue = newColors[key];
        try {
          const pushedColor = manage_colors.pushColor(key, rawValue, true);
          if (pushedColor.success) {
            managedColors[key] = (pushedColor.data as { [key: string]: string })[key];
          } else {
            errors.push(`Error while pushing color "${key}": ${pushedColor.message}`);
            if (pushedColor.errors && pushedColor.errors.length > 0) {
              errors.push(...pushedColor.errors);
            }
          }
        } catch (innerErr: unknown) {
          console_log.consoleLog('error', { err: innerErr });
          if (innerErr instanceof Error) {
            errors.push(`Error while processing color "${key}": ${innerErr.message}`);
          }
        }
      }

      if (Object.keys(managedColors).length > 0) {
        const result = afterManageColors(managedColors);
        if (errors.length > 0) {
          if (result.errors && result.errors.length > 0) {
            result.errors = [...result.errors, ...errors];
          } else {
            result.errors = errors;
          }
        }
        return result;
      } else {
        throw new Error('There are no colors to push.');
      }
    } catch (err: unknown) {
      console_log.consoleLog('error', { err });
      const finalErrors: string[] = [];
      if (err instanceof Error) {
        finalErrors.push(err.message);
      }
      if (errors.length > 0) {
        finalErrors.push(...errors);
      }
      return {
        success: false,
        message: 'Error while pushing colors.',
        errors: finalErrors,
      };
    }
  },
  getColors(): { [key: string]: string } {
    log(values.colors, 'colors');
    return values.colors;
  },
  getColorsNames(): string[] {
    return values.colorNames;
  },
  getColorValue(color: string): string {
    multiLog([
      [color, 'color'],
      [values.colors[color], 'colorValue'],
    ]);
    return values.colors[color];
  },
  updateColor(color: string, value: string, fromUpdateColors: boolean = false): TReturnFromChanges {
    try {
      if (values.colors[color.toString()]) {
        values.colors[color] = value.replace(/!important|!default|(\s{2,})/g, '');
      } else {
        throw new Error(`There is no color named ${color}.`);
      }
      if (!fromUpdateColors) {
        return afterManageColors({ [color]: values.colors[color] });
      } else {
        return {
          success: true,
          data: { [color]: values.colors[color] },
          message: `The color ${color} has been updated successfully with the value ${values.colors[color]}.`,
        };
      }
    } catch (err) {
      console_log.consoleLog('error', { err: err });
      return {
        success: false,
        message: 'Error while updating color.',
        errors: [(err as Error).message],
      };
    }
  },
  updateColors(colors: { [key: string]: string }): TReturnFromChanges {
    const errors: string[] = [];
    const managedColors: { [key: string]: string } = {};
    try {
      const keys = Object.keys(colors);
      if (keys.length === 0) {
        throw new Error(`There are no colors to update.`);
      }
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const rawValue = colors[key];
        try {
          const updated = manage_colors.updateColor(key, rawValue, true);
          if (updated.success) {
            managedColors[key] = (updated.data as { [key: string]: string })[key];
          } else {
            errors.push(`Error while updating color "${key}": ${updated.message}`);
            if (updated.errors && updated.errors.length > 0) {
              errors.push(...updated.errors);
            }
          }
        } catch (innerErr: unknown) {
          console_log.consoleLog('error', { err: innerErr });
          if (innerErr instanceof Error) {
            errors.push(`Error while processing color "${key}": ${innerErr.message}`);
          }
        }
      }
      if (Object.keys(managedColors).length > 0) {
        const result = afterManageColors(managedColors);
        if (errors.length > 0) {
          if (result.errors && result.errors.length > 0) {
            result.errors = [...result.errors, ...errors];
          } else {
            result.errors = errors;
          }
        }
        return result;
      } else {
        throw new Error(`There are no colors to update.`);
      }
    } catch (err) {
      console_log.consoleLog('error', { err: err });
      const finalErrors: string[] = [];
      if (err instanceof Error) {
        finalErrors.push(err.message);
      }
      if (errors.length > 0) {
        finalErrors.push(...errors);
      }
      return {
        success: false,
        message: 'Error while updating colors.',
        errors: finalErrors,
      };
    }
  },
  deleteColor(color: string): TReturnFromChanges {
    try {
      if (!!values.colors[color.toString()]) {
        delete values.colors[color];
        return afterManageColors({ [color]: values.colors[color] }, true);
      } else {
        throw new Error(`There is no color named ${color}.`);
      }
    } catch (err) {
      console_log.consoleLog('error', { err: err });
      return {
        success: false,
        message: (err as Error).message,
        errors: [(err as Error).message],
      };
    }
  },
  clearAllColors(): TReturnFromChanges {
    const oldColors = values.colors;
    values.colors = {};
    log(values.colors, 'colors');
    return afterManageColors(oldColors, true);
  },

  getColorsRegex(): RegExp {
    const sortedColorKeys: string[] = Object.keys(values.colors).sort((c1, c2) => c2.length - c1.length);
    const colorsPattern = sortedColorKeys.map(c => `(${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`).join('|');
    return new RegExp(`(?<![a-zA-Z0-9])(${colorsPattern})(?![a-zA-Z0-9])`, 'gi');
  },
};
const afterManageColors = (managedColors: { [key: string]: string }, toDelete: boolean = false): TReturnFromChanges => {
  let errors: string[] = [];
  try {
    const newColorsNames = Object.keys(managedColors);
    if (!toDelete) {
      values.colorNames = Array.from(new Set([...values.colorNames, ...newColorsNames]));
    }
    values.colorsRegex = manage_colors.getColorsRegex();
    if (values.cacheActive) {
      const newColorsValues = !toDelete ? Object.values(managedColors) : [];
      const revisionForCachedColor: string[] = [...newColorsNames, ...newColorsValues];
      const cacheSettingsToUpdate: (TCacheOptions | TCacheOptionsPromised)[] = [
        'propertyJoiner',
        'buttonCss',
        'buttonShade',
        'buttonCorrection',
        'colorTransform',
      ];
      for (let cacheSetting of cacheSettingsToUpdate) {
        manage_cache.deleteCached<string>(cacheSetting, args => {
          for (let i = 0; i < revisionForCachedColor.length; i++) {
            if (
              (args.element && args.element.includes(revisionForCachedColor[i])) ||
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
    let successDate: number | void | undefined = undefined;
    if (classesToUpdate.length > 0) {
      successDate = cssCreate.cssCreate(classesToUpdate);
    }
    if (!successDate) {
      throw new Error('No classes were updated after managing colors.');
    }
    return { success: true, message: 'Colors managed successfully' };
  } catch (error: unknown) {
    if (error instanceof Error) {
      errors.push(error.message);
    }
    return { success: false, message: 'Error while managing colors.', errors };
  }
};
