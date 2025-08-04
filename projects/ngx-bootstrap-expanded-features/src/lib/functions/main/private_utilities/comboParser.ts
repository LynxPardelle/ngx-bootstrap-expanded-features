import { ValuesSingleton } from '../../../singletons/valuesSingleton';
/* Functions */
import { console_log } from '../../../functions/console_log';
import { valueComboReplacer } from './valueComboReplacer';
import { values4ComboGetter } from './values4ComboGetter';
import { manage_cache } from '../../manage_cache';
/* Types */
import { TLogPartsOptions } from '../../../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('comboParser', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('comboParser', toLog);
};
export const comboParser = (
  class2Create: string,
  comb: string,
  class2CreateElement: HTMLElement
): string[] => {
  multiLog([
    [class2Create, 'class2Create'],
    [comb, 'comb'],
    [class2CreateElement, 'class2CreateElement'],
  ]);
  const comboClasses2Create: string[] = [];
  let combIndex = comb ? Object.keys(values.combos).indexOf(comb) : -1;
  multiLog([
    [combIndex, 'combIndex'],
    [class2Create, 'class2Create'],
  ]);
  let vals: string[] = values4ComboGetter(class2Create);
  log(vals, 'vals Before ValueComboReplacer');
  values.combos[comb].map((c: string) => {
    log(c, 'c');
    c = valueComboReplacer(c, vals);
    log(c, 'c AfterValueComboReplacer');
    if (c.startsWith(values.indicatorClass)) {
      log(values.combosCreatedKeys, 'combosCreatedKeys');
      let alreadyABBRCombo: boolean = false;
      for (const cs of values.combosCreatedKeys) {
        if (values.combosCreated[cs] === class2Create) {
          alreadyABBRCombo = true;
          break;
        }
      }
      log(alreadyABBRCombo, 'alreadyABBRCombo');
      const combCreatedKey: string =
        Array.from(values.combosCreatedKeys).find((cs) => {
          return values.combosCreated[cs] === class2Create;
        }) || values.encryptComboCharacters + values.combosCreatedKeys.size;
      log(combCreatedKey, 'combCreatedKey');
      if (!alreadyABBRCombo) {
        values.combosCreated[
          values.encryptCombo ? combCreatedKey : class2Create
        ] = class2Create;
        values.combosCreatedKeys.add(combCreatedKey);
        multiLog([
          [
            values.combosCreated[
              values.encryptCombo ? combCreatedKey : class2Create
            ],
            'c StartsWithClass2Create',
          ],
          [combCreatedKey, 'combCreatedKey'],
          [values.combosCreatedKeys, 'combosCreatedKeys After ComboCreated'],
        ]);
      }
      const comboABBR: string = values.encryptCombo
        ? combCreatedKey
        : class2Create;
      multiLog([
        [comboABBR, 'comboABBR'],
        [c, 'c'],
      ]);
      const pseudos = values.pseudos.filter((p: any) =>
        c.split('-')[1].includes(p.mask)
      );
      const firstPseudo =
        pseudos.sort((p1: any, p2: any) => {
          return c.indexOf(p1.mask) - c.indexOf(p2.mask);
        })[0] || -1;
      switch (true) {
        case pseudos.length > 0 &&
          !!(
            !c.includes('SEL') || c.indexOf('SEL') > c.indexOf(firstPseudo.mask)
          ):
          log(firstPseudo, 'firstPseudo');
          c = c
            .replace('SEL', '')
            .replace(
              firstPseudo.mask,
              'SEL__COM_' + comboABBR + firstPseudo.mask
            );
          log(c, 'c includes AfterPseudo');
          break;
        case !!c.includes('SEL'):
          c = c.replace('SEL', 'SEL__COM_' + comboABBR + '__');
          log(c, 'c includes SEL After');
          break;
        default:
          log(c, 'c doesnt includes SEL');
          c = c.replace(
            c.split('-')[1],
            c.split('-')[1] + 'SEL__COM_' + comboABBR
          );
          log(c, 'c doesnt includes SEL After');
          break;
      }
    } else {
      log(c, 'c doesnt starts with class2Create');
      class2CreateElement.classList.add(c);
    }
    if (!comboClasses2Create.includes(c)) {
      comboClasses2Create.push(c);
    }
    return c;
  });
  return comboClasses2Create;
};
