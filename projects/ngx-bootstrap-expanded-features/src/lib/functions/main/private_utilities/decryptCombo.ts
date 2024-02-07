import { ValuesSingleton } from '../../../singletons/valuesSingleton';
import { console_log } from '../../../functions/console_log';
const values: ValuesSingleton = ValuesSingleton.getInstance();
export const decryptCombo = async (
  specify: string,
  class2Create: string,
  class2CreateStringed: string
): Promise<string[]> => {
  let alreadyABBRCombo: string | undefined = Object.keys(
    values.combosCreated
  ).find((cs) => {
    console_log.consoleLog('info', { cs: cs });
    return specify.includes(cs);
  });
  return !!alreadyABBRCombo
    ? await (async (): Promise<string[]> => {
        console_log.consoleLog('info', { alreadyABBRCombo: alreadyABBRCombo });
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
