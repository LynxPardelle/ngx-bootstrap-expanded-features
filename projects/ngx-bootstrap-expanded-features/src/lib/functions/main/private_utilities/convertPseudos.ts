import { IPseudo } from "../../../interfaces";
import { ValuesSingleton } from "../../../singletons/valuesSingleton";
import { console_log } from "../../console_log";
const values = ValuesSingleton.getInstance();
export const convertPseudos = (
  thing: string,
  remove: boolean = false
): string => {
  console_log.consoleLog("info", { thing_beforeconvertPseudos: thing });
  let pseudoFiltereds: IPseudo[] = values.pseudos.filter((pseudo: IPseudo) => {
    return thing.includes(pseudo.mask);
  });
  pseudoFiltereds.forEach((pse: IPseudo) => {
    let regMask = new RegExp(":*" + pse.mask, "gi");
    switch (true) {
      case values.pseudosHasSDED.includes(pse.mask):
        regMask = new RegExp(":*" + pse.mask + "\\" + "(", "gi");
        break;
      case ["Right", "Left"].includes(pse.mask):
        regMask = new RegExp("page" + pse.mask, "gi");
        break;
      default:
        break;
    }
    thing = thing
      .replace("SD", "(")
      .replace("ED", ")")
      .replace(
        regMask,
        !remove
          ? values.pseudosHasSDED.includes(pse.mask)
            ? pse.real + "("
            : ["Right", "Left"].includes(pse.mask)
            ? "page" + pse.real
            : pse.real
          : ""
      );
  });
  console_log.consoleLog("info", { thing_afterconvertPseudos: thing });
  return thing;
};
