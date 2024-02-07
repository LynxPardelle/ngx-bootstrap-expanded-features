/* Singletons */
import { ValuesSingleton } from "../singletons/valuesSingleton";
/* Funtions */
import { console_log } from "./console_log";
import { cssCreate } from "./cssCreate";

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const manage_colors = {
  pushColors(newColors: any): void {
    try {
      Object.keys(newColors).forEach((key) => {
        values.colors[key] = newColors[key].replace(
          "!important" || "!default" || /\s+/g,
          ""
        );
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
    } catch (err) {
      console_log.consoleLog("error", { err: err });
    }
  },
  getColors(): any {
    console_log.consoleLog("info", { colors: values.colors });
    return values.colors;
  },
  getColorsNames(): string[] {
    const colorsNames: string[] = [];
    Object.keys(values.colors).forEach((key) => {
      colorsNames.push(key);
    });
    return colorsNames;
  },
  getColorValue(color: string): any {
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
          "!important" || "!default" || /\s+/g,
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
