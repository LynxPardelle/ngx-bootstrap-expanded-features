import { ValuesSingleton } from '../../../singletons/valuesSingleton';
/* Functions */
import { console_log } from '../../../functions/console_log';
import { valueComboReplacer } from './valueComboReplacer';
import { values4ComboGetter } from './values4ComboGetter';
/* Types */
import { TLogPartsOptions } from '../../../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('comboParser', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('comboParser', toLog);
};
export const comboParser = async (
  class2Create: string,
  comb: string,
  class2CreateElement: HTMLElement
): Promise<string[]> => {
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
  let vals: string[] = await values4ComboGetter(class2Create);
  log(vals, 'vals Before ValueComboReplacer');
  await Promise.all(
    values.combos[comb].map(async (c: string) => {
      log(c, 'c');
      c = await valueComboReplacer(c, vals);
      log(c, 'c AfterValueComboReplacer');
      if (c.startsWith(values.indicatorClass)) {
        let combosCreatedABBR = Object.keys(values.combosCreated);
        log(combosCreatedABBR, 'combosCreatedABBR');
        let alreadyABBRCombo = combosCreatedABBR.find((cs) => {
          return values.combosCreated[cs] === class2Create;
        });
        log(alreadyABBRCombo, 'alreadyABBRCombo');
        let combosCreatedKeys: string[] = Object.keys(values.combosCreated);
        let combCreatedKey: string =
          combosCreatedKeys.find((cs) => {
            return values.combosCreated[cs] === class2Create;
          }) || values.encryptComboCharacters + combosCreatedKeys.length;
        log(combCreatedKey, 'combCreatedKey');
        if (!alreadyABBRCombo) {
          values.combosCreated[
            values.encryptCombo ? combCreatedKey : class2Create
          ] = class2Create;
          multiLog([
            [
              values.combosCreated[
                values.encryptCombo ? combCreatedKey : class2Create
              ],
              'c StartsWithClass2Create',
            ],
            [combCreatedKey, 'combCreatedKey'],
            [combosCreatedABBR, 'combosCreatedABBR'],
          ]);
        }
        log(combosCreatedABBR, 'combosCreatedABBR After ComboCreated');
        let comboABBR: string = values.encryptCombo
          ? combCreatedKey
          : class2Create;
        multiLog([
          [comboABBR, 'comboABBR'],
          [c, 'c'],
        ]);
        let pseudos = values.pseudos.filter((p: any) =>
          c.split('-')[1].includes(p.mask)
        );
        let firstPseudo =
          pseudos.sort((p1: any, p2: any) => {
            return c.indexOf(p1.mask) - c.indexOf(p2.mask);
          })[0] || -1;
        switch (true) {
          case pseudos.length > 0 &&
            !!(
              !c.includes('SEL') ||
              c.indexOf('SEL') > c.indexOf(firstPseudo.mask)
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
    })
  );
  return comboClasses2Create;
};
