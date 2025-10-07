/* Colors */
import { allColors } from '../values/colors';
/* CssNamesParsed */
import { cssNamesParsed } from '../values/cssNamesParsed';
/* Parts & Sections */
import { defaultChosenSectionOptions } from '../values/parts_sections';
/* Interfaces */
import { IAbreviationTraductor, IBPS, IPseudo } from '../interfaces';
/* Functions */
/* Common Properties Values */
import { commonPropertiesValuesAbreviations } from '../values/commonPropertiesValuesAbreviations';
/* Types */
import { TChosenLogSectionOptions } from '../types';
export class ValuesSingleton {
  private static instance: ValuesSingleton;
  public indicatorClass: string = 'ank';
  public colors: { [key: string]: string } = allColors;
  public colorNames: string[] = Object.keys(this.colors);
  public colorsRegex: RegExp | undefined;
  public opacityRegex: RegExp = new RegExp(
    /(?:([A-z0-9#]*)|(?:(rgb)|(hsl)|(hwb))a?\([0-9\.\,\s%]*\))\s?OPA\s?0\.[0-9]*/gi
  );
  public abreviationsClasses: { [key: string]: string } = {};
  public abreviationsClassesKeys: Set<string> = new Set(Object.keys(this.abreviationsClasses));
  public abreviationsValues: { [key: string]: string } = {};
  public abreviationsValuesKeys: Set<string> = new Set(Object.keys(this.abreviationsValues));
  public combos: { [key: string]: string[] } = {};
  public combosKeys: Set<string> = new Set(Object.keys(this.combos));
  public combosCreated: { [key: string]: string } = {};
  public combosCreatedKeys: Set<string> = new Set(Object.keys(this.combosCreated));
  public encryptCombo: boolean = true;
  public encryptComboCharacters: string = '■■■';
  public encryptComboCreatedCharacters: string = '🜔🜔🜔';
  public cssNamesParsed: { [key: string]: string | string[] } = cssNamesParsed;
  public alreadyCreatedClasses: Set<string> = new Set();
  public sheet?: CSSStyleSheet;
  public responsiveSheet?: CSSStyleSheet;
  public isDebug: boolean = false;
  public bps: IBPS[] = [
    {
      bp: 'sm',
      value: '576px',
      class2Create: '',
    },
    {
      bp: 'md',
      value: '768px',
      class2Create: '',
    },
    {
      bp: 'lg',
      value: '992px',
      class2Create: '',
    },
    {
      bp: 'xl',
      value: '1200px',
      class2Create: '',
    },
    {
      bp: 'xxl',
      value: '1400px',
      class2Create: '',
    },
  ];
  public breakPoints: Set<string> = new Set(['sm', 'md', 'lg', 'xl', 'xxl']);
  public bpsSpecifyOptions: string[] = [
    '',
    'html',
    'html body',
    'html body #' + this.indicatorClass + '-bp',
    '#' + this.indicatorClass + '-bp',
  ];
  public limitBPS: boolean = false;
  public styleSheetToManage: string = 'angora-styles.css';
  public responsiveStyleSheetToManage: string = 'angora-styles-responsive.css';
  public separator: string = 'þµÞ';
  public specify: string = '🜏🜏🜏';
  /* Console */
  public styleConsole: string = `padding: 1rem; background-color: ${ this.colors['abyss'] }; color: ${ this.colors['lavenderLP'] };`;
  /* Pseudos */
  public pseudoClasses: string[] = [
    'Active',
    'AnyLink',
    'Autofill',
    'Blank',
    'Checked',
    'Current',
    'Default',
    'Defined',
    'Dir',
    'Disabled',
    'Empty',
    'Enabled',
    'First',
    'FirstChild',
    'FirstOfType',
    'Focus',
    'FocusVisible',
    'FocusWithin',
    'Fullscreen',
    'Future',
    'Has',
    'Host',
    'Hover',
    'InRange',
    'Indeterminate',
    'Invalid',
    'Is',
    'Lang',
    'LastChild',
    'LastOfType',
    'Left',
    'Link',
    'LocalLink',
    'Modal',
    'Muted',
    'Not',
    'NthChild',
    'NthLastChild',
    'NthLastOfType',
    'NthOfType',
    'OnlyChild',
    'OnlyOfType',
    'Optional',
    'OutOfRange',
    'Past',
    'Paused',
    'PictureInPicture',
    'PlaceHolderShown',
    'Playing',
    'PopoverOpen',
    'ReadOnly',
    'ReadWrite',
    'Required',
    'Right',
    'Root',
    'Scope',
    'Seeking',
    'Stalled',
    'Target',
    'TargetWithin',
    'UserInvalid',
    'UserValid',
    'Valid',
    'Visited',
    'VolumeLocked',
    'Where',
  ];
  public pseudosHasSDED: Set<string> = new Set([
    'Dir',
    'Not',
    'Lang',
    'Has',
    'Host',
    'Is',
    'NthChild',
    'NthLastChild',
    'NthLastOfType',
    'NthOfType',
    'Part',
    'Slotted',
    'Where',
  ]);
  public pseudoElements: string[] = [
    'After',
    'Backdrop',
    'Before',
    'Cue',
    'CueRegion',
    'FileSelectorButton',
    'FirstLetter',
    'FirstLine',
    'GrammarError',
    'Highlight',
    'Marker',
    'Part',
    'Placeholder',
    'Selection',
    'Slotted',
    'SpellingError',
    'TargetText',
    'ViewTransition',
    'ViewTransitionGroup',
    'ViewTransitionImagePair',
    'ViewTransitionNew',
    'ViewTransitionOld',
  ];
  public pseudos: IPseudo[] = [];
  public pageSpecificSet: Set<string> = new Set(['Right', 'Left']);
  public importantActive: boolean = false;
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
  public translatorMaps: {
    traduceMap: Map<string, { regex: RegExp; replacement: string }>;
    convertMap: Map<string, { regex: RegExp; replacement: string | RegExp }>;
  } = {
      traduceMap: new Map<string, { regex: RegExp; replacement: string }>(),
      convertMap: new Map<string, { regex: RegExp; replacement: string | RegExp }>(),
    };
  /* Time Management*/
  public useTimer: boolean = false;
  public lastTimeAsked2Create: number = new Date().getTime();
  public timesCSSCreated: number = 0;
  public timeBetweenReCreate: number = 300;
  public lastTimeCssCreateEnded: number = Date.now();
  public creationPostponed: boolean = false;
  public setTimeOutID: ReturnType<typeof setTimeout> | null = null;
  /* Recurrent Strategy */
  public useRecurrentStrategy: boolean = true;
  public cssCreateIsActive: boolean = false;
  /* Common Properties Values Abreviations */
  public commonPropertiesValuesAbreviations: { [key: string]: string } = commonPropertiesValuesAbreviations;
  public commonPropertiesValuesAbreviationsValues: string[] = Object.values(this.commonPropertiesValuesAbreviations);
  /* Logging */
  public chosenSectionOptions: TChosenLogSectionOptions = defaultChosenSectionOptions;
  /* Cache */
  public cacheActive: boolean = true;
  public cacheSize: number = 1000;
  public propertyJoinerCache: Map<string, string> = new Map();
  public regExpCache: Map<string, RegExp> = new Map();
  public buttonCssCache: Map<string, string> = new Map();
  public buttonShadeCache: Map<string, string> = new Map();
  public buttonCorrectionCache: Map<string, string> = new Map();
  public camelCache: Map<string, string> = new Map();
  public cssValidCache: Map<string, boolean> = new Map();
  public colorTransformCache: Map<string, string> = new Map();
  public comboDecryptCache: Map<string, string> = new Map();
  public parseClassCache: Map<
    string,
    {
      class2Create: string;
      bpsStringed: IBPS[];
      classes2CreateStringed: string;
    }
  > = new Map();
  public getNewClasses2CreateCache: Map<string, string[]> = new Map();
  public comboParserCache: Map<string, string[]> = new Map();
  public values4ComboGetterCache: Map<string, string[]> = new Map();
  private constructor() { }
  public static getInstance(): ValuesSingleton {
    if (!ValuesSingleton.instance) {
      ValuesSingleton.instance = new ValuesSingleton();
      this.instance.init();
    }
    return ValuesSingleton.instance;
  }
  public init() {
    this.translatorMaps = (() => {
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
      return {
        traduceMap,
        convertMap,
      };
    })();
  }
}
