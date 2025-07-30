/* Singletons */
import { ValuesSingleton } from '../singletons/valuesSingleton';
/* Funtions */
import { console_log } from './console_log';
/* Types */
import { TLogPartsOptions } from '../types';
import { manage_cache } from './manage_cache';
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
        if (values.sheet !== nsheet) {
          values.sheet = nsheet;
          values.alreadyCreatedClasses.clear();
          values.combosCreated = {};
          if (values.cacheActive) {
            manage_cache.clearAllNoneEssential();
          }
        }
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
  deleteSpecificRuleByClassName(className: string) {
    if (!values.sheet) return;

    const rules = values.sheet.cssRules;
    const exactClassRx = new RegExp(`(^|,\\s*)\\.${className}(\\s*|,|$)`);
    for (let i = rules.length - 1; i >= 0; i--) {
      const rule = rules[i];
      if (
        rule instanceof CSSStyleRule &&
        exactClassRx.test(rule.selectorText)
      ) {
        values.sheet.deleteRule(i);
      } else if (rule instanceof CSSGroupingRule) {
        this._deleteInMediaRule(rule, className, i, exactClassRx);
        // si media queda vacía, opcionalmente eliminar la media en sí:
        if (rule.cssRules.length === 0) {
          values.sheet.deleteRule(i);
        }
      }
    }
  },
  _deleteInMediaRule(
    mediaRule: CSSGroupingRule,
    className: string,
    index: number,
    exactClassRx: RegExp
  ) {
    const nested = mediaRule.cssRules;
    for (let j = nested.length - 1; j >= 0; j--) {
      const inner = nested[j];
      if (
        inner instanceof CSSStyleRule &&
        exactClassRx.test(inner.selectorText)
      ) {
        mediaRule.deleteRule(j);
      } else if (inner instanceof CSSGroupingRule) {
        this._deleteInMediaRule(inner, className, j, exactClassRx);
      }
    }
    if (nested.length === 0) {
      mediaRule.parentStyleSheet?.deleteRule(index);
    }
  },
  deleteAllInSheet() {
    if (values.sheet) {
      log('Deleting all styles in sheet', 'sheet');
      const rules = values.sheet.cssRules;
      for (let i = rules.length - 1; i >= 0; i--) {
        values.sheet.deleteRule(i);
      }
    }
  },
};
