/* Singletons */
import { ValuesSingleton } from "../singletons/valuesSingleton";
/* Funtions */
import { console_log } from "./console_log";
import { cssCreate } from "./cssCreate";

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const manage_CSSNamesParsed = {
  pushCssNamesParsed(cssNamesParsed: any): void {
    try {
      Object.keys(cssNamesParsed).forEach((key) => {
        values.cssNamesParsed[key] = cssNamesParsed[key];
      });
      cssCreate.cssCreate();
    } catch (err) {
      console_log.consoleLog("error", { err: err });
    }
  },
  getCssNamesParsed(): any {
    console_log.consoleLog("info", { cssNamesParsed: values.cssNamesParsed });
    return values.cssNamesParsed;
  },
  updateCssNamesParsed(cssNameParsed: string, value: string): void {
    try {
      if (values.cssNamesParsed[cssNameParsed.toString()]) {
        values.cssNamesParsed[cssNameParsed] = value;
        let classesToUpdate: string[] = [];
        for (let createdClass of values.alreadyCreatedClasses) {
          if (createdClass.includes(cssNameParsed)) {
            classesToUpdate.push(createdClass);
          }
        }
        if (classesToUpdate.length > 0) {
          cssCreate.cssCreate(classesToUpdate);
        }
      } else {
        throw new Error(`There is no cssNameParsed named ${cssNameParsed}.`);
      }
    } catch (err) {
      console_log.consoleLog("error", { err: err });
    }
  },
};
