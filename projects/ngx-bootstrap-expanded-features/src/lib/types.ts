import { allPosibleParts, allPosibleSections } from "./values/parts_sections";

export type TLOG_TYPE = 'log' | 'info' | 'trace' | 'error';
export type TBPS = {
  bp: string;
  value: string;
  class2Create?: string;
};
export type TConsoleParser = {
  type?: TLOG_TYPE;
  thing: any;
  style?: string;
  line?: string;
  stoper?: boolean;
  showObjectAsString?: boolean;
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

export type TLogPartsOptions = (typeof allPosibleParts)[number];
export type TLogSectionOptions = (typeof allPosibleSections)[number];
export type TChosenLogSectionOptions = {
  sections: TLogSectionOptions[];
  parts: TLogPartsOptions[];
};
