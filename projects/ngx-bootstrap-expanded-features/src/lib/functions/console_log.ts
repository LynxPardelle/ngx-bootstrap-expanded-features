/* Singletons */
import { ValuesSingleton } from '../singletons/valuesSingleton';
/* Interfaces */
import { IConsoleParser } from '../interfaces';
/* Types */
import { TLogPartsOptions, TLogSectionOptions } from '../types';
function getStackTrace(): string {
  let stack;
  try {
    throw new Error('');
  } catch (error: any) {
    stack = error.stack || '';
  }
  stack = stack.split('\n').map((line: any) => {
    return line.trim();
  });
  return stack.splice(stack[0] == 'Error' ? 2 : 1);
}
const values: ValuesSingleton = ValuesSingleton.getInstance();
export const console_log = {
  betterLogV1(
    section: TLogSectionOptions,
    thing: any,
    part?: TLogPartsOptions,
    style?: string,
    stoper?: boolean
  ): void {
    if (
      values.chosenSectionOptions.sections.includes(section) &&
      (!part || values.chosenSectionOptions.parts.includes(part.split(' ')[0] as TLogPartsOptions))
    ) {
      this.consoleParser({
        type: 'info',
        thing: thing,
        line: part ? `${section}.${part}` : typeof thing === 'string' ? `${section}.${thing}` : undefined,
        showObjectAsString: false,
        style: style ? style : values.styleConsole,
        stoper: stoper !== undefined ? stoper : !values.isDebug,
      });
    }
  },
  multiBetterLogV1(
    section: TLogSectionOptions,
    toLog: [any, TLogPartsOptions?][],
    style?: string,
    stoper?: boolean
  ): void {
    toLog.forEach(([thing, part]) => {
      this.betterLogV1(section, thing, part, style, stoper);
    });
  },
  consoleLog(
    type: 'log' | 'info' | 'trace' | 'error' = 'log',
    thing: any,
    style: string = values.styleConsole,
    line: string | null = null,
    stoper: boolean = !values.isDebug
  ): void {
    this.consoleParser({
      type: type,
      thing: thing,
      style: style,
      line: line,
      stoper: stoper,
    });
  },
  consoleParser(config: IConsoleParser): void {
    config.stoper = config.stoper !== undefined ? config.stoper : !values.isDebug;
    if (config.stoper === false || config.type === 'error') {
      config.type = config.type ? config.type : 'log';
      config.style = config.style ? config.style : values.styleConsole;
      config.showObjectAsString = config.showObjectAsString !== undefined ? config.showObjectAsString : true;
      const typeofThing = typeof config.thing;
      const isObject = typeofThing === 'object';
      if (config.line) {
        let lineResult = config.line;
        if (
          ['number', 'boolean'].includes(typeofThing) ||
          (typeofThing === 'string' && config.thing.length > 0 && config.thing.length < 15)
        ) {
          lineResult = config.line + ' = ' + config.thing;
        }
        if (!['error', 'trace'].includes(config.type)) {
          console.groupCollapsed('%c' + 'Line: ' + lineResult, config.style);
        } else {
          console.info('%cline: ' + lineResult + ' = ', config.style);
        }
      }
      if ((!isObject || config.showObjectAsString) && ['log', 'info', 'error'].includes(config.type)) {
        console[config.type]('%c' + (isObject ? JSON.stringify(config.thing) : config.thing), config.style);
      }
      if (isObject) {
        console.dir(config.thing);
      }
      if (!config.line || ['error', 'trace'].includes(config.type)) {
        console.groupCollapsed('%c' + 'Trace:', config.style);
      }
      const stackTrace = getStackTrace();
      for (let i = 2; i <= 7; i++) {
        console.info('%c' + stackTrace[i], config.style);
      }
      console.trace();
      console.groupEnd();
    }
  },
};
