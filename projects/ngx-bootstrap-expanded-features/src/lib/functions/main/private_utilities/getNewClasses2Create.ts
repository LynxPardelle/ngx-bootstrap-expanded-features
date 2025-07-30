import { ValuesSingleton } from '../../../singletons/valuesSingleton';
/* Funtions */
import { comboParser } from './comboParser';
import { console_log } from '../../console_log';
/* Types */
import { TLogPartsOptions } from '../../../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('getNewClasses2Create', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('getNewClasses2Create', toLog);
};
export const getNewClasses2Create = async (): Promise<string[]> => {
  multiLog([
    [values.combos, 'combos'],
    [values.indicatorClass, 'indicatorClass'],
    [values.abreviationsClasses, 'abreviationsClasses'],
    [values.alreadyCreatedClasses, 'alreadyCreatedClasses'],
  ]);
  const classes2Create: Set<string> = new Set();
  const allElementsWithClassAtribute: NodeListOf<HTMLElement> =
    document.querySelectorAll('[class]');
  // Get all HTMLElements in page
  for (let i = 0; i < allElementsWithClassAtribute.length; i++) {
    for (const item of allElementsWithClassAtribute[i].classList) {
      let comb: string | undefined;
      for (const cs of values.combosKeys) {
        if (item.startsWith(cs)) {
          comb = cs;
          break;
        }
      }
      if (!!comb && values.combos[comb]) {
        (
          await comboParser(item, comb, allElementsWithClassAtribute[i])
        ).forEach((c: string) => {
          if (!classes2Create.has(c) && !values.alreadyCreatedClasses.has(c)) {
            classes2Create.add(c);
          }
        });
      } else if (
        !comb &&
        !classes2Create.has(item) &&
        !values.alreadyCreatedClasses.has(item) &&
        item !== values.indicatorClass &&
        (item.startsWith(values.indicatorClass) ||
          values.abreviationsClassesKeys.has(item.split('-')[0]))
      ) {
        classes2Create.add(item);
      }
    }
  }
  log(classes2Create, 'classes2Create');
  return Array.from(classes2Create);
};
