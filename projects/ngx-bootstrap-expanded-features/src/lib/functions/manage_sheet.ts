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
  checkSheet(option: 'normal' | 'responsive' = 'normal') {
    let sheets: CSSStyleSheet[] = [...document.styleSheets];
    const styleSheetToManage = option === 'normal' ? values.styleSheetToManage : values.responsiveStyleSheetToManage;
    for (let nsheet of sheets) {
      if (nsheet.href?.includes(styleSheetToManage)) {
        if (
          (option === 'normal' && values.sheet !== nsheet) ||
          (option === 'responsive' && values.responsiveSheet !== nsheet)
        ) {
          if (option === 'normal') {
            values.sheet = nsheet;
          } else {
            values.responsiveSheet = nsheet;
          }
          values.alreadyCreatedClasses.clear();
          values.combosCreated = {};
          if (values.cacheActive) {
            manage_cache.clearAllNoneEssential();
          }
          break;
        }
      }
    }
  },
  getSheet(option: 'normal' | 'responsive' = 'normal'): CSSStyleSheet | undefined {
    if (option === 'normal') {
      if (values.sheet) {
        log(values.sheet, 'sheet');
        return values.sheet;
      } else {
        return undefined;
      }
    } else {
      if (values.responsiveSheet) {
        log(values.responsiveSheet, 'responsive sheet');
        return values.responsiveSheet;
      } else {
        return undefined;
      }
    }
  },
  deleteSpecificRuleByClassName(className: string) {
    if (!values.sheet && !values.responsiveSheet) return;
    if (values.sheet) {
      this._doDeleteSpecificRuleByClassName(values.sheet, className);
    }
    if (values.responsiveSheet) {
      this._doDeleteSpecificRuleByClassName(values.responsiveSheet, className);
    }
  },
  _doDeleteSpecificRuleByClassName(sheet: CSSStyleSheet, className: string) {
    const rules = sheet.cssRules;
    const exactClassRx = new RegExp(`(^|,\\s*)\\.${className}(\\s*|,|$)`);
    for (let i = rules.length - 1; i >= 0; i--) {
      const rule = rules[i];
      if (rule instanceof CSSStyleRule && exactClassRx.test(rule.selectorText)) {
        sheet.deleteRule(i);
      } else if (rule instanceof CSSGroupingRule) {
        this._deleteInMediaRule(rule, className, i, exactClassRx);
        // si media queda vacía, opcionalmente eliminar la media en sí:
        if (rule.cssRules.length === 0) {
          sheet.deleteRule(i);
        }
      }
    }
  },
  _deleteInMediaRule(mediaRule: CSSGroupingRule, className: string, index: number, exactClassRx: RegExp) {
    const nested = mediaRule.cssRules;
    for (let j = nested.length - 1; j >= 0; j--) {
      const inner = nested[j];
      if (inner instanceof CSSStyleRule && exactClassRx.test(inner.selectorText)) {
        mediaRule.deleteRule(j);
      } else if (inner instanceof CSSGroupingRule) {
        this._deleteInMediaRule(inner, className, j, exactClassRx);
      }
    }
    if (nested.length === 0) {
      mediaRule.parentStyleSheet?.deleteRule(index);
    }
  },
  deleteAllInSheet(option: 'normal' | 'responsive' = 'normal') {
    const sheet = option === 'normal' ? values.sheet : values.responsiveSheet;
    if (sheet) {
      log('Deleting all styles in sheet', option);
      const rules = sheet.cssRules;
      for (let i = rules.length - 1; i >= 0; i--) {
        sheet.deleteRule(i);
      }
    }
  },
};
