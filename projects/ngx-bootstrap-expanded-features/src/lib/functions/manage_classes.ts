/* Singletons */
import { ValuesSingleton } from "../singletons/valuesSingleton";
/* Funtions */
import { console_log } from "./console_log";
import { cssCreate } from "./cssCreate";
/* Types */
import { TLogPartsOptions } from '../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('manageClasses', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('manageClasses', toLog);
};
export const manage_classes = {
  getAlreadyCreatedClasses(): string[] {
    log(values.alreadyCreatedClasses, 'alreadyCreatedClasses');
    return values.alreadyCreatedClasses;
  },
  updateClasses(classesToUpdate: string[]): void {
    cssCreate.cssCreate(classesToUpdate);
  },
};
