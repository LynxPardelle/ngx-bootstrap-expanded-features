import { ValuesSingleton } from "../../../singletons/valuesSingleton";
import { console_log } from "../../../functions/console_log";
import { valueComboReplacer } from "./valueComboReplacer";
import { values4ComboGetter } from "./values4ComboGetter";
const values: ValuesSingleton = ValuesSingleton.getInstance();
type TVals2Sort = {
  index: number;
  val: string;
};
export const comboParser = async (
  class2Create: string,
  comb: string,
  class2CreateElement: HTMLElement,
  classes2Create: string[],
  combIndex: number
): Promise<string[]> => {
  let vals: string[] = await values4ComboGetter(class2Create);
  console_log.consoleLog("info", { vals: vals });
  await Promise.all(
    values.combos[comb].map(async (c: string) => {
      console_log.consoleLog("info", { combo: c });
      c = await valueComboReplacer(c, vals);
      console_log.consoleLog("info", { cAfterValueComboReplacer: c });
      if (c.startsWith(values.indicatorClass)) {
        let combosCreatedABBR = Object.keys(values.combosCreated);
        console_log.consoleLog("info", {
          combosCreatedABBR: combosCreatedABBR,
        });
        let alreadyABBRCombo = combosCreatedABBR.find((cs) => {
          return values.combosCreated[cs] === class2Create;
        });
        console_log.consoleLog("info", {
          alreadyABBRCombo: alreadyABBRCombo,
        });
        if (!alreadyABBRCombo) {
          values.combosCreated[values.encryptCombo ? "■■■" + combIndex : comb] =
            class2Create;
          console_log.consoleLog("info", {
            cStartsWithClass2Create:
              values.combosCreated[
                values.encryptCombo ? "■■■" + combIndex : comb
              ],
          });
        }
        console_log.consoleLog("info", {
          combosCreatedABBR: combosCreatedABBR,
        });
        let comboABBR: string = values.encryptCombo ? "■■■" + combIndex : comb;
        console_log.consoleLog("info", { comboABBR: comboABBR });
        console_log.consoleLog("info", { c: c });
        let pseudos = values.pseudos.filter((p: any) =>
          c.split("-")[1].includes(p.mask)
        );
        let firstPseudo =
          pseudos.sort((p1: any, p2: any) => {
            return c.indexOf(p1.mask) - c.indexOf(p2.mask);
          })[0] || -1;
        switch (true) {
          case pseudos.length > 0 &&
            !!(
              !c.includes("SEL") ||
              c.indexOf("SEL") > c.indexOf(firstPseudo.mask)
            ):
            console_log.consoleLog("info", { firstPseudo: firstPseudo });
            c = c
              .replace("SEL", "")
              .replace(
                firstPseudo.mask,
                "SEL__COM_" + comboABBR + firstPseudo.mask
              );
            console_log.consoleLog("info", { cIncludesPseudoAfter: c });
            break;
          case !!c.includes("SEL"):
            c = c.replace("SEL", "SEL__COM_" + comboABBR + "__");
            console_log.consoleLog("info", { cIncludesSELAfter: c });
            break;
          default:
            console_log.consoleLog("info", { cDoesntIncludesSEL: c });
            c = c.replace(
              c.split("-")[1],
              c.split("-")[1] + "SEL__COM_" + comboABBR
            );
            console_log.consoleLog("info", {
              cDoesntIncludesSELAfter: c,
            });
            break;
        }
      } else {
        console_log.consoleLog("info", {
          cDoesntStartsWithClass2Create: c,
        });
        class2CreateElement.classList.add(c);
      }
      if (!classes2Create.includes(c)) {
        classes2Create.push(c);
      }
      return c;
    })
  );
  return classes2Create;
};
