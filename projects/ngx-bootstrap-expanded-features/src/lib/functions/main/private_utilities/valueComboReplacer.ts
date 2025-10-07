import { console_log } from '../../../functions/console_log';
/* Types */
import { TLogPartsOptions } from '../../../types';
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('valueComboReplacer', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('valueComboReplacer', toLog);
};
export const valueComboReplacer = (c: string, vals: string[]): string => {
  multiLog([
    [c, 'c'],
    [vals, 'vals'],
  ]);
  let reg = new RegExp(/VAL[0-9]+(DEF[^D]*(?:D(?!EF)[^D]*)*DEF)?/, 'g');
  if (reg.test(c)) {
    let matches = c.match(reg);
    log(matches, 'matches');
    if (!!matches) {
      for (let match of matches) {
        log(match, 'match');
        let val = parseInt(match.split('VAL')[1].split('DEF')[0]);
        log(val, 'val');
        let valueToMatch = `VAL${val}(DEF[^D]*(?:D(?!EF)[^D]*)*DEF)?`;
        let valueReg = new RegExp(valueToMatch, 'g');
        log(valueToMatch, 'valueToMatch');
        let def = match.split('DEF')[1];
        multiLog([
          [def, 'def'],
          [vals, 'vals'],
          [vals[val], 'vals_val'],
        ]);
        if (
          !!vals[val] &&
          vals[val] !== '' &&
          vals[val] !== 'undefined' &&
          vals[val] !== 'DEF' &&
          vals[val] !== 'null'
        ) {
          if (/VAL[0-9]+/.test(vals[val])) {
            /* When you want to use another defined value */
            let valval = vals[val].replace(/VAL/g, '');
            log(valval, 'valval');
            c = c.replace(
              valueReg,
              vals[parseInt(valval)] && vals[parseInt(valval)] !== 'VAL' + valval
                ? vals[parseInt(valval)]
                : def
                ? def
                : ''
            );
            log(c, 'c');
          } else {
            /* When you defined a custom value */
            c = c.replace(valueReg, vals[val]);
            log(c, 'c');
          }
        } else {
          /* When you dont define a value its defined the default value */
          c = c.replace(valueReg, def ? def : '');
          log(c, 'c');
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
