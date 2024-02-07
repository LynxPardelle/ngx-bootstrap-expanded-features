import { ValuesSingleton } from "../../../singletons/valuesSingleton";
import { console_log } from "../../../functions/console_log";
const values: ValuesSingleton = ValuesSingleton.getInstance();
export const decryptCombo = async (
  specify: string,
  class2Create: string,
  class2CreateStringed: string
): Promise<string[]> => {
  let alreadyABBRCombo: string | undefined = Object.keys(
    values.combosCreated
  ).find((cs) => specify.includes(cs));
  return !!alreadyABBRCombo
    ? await (async (): Promise<string[]> => {
        console_log.consoleLog("info", { alreadyABBRCombo: alreadyABBRCombo });
        return await Promise.all(
          [specify, class2Create, class2CreateStringed].map(
            async (val: string, index: number) => {
              if (index === 2) {
                setTimeout(() => {
                  console_log.consoleLog("info", {
                    specifyPostDecryptCombo: specify,
                    class2CreatePostDecryptCombo: class2Create,
                    class2CreateStringedPostDecryptCombo: class2CreateStringed,
                  });
                }, 1);
              }
              return alreadyABBRCombo
                ? val.replace(
                    alreadyABBRCombo,
                    values.combosCreated[alreadyABBRCombo]
                  )
                : val;
            }
          )
        );
      })()
    : [specify, class2Create, class2CreateStringed];
};
