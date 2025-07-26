import { ValuesSingleton } from '../../../singletons/valuesSingleton';
import { console_log } from '../../../functions/console_log';
/* Types */
import { TLogPartsOptions } from '../../../types';
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('decryptCombo', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('decryptCombo', toLog);
};
const values: ValuesSingleton = ValuesSingleton.getInstance();
/**
 * Decrypts a combination by finding and replacing abbreviated combo strings with their full values.
 *
 * @param specify - The specification string to process
 * @param class2Create - The class creation string to process
 * @param class2CreateStringed - The stringified class creation string to process
 *
 * @returns A Promise that resolves to an array of three strings: the processed versions of specify, class2Create, and class2CreateStringed.
 * If no matching combo abbreviation is found, returns the original strings unchanged.
 *
 * @example
 * ```typescript
 * await decryptCombo(
 * ', .■■■0',
 * 'bef-wSEL__COM_■■■0-85per',
 * '.bef-wSEL__COM_■■■0-85per'):
 * [
 * ', .boxOne',
 * 'bef-wSEL__COM_boxOne-85per',
 * '.bef-wSEL__COM_boxOne-85per'
 * ]
 * ```
 */
export const decryptCombo = async (
  specify: string,
  class2Create: string,
  class2CreateStringed: string
): Promise<string[]> => {
  multiLog([
    [specify, 'specify'],
    [class2Create, 'class2Create'],
    [class2CreateStringed, 'class2CreateStringed'],
  ]);
  let alreadyABBRCombo: string | undefined = Object.keys(
    values.combosCreated
  ).find((cs: string) => {
    log(cs, 'cs');
    return specify.includes(cs);
  });
  log(alreadyABBRCombo, 'alreadyABBRCombo');
  const comboDecrypted = !!alreadyABBRCombo
    ? await (async (): Promise<string[]> => {
        return await Promise.all(
          [specify, class2Create, class2CreateStringed].map(
            async (val: string) => {
              return alreadyABBRCombo
                ? val.replace(
                    new RegExp(alreadyABBRCombo, 'g'),
                    values.combosCreated[alreadyABBRCombo]
                  )
                : val;
            }
          )
        );
      })()
    : [specify, class2Create, class2CreateStringed];
  log(comboDecrypted, 'comboDecrypted');
  return comboDecrypted;
};
