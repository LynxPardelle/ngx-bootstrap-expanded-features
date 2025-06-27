/* Singletons */
import { ValuesSingleton } from "../singletons/valuesSingleton";
/* Funtions */
import { console_log } from "./console_log";
import { cssCreate } from "./cssCreate";

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const manage_colors = {
  pushColors(newColors: { [key: string]: string }): void | { errors: string[] } | { success: boolean; message: string } {
    const errors: string[] = [];
    try {
      Object.keys(newColors).forEach((key: string) => {
        const cleanedValue = newColors[key].replace(
          /!important|!default|(\s{2,})/g,
          ""
        );
        if (!!values.commonPropertiesValuesAbreviationsValues.find((abbreviation) => abbreviation === cleanedValue)) {
          errors.push(
            `The color name "${key}" is a reserved abbreviation and cannot be used.`
          );
          delete newColors[key];
        }
        values.colors[key] = cleanedValue;
      });
      for (let color in newColors) {
        let classesToUpdate: string[] = [];
        for (let createdClass of values.alreadyCreatedClasses) {
          if (createdClass.includes(color)) {
            classesToUpdate.push(createdClass);
          }
        }
        if (classesToUpdate.length > 0) {
          cssCreate.cssCreate(classesToUpdate);
        }
      }
    } catch (err: unknown) {
      console_log.consoleLog("error", { err: err });
      if (err instanceof Error) {
        errors.push(`Error while pushing colors: ${err.message}`);
      }
    }
    if (errors.length > 0) {
      return { errors };
    } else {
      console_log.consoleLog("info", { colors: values.colors });
      return {
        success: true,
        message: "Colors added successfully.",
      };
    }
  },
  getColors(): { [key: string]: string } {
    console_log.consoleLog("info", { colors: values.colors });
    return values.colors;
  },
  getColorsNames(): string[] {
    return Object.keys(values.colors);
  },
  getColorValue(color: string): string {
    console_log.consoleLog("info", {
      color: color,
      colorValue: values.colors[color],
    });
    return values.colors[color];
  },
  updateColor(color: string, value: string): void {
    try {
      if (values.colors[color.toString()]) {
        values.colors[color] = value.replace(
          /!important|!default|(\s{2,})/g,
          ""
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
      console_log.consoleLog("error", { err: err });
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
      console_log.consoleLog("error", { err: err });
    }
  },
  clearAllColors(): void {
    values.colors = {};
    console_log.consoleLog("info", { colors: values.colors });
  },
};
