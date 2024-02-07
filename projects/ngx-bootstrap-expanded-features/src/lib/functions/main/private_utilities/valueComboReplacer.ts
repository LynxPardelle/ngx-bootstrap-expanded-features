import { console_log } from "../../../functions/console_log";
export const valueComboReplacer = async (
  c: string,
  vals: string[]
): Promise<string> => {
  let reg = new RegExp(/VAL[0-9]+(DEF.*DEF)?/, "g");
  if (reg.test(c)) {
    let matches = c.match(reg);
    console_log.consoleLog("info", { matches: matches });
    if (!!matches) {
      for (let match of matches) {
        console_log.consoleLog("info", { match: match });
        let val = parseInt(match.split("VAL")[1].split("DEF")[0]);
        console_log.consoleLog("info", { val: val });
        let valueToMatch = `VAL${val}(DEF.*DEF)?`;
        let valueReg = new RegExp(valueToMatch, "g");
        console_log.consoleLog("info", {
          valueToMatch: valueToMatch,
        });
        let def = match.split("DEF")[1];
        console_log.consoleLog("info", { def: def });
        console_log.consoleLog("info", { vals: vals });
        console_log.consoleLog("info", { vals_val: vals[val] });
        if (
          !!vals[val] &&
          vals[val] !== "" &&
          vals[val] !== "undefined" &&
          vals[val] !== "DEF" &&
          vals[val] !== "null"
        ) {
          if (/VAL[0-9]+/.test(vals[val])) {
            /* When you want to use another defined value */
            let valval = vals[val].replace(/VAL/g, "");
            console_log.consoleLog("info", { valval: valval });
            c = c.replace(
              valueReg,
              vals[parseInt(valval)] &&
                vals[parseInt(valval)] !== "VAL" + valval
                ? vals[parseInt(valval)]
                : def
                ? def
                : ""
            );
            console_log.consoleLog("info", { c: c });
          } else {
            /* When you defined a custom value */
            c = c.replace(valueReg, vals[val]);
            console_log.consoleLog("info", { c: c });
          }
        } else {
          /* When you dont define a value its defined the default value */
          c = c.replace(valueReg, def ? def : "");
          console_log.consoleLog("info", { c: c });
        }
      }
      return c;
    } else {
      return c;
    }
  } else {
    return c;
  }
};
