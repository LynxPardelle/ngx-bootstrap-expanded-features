/* Singletons */
import { ValuesSingleton } from "../singletons/valuesSingleton";
/* Interfaces */
import { IBPS } from "../interfaces";
/* Funtions */
import { console_log } from "./console_log";
import { cssCreate } from "./cssCreate";

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const manage_bps = {
  pushBPS(bps: IBPS[]): void {
    try {
      for (let nb of bps) {
        let bp = values.bps.find((b: any) => b.bp === nb.bp);
        if (bp) {
          bp.value = nb.value;
          bp.bef = "";
        } else {
          values.bps.push({
            bp: nb.bp,
            value: nb.value,
            bef: "",
          });
        }
      }
      cssCreate.cssCreate();
    } catch (err) {
      console_log.consoleLog("error", { err: err }, values.styleConsole);
    }
  },
  getBPS(): any {
    console_log.consoleLog("info", { bps: values.bps }, values.styleConsole);
    return values.bps;
  },
};
