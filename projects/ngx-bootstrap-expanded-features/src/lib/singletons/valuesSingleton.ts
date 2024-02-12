/* Colors */
import { allColors } from '../values/colors';
/* CssNamesParsed */
import { cssNamesParsed } from '../values/cssNamesParsed';
/* Interfaces */
import { IAbreviationTraductor, IBPS, IPseudo } from '../interfaces';
/* Functions */
import { css_camel } from '../functions/css-camel';
export class ValuesSingleton {
  private static instance: ValuesSingleton;
  public indicatorClass: string = 'ank';
  public colors: { [key: string]: string } = allColors;
  public abreviationsClasses: { [key: string]: string } = {};
  public abreviationsValues: { [key: string]: string } = {};
  public combos: { [key: string]: string[] } = {};
  public combosCreated: { [key: string]: string } = {};
  public encryptCombo: boolean = true;
  public encryptComboCharacters: string = '■■■';
  public encryptComboCreatedCharacters: string = '🜔🜔🜔';
  public cssNamesParsed: { [key: string]: string | string[] } = cssNamesParsed;
  public alreadyCreatedClasses: string[] = [];
  public sheet: any;
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
  public bpsSpecifyOptions: string[] = [
    '',
    'html',
    'html body',
    'html body #' + this.indicatorClass + '-bp',
    '#' + this.indicatorClass + '-bp',
  ];
  public limitBPS: boolean = false;
  public styleSheetToManage: string = 'angora-styles';
  public separator: string = 'þµÞ';
  public specify: string = '🜏🜏🜏';
  /* Console */
  public styleConsole: string = `padding: 1rem; background-color: ${this.colors['abyss']}; color: ${this.colors['lavenderLP']};`;
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
  public pseudosHasSDED: string[] = [
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
  ];
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
  public pseudos: IPseudo[] = this.pseudoClasses
    .sort((e1: number | string, e2: number | string) => {
      e1 = e1.toString().length;
      e2 = e2.toString().length;
      return e1 > e2 ? 1 : e1 < e2 ? -1 : 0;
    })
    .map((pse: string) => {
      return {
        mask: pse,
        real: `${this.separator}:${css_camel.camelToCSSValid(pse)}`,
      };
    })
    .concat(
      this.pseudoElements
        .sort((e1: number | string, e2: number | string) => {
          e1 = e1.toString().length;
          e2 = e2.toString().length;
          return e1 > e2 ? 1 : e1 < e2 ? -1 : 0;
        })
        .map((pse: string) => {
          return {
            mask: pse,
            real: `${this.separator}::${css_camel.camelToCSSValid(pse)}`,
          };
        })
    );
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
  /* Time Management*/
  public lastCSSCreate: number = Date.now();
  public lastTimeAsked2Create: number = new Date().getTime();
  public timesCSSCreated: number = 0;
  public timeBetweenReCreate: number = 300;
  public useTimer: boolean = true;
  private constructor() {}

  public static getInstance(): ValuesSingleton {
    if (!ValuesSingleton.instance) {
      ValuesSingleton.instance = new ValuesSingleton();
    }
    return ValuesSingleton.instance;
  }
}
