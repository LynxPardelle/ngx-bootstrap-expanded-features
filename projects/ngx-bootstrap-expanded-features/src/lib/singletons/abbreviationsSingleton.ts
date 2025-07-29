import { IAbreviationTraductor } from '../interfaces';
import { commonPropertiesValuesAbreviations } from '../values/commonPropertiesValuesAbreviations';

/**
 * AbbreviationsSingleton manages all abbreviation and translation mappings
 * used for converting between abbreviated and full CSS values.
 */
export class AbbreviationsSingleton {
  private static instance: AbbreviationsSingleton;

  // Abbreviation mappings
  public abreviationsClasses: { [key: string]: string } = {};
  public abreviationsValues: { [key: string]: string } = {};

  // Common properties values abbreviations
  public commonPropertiesValuesAbreviations: { [key: string]: string } =
    commonPropertiesValuesAbreviations;
  public commonPropertiesValuesAbreviationsValues: string[] = Object.values(
    this.commonPropertiesValuesAbreviations
  );

  // Abbreviation translators
  public abreviationTraductors: IAbreviationTraductor[] = [
    {
      abreviation: 'per',
      traduction: '$1%',
      abreviationRegExp: /(\d+)\s*per/g,
      traductionRegExp: /%/g,
    },
    {
      abreviation: 'COM',
      traduction: ' , ',
      abreviationRegExp: /COM/g,
      traductionRegExp: /\s*,\s*/g,
    },
    {
      abreviation: 'CSP',
      traduction: `'`,
      abreviationRegExp: /CSP/g,
      traductionRegExp: /'/g,
    },
    {
      abreviation: 'CDB',
      traduction: `"`,
      abreviationRegExp: /CDB/g,
      traductionRegExp: /"/g,
    },
    {
      abreviation: 'MIN',
      traduction: '-',
      abreviationRegExp: /MIN/g,
      traductionRegExp: /-/g,
    },
    {
      abreviation: 'PLUS',
      traduction: '+',
      abreviationRegExp: /PLUS/g,
      traductionRegExp: /\+/g,
    },
    {
      abreviation: 'SD',
      traduction: '(',
      abreviationRegExp: /SD/g,
      traductionRegExp: /\(/g,
    },
    {
      abreviation: 'ED',
      traduction: ')',
      abreviationRegExp: /ED/g,
      traductionRegExp: /\)/g,
    },
    {
      abreviation: 'SE',
      traduction: '[',
      abreviationRegExp: /SE/g,
      traductionRegExp: /\[/g,
    },
    {
      abreviation: 'EE',
      traduction: ']',
      abreviationRegExp: /EE/g,
      traductionRegExp: /\]/g,
    },
    {
      abreviation: 'HASH',
      traduction: '#',
      abreviationRegExp: /HASH/g,
      traductionRegExp: /#/g,
    },
    {
      abreviation: 'SLASH',
      traduction: '/',
      abreviationRegExp: /SLASH/g,
      traductionRegExp: /\//g,
    },
    {
      abreviation: 'UND',
      traduction: '_',
      abreviationRegExp: /UND/g,
      traductionRegExp: /_/g,
    },
    {
      abreviation: '__',
      traduction: ' ',
      abreviationRegExp: /__/g,
      traductionRegExp: /\s+/g,
    },
    {
      abreviation: '_',
      traduction: '.',
      abreviationRegExp: /_/g,
      traductionRegExp: /\./g,
    },
    {
      abreviation: 'CHILD',
      traduction: ' > ',
      abreviationRegExp: /CHILD/g,
      traductionRegExp: /\s*>\s*/g,
    },
    {
      abreviation: 'ADJ',
      traduction: ' + ',
      abreviationRegExp: /ADJ/g,
      traductionRegExp: /\s*\+\s*/g,
    },
    {
      abreviation: 'SIBL',
      traduction: ' ~ ',
      abreviationRegExp: /SIBL/g,
      traductionRegExp: /\s*~\s*/g,
    },
    {
      abreviation: 'ALL',
      traduction: '*',
      abreviationRegExp: /ALL/g,
      traductionRegExp: /\*/g,
    },
    {
      abreviation: 'EQ',
      traduction: '=',
      abreviationRegExp: /EQ/g,
      traductionRegExp: /=/g,
    },
    {
      abreviation: 'ST',
      traduction: '^',
      abreviationRegExp: /ST/g,
      traductionRegExp: /\^/g,
    },
    {
      abreviation: 'INC',
      traduction: '$',
      abreviationRegExp: /INC/g,
      traductionRegExp: /\$/g,
    },
    {
      abreviation: 'DPS',
      traduction: ':',
      abreviationRegExp: /DPS/g,
      traductionRegExp: /:/g,
    },
    {
      abreviation: 'PNC',
      traduction: ';',
      abreviationRegExp: /PNC/g,
      traductionRegExp: /;/g,
    },
  ];

  // Translation maps for performance optimization
  public translatorMaps: {
    traduceMap: Map<string, { regex: RegExp; replacement: string }>;
    convertMap: Map<string, { regex: RegExp; replacement: string | RegExp }>;
  } = {
    traduceMap: new Map<string, { regex: RegExp; replacement: string }>(),
    convertMap: new Map<string, { regex: RegExp; replacement: string | RegExp }>(),
  };

  private constructor() {
    this.initializeTranslatorMaps();
  }

  public static getInstance(): AbbreviationsSingleton {
    if (!AbbreviationsSingleton.instance) {
      AbbreviationsSingleton.instance = new AbbreviationsSingleton();
    }
    return AbbreviationsSingleton.instance;
  }

  /**
   * Initializes the translator maps for performance optimization
   */
  private initializeTranslatorMaps(): void {
    const traduceMap = new Map<string, { regex: RegExp; replacement: string }>();
    const convertMap = new Map<string, { regex: RegExp; replacement: string | RegExp }>();

    for (const abr of this.abreviationTraductors) {
      // Cache for "traduce" mode (abbreviation -> traduction)
      traduceMap.set(abr.abreviation, {
        regex: abr.abreviationRegExp,
        replacement: abr.traduction,
      });

      // Cache for "convert" mode (traduction -> abbreviation)
      convertMap.set(abr.traduction, {
        regex: abr.traductionRegExp,
        replacement: abr.abreviation,
      });
    }

    this.translatorMaps = { traduceMap, convertMap };
  }

  /**
   * Adds a new abbreviation translator
   */
  public addAbbreviationTraductor(traductor: IAbreviationTraductor): void {
    this.abreviationTraductors.push(traductor);
    this.initializeTranslatorMaps();
  }

  /**
   * Removes an abbreviation translator by abbreviation
   */
  public removeAbbreviationTraductor(abbreviation: string): void {
    this.abreviationTraductors = this.abreviationTraductors.filter(
      t => t.abreviation !== abbreviation
    );
    this.initializeTranslatorMaps();
  }

  /**
   * Gets a translator by abbreviation
   */
  public getTraductor(abbreviation: string): IAbreviationTraductor | undefined {
    return this.abreviationTraductors.find(t => t.abreviation === abbreviation);
  }

  /**
   * Updates abbreviations classes mapping
   */
  public setAbbreviationClass(key: string, value: string): void {
    this.abreviationsClasses[key] = value;
  }

  /**
   * Updates abbreviations values mapping
   */
  public setAbbreviationValue(key: string, value: string): void {
    this.abreviationsValues[key] = value;
  }

  /**
   * Gets abbreviation class by key
   */
  public getAbbreviationClass(key: string): string | undefined {
    return this.abreviationsClasses[key];
  }

  /**
   * Gets abbreviation value by key
   */
  public getAbbreviationValue(key: string): string | undefined {
    return this.abreviationsValues[key];
  }

  /**
   * Clears all abbreviation mappings
   */
  public clearAbbreviations(): void {
    this.abreviationsClasses = {};
    this.abreviationsValues = {};
  }
}
