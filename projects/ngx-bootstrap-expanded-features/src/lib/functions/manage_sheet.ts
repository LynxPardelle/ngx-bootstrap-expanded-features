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
      if (nsheet.href?.includes("bef-styles")) {
        values.sheet = nsheet;
      }
    }
  },
  getSheet(): CSSStyleSheet | undefined {
    if (values.sheet) {
      console_log.consoleLog(
        "info",
        { sheet: values.sheet },
        values.styleConsole
      );
      return values.sheet;
    } else {
      return undefined;
    }
  },
};
