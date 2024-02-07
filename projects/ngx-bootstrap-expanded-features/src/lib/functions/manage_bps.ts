/* Singletons */
import { ValuesSingleton } from "../singletons/valuesSingleton";
/* Interfaces */
import { IBPS } from "../interfaces";
/* Funtions */
import { console_log } from "./console_log";
import { cssCreate } from "./cssCreate";

interface WithBefs {
  befs: string; // DEPRECATED
}
interface IBPSWithBefs extends IBPS, WithBefs {}

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const manage_bps = {
  pushBPS(bps: IBPSWithBefs[]): void {
    try {
      for (let nb of bps) {
        let bp = values.bps.find((b: any) => b.bp === nb.bp);
        if (bp) {
          bp.value = nb.value;
          bp.class2Create = "";
        } else {
          values.bps.push({
            bp: nb.bp,
            value: nb.value,
          });
        }
      }
      cssCreate.cssCreate();
    } catch (err) {
      console_log.consoleLog("error", { err: err });
    }
  },
  getBPS(): IBPS[] {
    console_log.consoleLog("info", { bps: values.bps });
    return values.bps;
  },
};
