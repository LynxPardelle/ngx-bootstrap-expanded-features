/* Interfaces */
import { IBPS } from "../../interfaces";
/* Singletons */
import { ValuesSingleton } from "../../singletons/valuesSingleton";
/* Funtions */
import { console_log } from "../console_log";
import { manage_sheet } from "../manage_sheet";
/* Utilities */
import { getNewClasses2Create } from "./private_utilities/getNewClasses2Create";
import { parseClass } from "./private_utilities/parseClass";
import { send2CreateRules } from "./private_utilities/send2CreateRules";

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const doCssCreate = {
  async start(updateClasses2Create: string[] | null = null): Promise<number> {
    try {
      if (!values.sheet) {
        manage_sheet.checkSheet();
        if (!values.sheet) {
          throw new Error(
            `There is no ${values.styleSheetToManage} style sheet!`
          );
        }
      }
      const startTimeCSSCreate = performance.now();
      let classes2Create: string[] = [];
      if (!updateClasses2Create) {
        classes2Create = await getNewClasses2Create(classes2Create);
      } else {
        classes2Create = updateClasses2Create;
      }
      console_log.consoleLog("info", { classes2Create: classes2Create });
      let classes2CreateStringed = "";
      let bpsStringed: IBPS[] = values.bps.map((b: any) => b);
      for (let class2Create of classes2Create) {
        [class2Create, bpsStringed, classes2CreateStringed] = Object.values(
          await parseClass(
            class2Create,
            bpsStringed,
            classes2CreateStringed,
            updateClasses2Create
          )
        );
      }
      console_log.consoleLog("info", {
        classes2CreateStringed: classes2CreateStringed,
        bpsStringed: bpsStringed,
      });
      send2CreateRules(classes2CreateStringed, bpsStringed);
      const endTimeCSSCreate = await performance.now();
      console_log.consoleLog(
        "info",
        `Call to cssCreate() took ${
          endTimeCSSCreate - startTimeCSSCreate
        } milliseconds`
      );
      let class2CreateTimer = document.getElementById(
        values.indicatorClass + "Timer"
      );
      if (class2CreateTimer) {
        class2CreateTimer.innerHTML = `
            <p>
            Call to cssCreate() took ${
              endTimeCSSCreate - startTimeCSSCreate
            } milliseconds
            </p>
            `;
      }
      return Date.now();
    } catch (err) {
      console_log.consoleLog("error", { err: err });
      return Date.now();
    }
  },
};
