/* Singletons */
import { ValuesSingleton } from "../../singletons/valuesSingleton";
/* Funtions */
import { console_log } from "../console_log";

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const createMediaRule = (rule: string): void => {
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
  console_log.consoleLog("info", { rule: rule });
  values.sheet.insertRule(rule, values.sheet.cssRules.length);
};
