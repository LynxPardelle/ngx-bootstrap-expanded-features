import { IPseudo } from "../../../interfaces";
import { ValuesSingleton } from "../../../singletons/valuesSingleton";
import { console_log } from "../../console_log";
/* Types */
import { TLogPartsOptions } from '../../../types';
const values = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('convertPseudos', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('convertPseudos', toLog);
};
export const convertPseudos = (
  thing: string,
  remove: boolean = false
): string => {
  multiLog([
    [thing, 'thing'],
    [remove, 'remove'],
  ]);
  let pseudoFiltereds: IPseudo[] = values.pseudos.filter((pseudo: IPseudo) => {
    return thing.includes(pseudo.mask);
  });
  log(pseudoFiltereds, 'pseudoFiltereds');
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
  log(thing, 'thing After convertPseudos');
  return thing;
};
