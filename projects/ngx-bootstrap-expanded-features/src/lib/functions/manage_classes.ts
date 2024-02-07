/* Singletons */
import { ValuesSingleton } from "../singletons/valuesSingleton";
/* Funtions */
import { console_log } from "./console_log";
import { cssCreate } from "./cssCreate";

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const manage_classes = {
  getAlreadyCreatedClasses(): string[] {
    console_log.consoleLog("info", {
      alreadyCreatedClasses: values.alreadyCreatedClasses,
    });
    return values.alreadyCreatedClasses;
  },
  updateClasses(classesToUpdate: string[]): void {
    cssCreate.cssCreate(classesToUpdate);
  },
};
