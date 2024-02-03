/* Singletons */
import { ValuesSingleton } from "../singletons/valuesSingleton";
/* Funtions */
import { console_log } from "./console_log";
import { manage_sheet } from "./manage_sheet";
import { doCssCreate } from "./main/doCssCreate";
import { doUseTimer } from "./private/doUseTimer";

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const cssCreate = {
  cssCreate(
    updateBefs: string[] | null = null,
    primordial: boolean = false
  ): void {
    try {
      if (!values.sheet) {
        manage_sheet.checkSheet();
        if (!values.sheet) {
          throw new Error(`There is no bef-styles style sheet!`);
        }
      }
      if (!!values.useTimer) {
        doUseTimer(updateBefs, primordial);
      } else {
        doCssCreate.start(updateBefs);
      }
    } catch (err) {
      console_log.consoleLog("error", { err: err }, values.styleConsole);
    }
  },
};
