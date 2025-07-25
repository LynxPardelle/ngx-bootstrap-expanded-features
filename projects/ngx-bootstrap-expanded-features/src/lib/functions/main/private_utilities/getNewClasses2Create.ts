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
  const classes2Create: string[] = [];
  // Get all HTMLElements in page
  Array.from(document.querySelectorAll('*')).forEach((value: Element) => {
    value.classList.forEach(async (item: string) => {
      const comb = Object.keys(values.combos).find((cs: string) => {
        return item.includes(cs);
      });
      if (!!comb && values.combos[comb]) {
        (
          await comboParser(item, comb, value as HTMLElement)
        ).forEach((c: string) => {
          if (
            !classes2Create.includes(c) &&
            !values.alreadyCreatedClasses.includes(c)
          ) {
            classes2Create.push(c);
          }
        });
      } else if (
        !comb &&
        !classes2Create.includes(item) &&
        !values.alreadyCreatedClasses.includes(item) &&
        item !== values.indicatorClass &&
        (item.includes(values.indicatorClass) ||
          Object.keys(values.abreviationsClasses).find((aC: string) =>
            item.includes(aC)
          ))
      ) {
        classes2Create.push(item);
      }
    });
  });
  log(classes2Create, 'classes2Create');
  return classes2Create;
};
