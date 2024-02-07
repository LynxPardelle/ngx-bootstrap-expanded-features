/* Singletons */
import { ValuesSingleton } from "../singletons/valuesSingleton";
/* Funtions */
import { console_log } from "./console_log";
import { createSimpleRule } from "./private/createSimpleRule";
import { createMediaRule } from "./private/createMediaRule";

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const manage_CSSRules = {
  createCSSRules(
    rules: string | string[],
    dontSplitted: boolean = false
  ): void {
    try {
      if (!!dontSplitted && !Array.isArray(rules)) {
        for (let rule of rules.split(values.separator)) {
          if (rule !== "") {
            manage_CSSRules.createCSSRule(rule);
          }
        }
      } else if (Array.isArray(rules)) {
        rules.forEach((rule) => {
          manage_CSSRules.createCSSRule(rule);
        });
      } else {
        manage_CSSRules.createCSSRule(rules);
      }
    } catch (err: any) {
      console_log.consoleLog("error", { err: err });
    }
  },
  createCSSRule(rule: string): void {
    try {
      console_log.consoleLog("info", { rule: rule });
      if (rule && !rule.split("{")[0].includes("@media")) {
        createMediaRule(rule);
      } else {
        createSimpleRule(rule);
      }
      console_log.consoleLog("info", { sheet: values.sheet });
    } catch (err: any) {
      console_log.consoleLog("error", { err: err });
    }
  },
};
