/* Singletons */
import { ValuesSingleton } from "../../singletons/valuesSingleton";
/* Functions */
import { console_log } from "../console_log";
import { doCssCreate } from "../main/doCssCreate";

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const timeManagerCssCreate = {
  delayedCssCreate(
    updateBefs: string[] | null = null,
    primordial: boolean = false
  ): void {
    if (
      Date.now() - values.lastCSSCreate >= values.timeBetweenReCreate ||
      primordial === true ||
      values.timesCSSCreated === 0
    ) {
      values.timesCSSCreated++;
      doCssCreate.start(updateBefs);
      values.lastCSSCreate = Date.now();
      console_log.consoleParser({
        thing: { timesCSSCreated: values.timesCSSCreated },
      });
    } else {
      if (
        Date.now() - values.timeBetweenReCreate <
        values.lastTimeAsked2Create
      ) {
        this.handleDelayedCssCreate(updateBefs, primordial);
      }
    }
  },
  handleDelayedCssCreate(
    updateBefs: string[] | null = null,
    primordial: boolean = false
  ) {
    setTimeout(() => {
      this.delayedCssCreate(updateBefs, primordial);
    }, values.timeBetweenReCreate);
  },
};
