import { ValuesSingleton } from "../../../singletons/valuesSingleton";
import { IBPS } from "../../../interfaces";
import { console_log } from "../../console_log";
import { manage_CSSRules } from "../../manage_CSSRules";
const values: ValuesSingleton = ValuesSingleton.getInstance();

export const send2CreateRules = async (
  classes2CreateStringed: string,
  bpsStringed: IBPS[]
): Promise<void> => {
  bpsStringed = bpsStringed
    .sort((b1, b2) => {
      return (
        parseInt(b1.value.replace("px", "")) -
        parseInt(b2.value.replace("px", ""))
      );
    })
    .reverse();
  for (const [i, b] of bpsStringed.entries()) {
    if (b.class2Create !== "") {
      await console_log.consoleLog("info", {
        bp: b.bp,
        value: b.value,
        class2Create: b.class2Create,
      });

      for (const specifyOption of values.bpsSpecifyOptions) {
        classes2CreateStringed += `@media only screen and (min-width: ${b.value
          })${values.limitBPS
            ? bpsStringed.length > 1 && i !== 0
              ? `and (max-width: ${bpsStringed[i - 1].value})`
              : ""
            : ""
          } { ${specifyOption} ${b.class2Create}}${values.separator}`;
      }
      b.class2Create = "";
    }
  }
  if (classes2CreateStringed !== "") {
    await console_log.consoleLog("info", {
      classes2CreateStringed: classes2CreateStringed,
    });

    for (const class2Create of classes2CreateStringed.split(values.separator)) {
      if (class2Create !== "") {
        await manage_CSSRules.createCSSRules(class2Create);
      }
    }
  }
};
