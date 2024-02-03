/* Interfaces */
import { IConsoleParser } from "../interfaces";
import { ValuesSingleton } from "../singletons/valuesSingleton";
function getStackTrace(): string {
  let stack;
  try {
    throw new Error("");
  } catch (error: any) {
    stack = error.stack || "";
  }
  stack = stack.split("\n").map((line: any) => {
    return line.trim();
  });
  return stack.splice(stack[0] == "Error" ? 2 : 1);
}
const values: ValuesSingleton = ValuesSingleton.getInstance();
export const console_log = {
  consoleLog(
    type: "log" | "info" | "trace" | "error" = "log",
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
    config.type = config.type ? config.type : "log";
    config.style = config.style ? config.style : values.styleConsole;
    config.stoper =
      config.stoper !== undefined ? config.stoper : !values.isDebug;
    if (config.stoper === false || config.type === "error") {
      if (config.line) {
        console.info("%cline: " + config.line + " = ", config.style);
      }
      console.info("%c" + getStackTrace()[2], config.style);
      console.groupCollapsed("Trace");
      console.trace();
      console.groupEnd();
      {
        switch (config.type) {
          case "log":
            console.log(
              "%c" +
                (typeof config.thing === "object"
                  ? JSON.stringify(config.thing)
                  : config.thing),
              config.style
            );
            break;
          case "info":
            console.info(
              "%c" +
                (typeof config.thing === "object"
                  ? JSON.stringify(config.thing)
                  : config.thing),
              config.style
            );
            break;
          case "error":
            console.error(
              "%c" +
                (typeof config.thing === "object"
                  ? JSON.stringify(config.thing)
                  : config.thing),
              config.style
            );
            break;
          default:
            break;
        }
      }
      if (typeof config.thing === "object") {
        console.dir(config.thing);
      }
    }
  },
};
