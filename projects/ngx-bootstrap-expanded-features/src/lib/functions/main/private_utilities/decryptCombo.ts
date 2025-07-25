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
  ).find((cs) => {
    log(cs, 'cs');
    return specify.includes(cs);
  });
  return !!alreadyABBRCombo
    ? await (async (): Promise<string[]> => {
        log(alreadyABBRCombo, 'alreadyABBRCombo');
        return await Promise.all(
          [specify, class2Create, class2CreateStringed].map(
            async (val: string, index: number) => {
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
};
