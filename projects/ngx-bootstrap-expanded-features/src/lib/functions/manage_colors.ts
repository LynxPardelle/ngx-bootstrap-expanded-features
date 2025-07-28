/* Singletons */
import { ValuesSingleton } from '../singletons/valuesSingleton';
/* Funtions */
import { console_log } from './console_log';
import { cssCreate } from './cssCreate';
/* Types */
import { TLogPartsOptions } from '../types';
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
      let classesToUpdate: string[] = [];
      for (let color in newColors) {
        for (let createdClass of values.alreadyCreatedClasses) {
          if (createdClass.includes(color)) {
            classesToUpdate.push(createdClass);
          }
        }
      }
      if (classesToUpdate.length > 0) {
        cssCreate.cssCreate(classesToUpdate);
      }
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
        let classesToUpdate: string[] = [];
        for (let createdClass of values.alreadyCreatedClasses) {
          if (createdClass.includes(color)) {
            classesToUpdate.push(createdClass);
          }
        }
        if (classesToUpdate.length > 0) {
          cssCreate.cssCreate(classesToUpdate);
        }
      } else {
        throw new Error(`There is no color named ${color}.`);
      }
    } catch (err) {
      console_log.consoleLog('error', { err: err });
    }
  },
  deleteColor(color: string): void {
    try {
      if (!!values.colors[color.toString()]) {
        delete values.colors[color];
      } else {
        throw new Error(`There is no color named ${color}.`);
      }
    } catch (err) {
      console_log.consoleLog('error', { err: err });
    }
  },
  clearAllColors(): void {
    values.colors = {};
    log(values.colors, 'colors');
  },
};
