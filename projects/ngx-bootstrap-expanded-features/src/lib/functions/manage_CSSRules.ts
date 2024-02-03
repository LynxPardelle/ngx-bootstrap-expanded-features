/* Singletons */
import { ValuesSingleton } from "../singletons/valuesSingleton";
/* Funtions */
import { console_log } from "./console_log";

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const manage_CSSRules = {
  createCSSRules(rule: string): void {
    try {
      console_log.consoleLog("info", { rule: rule }, values.styleConsole);
      if (rule && !rule.split("{")[0].includes("@media")) {
        let index;
        let originalRule: any = [...values.sheet.cssRules].some(
          (cssRule: any, i: number) => {
            if (
              cssRule.cssText.includes(
                rule.split("{")[0].replace("\n", "").replace(/\s+/g, " ")
              )
            ) {
              index = i;
              return true;
            } else {
              return false;
            }
          }
        )
          ? [...values.sheet.cssRules].find(
              (i) =>
                i.cssText
                  /* .includes(
                    rule.split('{')[0].replace('\n', '').replace(/\s+/g, ' ')
                  ) */
                  .split(" ")
                  .find((aC: string) => {
                    return (
                      aC.replace(".", "") ===
                      rule.split("{")[0].replace("\n", "").replace(/\s+/g, " ")
                    );
                  })
              /*
            i.cssText.split(' ').find((aC: string) => {
                return aC.replace('.', '') === bef;
              })
            */
            )
          : undefined;
        if (originalRule) {
          values.sheet.deleteRule(index);
        }
        console_log.consoleLog("info", { rule: rule }, values.styleConsole);
        values.sheet.insertRule(rule, values.sheet.cssRules.length);
      } else {
        let originalMediaRules: boolean = false;
        let rulesParsed: string[] = rule
          .replace(/{/g, values.separator)
          .replace(/}/g, values.separator)
          .split(values.separator)
          .filter((r) => r !== "")
          .map((r) => {
            return r.replace(/\n/g, "").replace(/\s{2}/g, "");
          });
        let mediaRule: string = rulesParsed[0].includes("media")
          ? rulesParsed[0]
          : "";
        if (mediaRule !== "") {
          if (mediaRule.endsWith(" ")) {
            mediaRule = mediaRule.slice(0, -1);
          }
          rulesParsed.shift();
          [...values.sheet.cssRules].forEach((css) => {
            if (css.cssText.includes(mediaRule) && css.cssRules) {
              originalMediaRules = true;
              let i = 0;
              while (i <= rulesParsed.length) {
                let index: number = 0;
                let posibleRule: any = [...css.cssRules].some(
                  (cssRule: any, ix: number) => {
                    if (cssRule.cssText.includes(rulesParsed[i])) {
                      index = ix;
                      return true;
                    } else {
                      return false;
                    }
                  }
                )
                  ? [...css.cssRules].find((i) =>
                      i.cssText.split(" ").find((aC: string) => {
                        return aC.replace(".", "") === rulesParsed[i];
                      })
                    )
                  : /* .includes(rulesParsed[i])) */
                    /*
            i.cssText.split(' ').find((aC: string) => {
                return aC.replace('.', '') === bef;
              })
            */
                    undefined;
                if (!!posibleRule) {
                  css.deleteRule(index);
                }
                let newRule: string = `${rulesParsed[i]}{${
                  rulesParsed[i + 1]
                }}`;
                console_log.consoleLog(
                  "info",
                  { newRule: newRule },
                  values.styleConsole
                );
                css.insertRule(newRule, css.cssRules.length);
                i = i + 2;
              }
            }
          });
        }
        if (originalMediaRules === false) {
          console_log.consoleLog("info", { rule: rule }, values.styleConsole);
          values.sheet.insertRule(rule, values.sheet.cssRules.length);
        }
      }
      console_log.consoleLog(
        "info",
        { sheet: values.sheet },
        values.styleConsole
      );
    } catch (err: any) {
      console_log.consoleLog("error", { err: err }, values.styleConsole);
    }
  },
};
