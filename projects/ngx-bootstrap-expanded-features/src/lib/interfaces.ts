export interface IBPS {
  bp: string;
  value: string;
  bef: string;
}

export interface IConsoleParser {
  type?: "log" | "info" | "trace" | "error";
  thing: any;
  style?: string;
  line?: string | null;
  stoper?: boolean;
}

export interface IPseudo {
  mask: string;
  real: string;
}

export interface IAbreviationTraductor {
  abreviation: string;
  abreviationRegExp: RegExp;
  traduction: string;
  traductionRegExp: RegExp;
}
