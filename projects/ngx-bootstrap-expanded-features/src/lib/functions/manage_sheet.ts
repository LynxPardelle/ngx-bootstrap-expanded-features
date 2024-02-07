/* Singletons */
import { ValuesSingleton } from "../singletons/valuesSingleton";
/* Funtions */
import { console_log } from "./console_log";
import { cssCreate } from "./cssCreate";

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const manage_sheet = {
  checkSheet() {
    let sheets: CSSStyleSheet[] = [...document.styleSheets];
    for (let nsheet of sheets) {
      if (nsheet.href?.includes(values.styleSheetToManage)) {
        values.sheet = nsheet;
        values.alreadyCreatedClasses = [];
        values.combosCreated = {};
      }
    }
  },
  getSheet(): CSSStyleSheet | undefined {
    if (values.sheet) {
      console_log.consoleLog("info", { sheet: values.sheet });
      return values.sheet;
    } else {
      return undefined;
    }
  },
};
