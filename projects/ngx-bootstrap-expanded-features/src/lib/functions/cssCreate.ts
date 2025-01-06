/* Singletons */
import { ValuesSingleton } from "../singletons/valuesSingleton";
/* Funtions */
import { console_log } from "./console_log";
import { manage_sheet } from "./manage_sheet";
import { doCssCreate } from "./main/doCssCreate";
import { doUseTimer } from "./private/doUseTimer";
import { doUseRecurrentStrategy } from "./private/doUseRecurrentStrategy";

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const cssCreate = {
  cssCreate(
    updateClasses2Create: string[] | null = null,
    primordial: boolean = false
  ): void {
    try {
      if (!values.sheet) {
        manage_sheet.checkSheet();
        if (!values.sheet) {
          throw new Error(
            `There is no ${values.styleSheetToManage} style sheet!`
          );
        }
      }
      if (!!values.useTimer) {
        doUseTimer(updateClasses2Create, primordial);
      } else if (!!values.useRecurrentStrategy) {
        doUseRecurrentStrategy(updateClasses2Create, primordial);
      } else {
        doCssCreate.start(updateClasses2Create);
      }
    } catch (err) {
      console_log.consoleLog("error", { err: err });
    }
  },
};
