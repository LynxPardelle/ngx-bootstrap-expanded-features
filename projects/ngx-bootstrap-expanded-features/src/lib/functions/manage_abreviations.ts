/* Singletons */
import { ValuesSingleton } from "../singletons/valuesSingleton";
/* Funtions */
import { console_log } from "./console_log";
import { cssCreate } from "./cssCreate";

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const manage_abreviations = {
  pushAbreviationsValues(abreviationsValues: any): void {
    try {
      let prevIgnoredAbreviationsValues: string[] = [];
      Object.keys(abreviationsValues).forEach((key) => {
        values.abreviationsValues[key] = abreviationsValues[key];
        prevIgnoredAbreviationsValues = values.alreadyCreatedClasses.filter(
          (aC: any) => {
            return aC.includes(key);
          }
        );
      });
      if (prevIgnoredAbreviationsValues.length > 0) {
        cssCreate.cssCreate(prevIgnoredAbreviationsValues);
      }
    } catch (err) {
      console_log.consoleLog("error", { err: err });
    }
  },
  pushAbreviationsClasses(abreviationsClasses: any): void {
    let prevIgnoredAbreviationsValues: string[] = [];
    try {
      Object.keys(abreviationsClasses).forEach((key) => {
        values.abreviationsClasses[key] = abreviationsClasses[key];
        prevIgnoredAbreviationsValues = values.alreadyCreatedClasses.filter(
          (aC: any) => {
            return aC.includes(key);
          }
        );
      });
      if (prevIgnoredAbreviationsValues.length > 0) {
        cssCreate.cssCreate(prevIgnoredAbreviationsValues);
      } else {
        cssCreate.cssCreate();
      }
    } catch (err) {
      console_log.consoleLog("error", { err: err });
    }
  },
  getAbreviationsClasses(): any {
    console_log.consoleLog("info", {
      abreviationsClasses: values.abreviationsClasses,
    });
    return values.abreviationsClasses;
  },
  getAbreviationsValues(): any {
    console_log.consoleLog("info", {
      abreviationsValues: values.abreviationsValues,
    });
    return values.abreviationsValues;
  },
  updateAbreviationsClass(abreviationsClass: string, value: string): void {
    try {
      if (values.abreviationsClasses[abreviationsClass.toString()]) {
        values.abreviationsClasses[abreviationsClass] = value;
        let classesToUpdate: string[] = [];
        for (let createdClass of values.alreadyCreatedClasses) {
          if (createdClass.includes(abreviationsClass)) {
            classesToUpdate.push(createdClass);
          }
        }
        if (classesToUpdate.length > 0) {
          cssCreate.cssCreate(classesToUpdate);
        }
      } else {
        throw new Error(
          `There is no abreviationsClass named ${abreviationsClass}.`
        );
      }
    } catch (err) {
      console_log.consoleLog("error", { err: err });
    }
  },
  updateAbreviationsValue(abreviationsValue: string, value: string): void {
    try {
      if (values.abreviationsValues[abreviationsValue.toString()]) {
        values.abreviationsValues[abreviationsValue] = value;
        let classesToUpdate: string[] = [];
        for (let createdClass of values.alreadyCreatedClasses) {
          if (createdClass.includes(abreviationsValue)) {
            classesToUpdate.push(createdClass);
          }
        }
        if (classesToUpdate.length > 0) {
          cssCreate.cssCreate(classesToUpdate);
        }
      } else {
        throw new Error(
          `There is no abreviationsValue named ${abreviationsValue}.`
        );
      }
    } catch (err) {
      console_log.consoleLog("error", { err: err });
    }
  },
};
