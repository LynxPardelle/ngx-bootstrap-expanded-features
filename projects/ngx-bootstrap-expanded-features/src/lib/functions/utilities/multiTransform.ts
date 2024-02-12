import { ValuesSingleton } from '../../singletons/valuesSingleton';
import { console_log } from '../console_log';

const values: ValuesSingleton = ValuesSingleton.getInstance();
export type TMultiTransformArgs<T> = {
  args: { [key: string]: any };
  steps: TSteps<T>[];
  result?: T;
};
export type TSteps<T> = {
  argument2Use: string;
  condition?: (args: { [key: string]: any }) => boolean;
  jumpTo?: number;
} & (
  | {
      type: 'replace';
    }
  | {
      type: 'replaceAll';
    }
  | {
      type: 'divide';
    }
  | {
      type: 'return';
      callBack: (args: unknown) => T;
    }
);
export const multiTransform = async <T>(
  args: TMultiTransformArgs<T>
): Promise<T> => {
  try {
    let i = 0;
    while (args.steps.length > i) {
      let currentArg = args.steps[i];
      if (currentArg.condition && !(await currentArg.condition(args.args))) {
        i = currentArg.jumpTo || i + 1;
        currentArg = args.steps[i];
      }
      switch (currentArg.type) {
        case 'replace':
          args.args['lastReplace'] = args.args[
            currentArg.argument2Use.split(values.separator)[0]
          ].replace(
            args.args[currentArg.argument2Use.split(values.separator)[1]],
            args.args[currentArg.argument2Use.split(values.separator)[2]]
          );
          break;
        case 'replaceAll':
          let toReplaceRg = new RegExp(
            args.args[currentArg.argument2Use.split(values.separator)[1]],
            'g'
          );
          args.args['lastReplace'] = args.args[
            currentArg.argument2Use.split(values.separator)[0]
          ].replace(
            toReplaceRg,
            args.args[currentArg.argument2Use.split(values.separator)[2]]
          );
          break;
        case 'divide':
          args.result = args.args[currentArg.argument2Use] as unknown as T;
          break;
        case 'return':
          args.result = (await currentArg.callBack(
            args.args[currentArg.argument2Use] as unknown
          )) as T;
      }
      i++;
    }
    if (args.result) {
      return args.result;
    } else {
      throw new Error('No result');
    }
  } catch (error) {
    console_log.consoleLog('error', error);
    throw new Error('No result');
  }
};
