/* Singletons */
import { ValuesSingleton } from "../singletons/valuesSingleton";
/* Functions */
import { console_log } from "./console_log";
const values: ValuesSingleton = ValuesSingleton.getInstance();
export const abreviation_traductors = {
  abreviationTraductor(
    value: string,
    type: "traduce" | "convert" = "traduce"
  ): string {
    if (value !== undefined) {
      console_log.consoleLog("info", {
        value_beforeAbreviationTraductor: value,
      });
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
      console_log.consoleLog("info", {
        value_afterAbreviationTraductor: value,
      });
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
