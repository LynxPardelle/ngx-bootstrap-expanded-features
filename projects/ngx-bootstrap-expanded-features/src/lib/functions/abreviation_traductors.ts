/* Singletons */
import { ValuesSingleton } from "../singletons/valuesSingleton";
/* Functions */
import { console_log } from "./console_log";
/* Types */
import { TLogPartsOptions } from '../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('abreviationTraductors', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('abreviationTraductors', toLog);
};
export const abreviation_traductors = {
  abreviationTraductor(
    value: string,
    type: "traduce" | "convert" = "traduce"
  ): string {
    multiLog([
      [value, 'value'],
      [type, 'type'],
    ]);
    if (value !== undefined) {
      log(value, 'value BeforeAbreviationTraductor');
      for (const abr of values.abreviationTraductors) {
        let traduction: string = abr.traduction;
        let abreviation: string | RegExp = abr.abreviation;
        let traductionRegExp: RegExp = abr.traductionRegExp;
        let abreviationRegExp: RegExp = abr.abreviationRegExp;
        if (type === "traduce") {
          value = value.replace(abreviationRegExp, traduction);
        } else if (type === "convert") {
          value = value.replace(traductionRegExp, abreviation);
        }
      }
      log(value, 'value AfterAbreviationTraductor');
    }
    return value;
  },
  unbefysize(value: string): string {
    return this.abreviationTraductor(value);
  },
  befysize(value: string): string {
    return this.abreviationTraductor(value, "convert");
  },
};
