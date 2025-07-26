import { IPseudo } from '../../../interfaces';
import { ValuesSingleton } from '../../../singletons/valuesSingleton';
import { console_log } from '../../console_log';
/* Types */
import { TLogPartsOptions } from '../../../types';
const values = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('convertPseudos', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('convertPseudos', toLog);
};
/**
 * Converts pseudo-class masks in a string to their real counterparts or removes them entirely.
 *
 * This function processes a string containing pseudo-class masks and either converts them to
 * their actual pseudo-class selectors or removes them based on the remove parameter.
 * It handles special cases for pseudo-classes with parameters (SDED format) and page-specific
 * pseudo-classes (Right/Left).
 *
 * @param thing - The input string containing pseudo-class masks to be converted
 * @param remove - Optional flag to determine whether to remove pseudo-classes instead of converting them. Defaults to false
 *
 * @returns The processed string with pseudo-class masks either converted to real pseudo-classes or removed
 *
 * @example
 * ```typescript
 * // Convert pseudo-class masks to real pseudo-classes
 * const result = convertPseudos("div:hoverMask", false);
 *
 * // Remove pseudo-class masks entirely
 * const cleaned = convertPseudos("div:hoverMask", true);
 * ```
 */
export const convertPseudos = (
  thing: string,
  remove: boolean = false
): string => {
  multiLog([
    [thing, 'thing'],
    [remove, 'remove'],
  ]);
  const pseudoFiltereds: IPseudo[] = values.pseudos.filter((pseudo: IPseudo) => {
    return thing.includes(pseudo.mask);
  });
  log(pseudoFiltereds, 'pseudoFiltereds');
  if (pseudoFiltereds.length !== 0) {
    pseudoFiltereds.forEach((pse: IPseudo) => {
      let regMask = new RegExp(':*' + pse.mask, 'gi');
      switch (true) {
        case values.pseudosHasSDED.includes(pse.mask):
          regMask = new RegExp(':*' + pse.mask + '\\' + '(', 'gi');
          break;
        case ['Right', 'Left'].includes(pse.mask):
          regMask = new RegExp('page' + pse.mask, 'gi');
          break;
        default:
          break;
      }
      thing = thing
        .replace('SD', '(')
        .replace('ED', ')')
        .replace(
          regMask,
          !remove
            ? values.pseudosHasSDED.includes(pse.mask)
              ? pse.real + '('
              : ['Right', 'Left'].includes(pse.mask)
              ? 'page' + pse.real
              : pse.real
            : ''
        );
    });
    log(thing, 'thing After convertPseudos');
  }
  return thing;
};
