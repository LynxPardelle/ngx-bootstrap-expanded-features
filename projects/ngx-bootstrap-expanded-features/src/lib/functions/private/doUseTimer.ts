/* Singletons */
import { ValuesSingleton } from "../../singletons/valuesSingleton";
/* Functions */
import { timeManagerCssCreate } from "./timeManagerCssCreate";
const values: ValuesSingleton = ValuesSingleton.getInstance();
export const doUseTimer = (
  updateBefs: string[] | null = null,
  primordial: boolean = false
) => {
  values.lastTimeAsked2Create = Date.now();
  timeManagerCssCreate.delayedCssCreate(updateBefs, primordial);
};
