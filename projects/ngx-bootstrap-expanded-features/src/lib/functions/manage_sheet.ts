/* Singletons */
import { ValuesSingleton } from "../singletons/valuesSingleton";
/* Funtions */
import { console_log } from "./console_log";
/* Types */
import { TLogPartsOptions } from '../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('manageSheet', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('manageSheet', toLog);
};
export const manage_sheet = {
  checkSheet() {
    let sheets: CSSStyleSheet[] = [...document.styleSheets];
    for (let nsheet of sheets) {
      if (nsheet.href?.includes(values.styleSheetToManage)) {
        values.sheet = nsheet;
        values.alreadyCreatedClasses = [];
        values.combosCreated = {};
      }
    }
  },
  getSheet(): CSSStyleSheet | undefined {
    if (values.sheet) {
      log(values.sheet, 'sheet');
      return values.sheet;
    } else {
      return undefined;
    }
  },
};
