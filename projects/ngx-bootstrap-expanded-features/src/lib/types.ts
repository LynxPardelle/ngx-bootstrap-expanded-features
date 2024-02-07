const LOG_TYPES = {
  log: "log",
  info: "info",
  trace: "trace",
  error: "error",
} as const;
type TObjectValues<T> = T[keyof T];
export type TLOG_TYPE = TObjectValues<
  typeof LOG_TYPES
> /* keyof typeof LOG_TYPES */;
export type TBPS = {
  bp: string;
  value: string;
  class2Create?: string;
};
export type TConsoleParser = {
  type?: TLOG_TYPE;
  thing: any;
  style?: string;
  line?: string | null;
  stoper?: boolean;
};
export type TPseudo = {
  mask: string;
  real: string;
};
export type TAbreviationTraductor = {
  abreviation: string;
  abreviationRegExp: RegExp;
  traduction: string;
  traductionRegExp: RegExp;
};