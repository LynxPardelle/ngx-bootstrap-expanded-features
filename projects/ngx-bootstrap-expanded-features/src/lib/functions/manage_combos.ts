/* Singletons */
import { ValuesSingleton } from "../singletons/valuesSingleton";
/* Funtions */
import { console_log } from "./console_log";
import { cssCreate } from "./cssCreate";

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const manage_combos = {
  pushCombos(combos: any): void {
    try {
      let prevIgnoredCombosValues: string[] = [];
      Object.keys(combos).forEach((key) => {
        values.combos[key] =
          typeof combos[key] === "string"
            ? combos[key].split(" ")
            : combos[key]
                .map((c: string) => {
                  return c.split(" ").flat();
                })
                .flat();
        prevIgnoredCombosValues = values.alreadyCreatedClasses.filter(
          (aC: any) => {
            return aC.includes(key);
          }
        );
      });
      if (prevIgnoredCombosValues.length > 0) {
        cssCreate.cssCreate(prevIgnoredCombosValues);
      } else {
        cssCreate.cssCreate();
      }
    } catch (err) {
      console_log.consoleLog("error", { err: err });
    }
  },
  getCombos(): any {
    console_log.consoleLog("info", { combos: values.combos });
    return values.combos;
  },
  updateCombo(combo: string, newValues: string[]): void {
    try {
      if (values.combos[combo.toString()]) {
        values.combos[combo] = newValues;
        let classes2Delete: string[] = [];
        for (let createdClass of values.alreadyCreatedClasses) {
          if (createdClass.includes(combo)) {
            classes2Delete.push(createdClass);
          }
        }
        if (classes2Delete.length > 0) {
          for (let class2Delete of classes2Delete) {
            values.sheet.deleteRule(
              [...values.sheet.cssRules].findIndex((cssRule) => {
                return cssRule.cssText.includes(class2Delete);
              })
            );
            values.alreadyCreatedClasses = values.alreadyCreatedClasses.filter(
              (aC: string) => {
                return aC !== class2Delete;
              }
            );
          }
          cssCreate.cssCreate();
        }
      } else {
        throw new Error(`There is no combo named ${combo}.`);
      }
    } catch (err) {
      console_log.consoleLog("error", { err: err });
    }
  },
};
