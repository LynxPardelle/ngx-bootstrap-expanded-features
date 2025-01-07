import { Component, OnInit } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
export interface IMethod {
  id: string;
  title: string;
  types: string;
  description: string;
  code: string;
  [key: string]: string;
}
@Component({
    selector: 'app-methods',
    templateUrl: './methods.component.html',
    styleUrls: ['./methods.component.scss'],
    standalone: false
})
export class MethodsComponent implements OnInit {
  public methods: IMethod[] = [
    {
      id: '0',
      title: `cssCreate`,
      types: 'css, create, crud, file, class',
      description: 'Create the css classes and puch it to the css file.',
      code: `cssCreate()
      /* Extra options:
        updateBefs: string[] | null = null // if not null, it will re-create the classes.
        primordial: boolean = false // if true, it will do it with a forced mode.
      */
      cssCreate(["bef-text-fairy","bef-bg-monster"], true)`,
    },
    {
      id: '1',
      title: 'createCSSRules',
      types: 'css, create, crud, file, class',
      description: 'Push rules to the bef-styles.css file.',
      code: `let rule = ".bef-bg-futurePop__OPA__0_03{background-color: rgba(151,0,255, 0.03) !important;}"
      /* Parameters:
        rule: string // the rule to push to the css file.
       */
      createCSSRules(rule)`,
    },
    {
      id: '1.25',
      title: 'colorToRGB',
      types:
        'color, hex, rgb, rgba, colorName, hsl, hsla, hwb, hwba, array, transform',
      description:
        'Transform any type of color(colorName, rgb, hex, hsl and hwb) to rgb in array.',
      code: `
      let hex = "#ff0000ff";
      /* Parameters:
        Hex: string // the hex color to convert.
      */
      let rgba = colorToRGB(hex) // return number[] - [255,0,0,1]`,
    },
    {
      id: '1.5',
      title: 'RGBToRGBA',
      types: 'color, rgb, rgba, array, transform',
      description: 'Transform rgb colors in an array to rgba.',
      code: `
      let rgb = [255,0,0];
      let alpha = 0.5;
      /* Parameters:
      rgb: number[] // the rgb in an array color to convert.
      alpha: number // the alpha of the color.
      */
      let rgba = RGBToRGBA(rgb, alpha) // return string - rgba(255,0,0,5)`,
    },
    {
      id: '1.75',
      title: 'parseRGB',
      types: 'color, rgb, rgba, array, transform',
      description: 'Transform rgb colors in an array to rgba.',
      code: `
      let rgb = "rgb(255,0,0)";
      /* Parameters:
      rgb: number[] // the rgb color to convert.
      */
      let rgba = parseRGB(rgb) // return number[] - [255,0,0,5]`,
    },
    {
      id: '2',
      title: 'HexToRGB',
      types: 'color, hex, rgb, rgba, array, transform',
      description: 'Transform hexadecimal colors to rgb.',
      code: `
      let hex = "#ff0000ff";
      /* Parameters:
        Hex: string // the hex color to convert.
      */
      let rgba = HexToRGB(hex) // return string - rgba(255,0,0,1)`,
    },
    {
      id: '2.25',
      title: 'HSLToRGB',
      types: 'color, hsl, hsla, rgb, rgba, array, transform',
      description: 'Transform hsl colors to rgb.',
      code: `
      let hsl = "hsla(0,100%,50%,1)";
      /* Parameters:
      HSL: string // the hsl color to convert.
      */
      let rgba = HSLToRGB(hsl) // return string - rgba(255,0,0,1)`,
    },
    {
      id: '2.50',
      title: 'HWBToRGB',
      types: 'color, hwb, rgb, rgba, array, transform',
      description: 'Transform hwb colors to rgb.',
      code: `
      let hwb = "hwb(0,0%,0%)";
      /* Parameters:
      HWB: string // the hwb color to convert.
      */
      let rgba = HWBToRGB(hwb) // return string - rgb(255,0,0)`,
    },
    {
      id: '3',
      title: 'shadeTintColor',
      types: 'color, hex, rgb, array, shade, tint, transform',
      description: 'Shade a color in percent.',
      code: `
      let rgba = [255,0,0,1];
      /* Parameters:
        rgb: number[] // the rgb color to convert in array.
        percent: number // the percent to shade the color.
      */
      let shaded = shadeTintColor(rgba, 50) // return number[] - [127,0,0,1]`,
    },
    {
      id: '4',
      title: 'cssValidToCamel',
      types: 'css, camelCase, camel, case, transform',
      description: 'Transform css properties to camelCase.',
      code: `
      let cssProperty = 'background-color';
      /* Parameters:
        st: string // the css property.
      */
      let camel = cssValidToCamel(cssProperty) // return string - 'backgroundColor'`,
    },
    {
      id: '5',
      title: 'camelToCSSValid',
      types: 'css, camelCase, camel, case, transform',
      description: 'Transform camelCase properties to css property.',
      code: `
      let camel = 'backgroundColor';
      /* Parameters:
        st: string // the camelCase string.
      */
      let cssProperty = cssValidToCamel(camel) // return string - 'background-color'`,
    },
    {
      id: '6',
      title: 'pushCssNamesParsed',
      types: 'css, cssNames, names, properties, add, push, new, create',
      description:
        'Add new cssNamesParsed to take it in count when creating the new classes.',
      code: `
      let cssNamesParsed = {
        bpos :'background-position'
      };
      /* Parameters:
        cssNamesParsed: {
          [key: string]: string;
        } // the new cssNamesParsed.
      */
      pushCssNamesParsed(cssNamesParsed)`,
    },
    {
      id: '7',
      title: 'pushBPS',
      types: 'css, break, points, media, query, add, push, new, create',
      description:
        'Add new breakpoints to take it in count when creating the new classes.',
      code: `
      let breakpoints = [{
        bp :'hell',
        value: '666px'
        bef: ''
      },];
      /* Parameters:
        breakpoints: IBPS[] = {
          bp: string;
          value: string;
          bef: string; // IMPORTAN: always empty.
      }[] // the new breakpoints.
      */
      pushBPS(breakpoints)`,
    },
    {
      id: '8',
      title: 'pushColors',
      types: 'color, add, push, new, create',
      description:
        'Add new colors to take it in count when creating the new classes.',
      code: `
      let colors = {
        tartaDeFresa: '#c575a5'
      };
      /* Parameters:
        colors: {
          [key: string]: string;
        } // the new colors.
      */
      pushColors(colors)`,
    },
    {
      id: '9',
      title: 'pushAbreviationsValues',
      types: 'abbreviation, value, abbreviations, add, push, new, create',
      description:
        'Add new abbreviations for values to take it in count when creating the new classes.',
      code: `
      let abreviationsValues = {
        bor1 :'5px__solid__black'
      };
      /* Parameters:
      abreviationsValues: {
          [key: string]: string;
        } // the new colors.
      */
      pushAbreviationsValues(abreviationsValues)`,
    },
    {
      id: '10',
      title: 'pushAbreviationsClasses',
      types:
        'abbreviation, class, classes, abbreviations, add, push, new, create',
      description:
        'Add new abbreviations for classes to take it in count when creating the new classes.',
      code: `
      let abreviationsClasses = {
        bgFO75: 'bef-bg-fairy__OPA__0_75',
        tFL: 'bef-textFirstLetter',
      };
      /* Parameters:
      abreviationsClasses: {
          [key: string]: string;
        } // the new colors.
      */
      pushAbreviationsClasses(abreviationsClasses)`,
    },
    {
      id: '11',
      title: 'pushCombos',
      types: 'combos, combo, add, push, new, create',
      description:
        'Add new combos to take it in count when creating the new classes.',
      code: `
      let combos = {
        boxOne: [
          'bef-w-85per bef-border-1px__solid__dark bef-bg-success bef-text-aqua bef-p-1_5rem',
        ],
        boxCustom: [
          'bef-w-VAL1',
          'bef-border-VAL2',
          'bef-bg-VAL3',
          'bef-text-VAL4',
          'bef-p-VAL5',
        ],
      };
      /* Parameters:
      combos: {
          [key: string]: string[];
        } // the new colors.
      */
      pushCombos(combos)`,
    },
    {
      id: '12',
      title: 'getColors',
      types: 'color, get, all',
      description: 'Get all the colors.',
      code: `let colors = getColors() // return { [key: string]: string; } - {tartaDeFresa : '#c575a5'}`,
    },
    {
      id: '13',
      title: 'getBPS',
      types: 'css, break, points, media, query, get, all',
      description: 'Get all the breakpoints.',
      code: `
      let breakpoints = getBPS() // return IBPS[] = {
          bp: string;
          value: string;
          bef: string; // IMPORTAN: always empty.
      }[] - [{
        bp :'hell',
        value: '666px'
        bef: ''
      },]`,
    },
    {
      id: '14',
      title: 'getAbreviationsClasses',
      types: 'abbreviation, value, abbreviations, get, all',
      description: 'Get all the abbreviations for values.',
      code: `let abreviationsValues = getAbreviationsClasses() // return {[key: string]: string;} - {bor1 :'5px__solid__black'}`,
    },
    {
      id: '15',
      title: 'getAbreviationsValues',
      types: 'abbreviation, class, classes, abbreviations, get, all',
      description: 'Get all the abbreviations for classes.',
      code: `let abreviationsClasses = getAbreviationsValues() // return {[key: string]: string;} - {bgFO75: 'bef-bg-fairy__OPA__0_75',tFL: 'bef-textFirstLetter',}`,
    },
    {
      id: '16',
      title: 'getCombos',
      types: 'combos, combo, get, all',
      description: 'Get all the combos.',
      code: `let combos = getCombos() // return { [key: string]: string[]; } - {boxOne: ['bef-w-85per bef-border-1px__solid__dark bef-bg-success bef-text-aqua bef-p-1_5rem'],boxCustom: ['bef-w-VAL1','bef-border-VAL2','bef-bg-VAL3','bef-text-VAL4','bef-p-VAL5',]}`,
    },
    {
      id: '17',
      title: 'getCssNamesParsed',
      types: 'css, cssNames, names, properties, get, all',
      description: 'Get all the cssNamesParsed.',
      code: `let cssNamesParsed = getCssNamesParsed() // return { [key: string]: string; } - {bpos :'background-position'}`,
    },
    {
      id: '18',
      title: 'getColorsNames',
      types: 'color, get, all',
      description: 'Get all the names of the colors.',
      code: `let colorsNames = getColorsNames() // return string[] - ['tartaDeFresa',]`,
    },
    {
      id: '19',
      title: 'getColorValue',
      types: 'color, get, value',
      description: 'Get the value of a color Name.',
      code: `
      let colorName = 'tartaDeFresa';
      /* Parameters:
        colorName: string // the name of the color.
      */
      let colorValue = getColors(colorName) // return string - '#c575a5'`,
    },
    {
      id: '20',
      title: 'getAlreadyCreatedClasses',
      types: 'classes, get, all',
      description: 'Get all the already created classes.',
      code: `let alreadyCreatedClasses = getAlreadyCreatedClasses() // return string[] - ['bef-text-tartaDeFresa',]`,
    },
    {
      id: '21',
      title: 'getSheet',
      types: 'sheet, get',
      description: 'Get all the already created classes.',
      code: `let sheet = getSheet() // return CSSStyleSheet`,
    },
    {
      id: '22',
      title: 'updateColor',
      types: 'color, change, update, modify',
      description: 'Update a color and re-create de classes that have it.',
      code: `
      let color = 'tartaDeFresa';
      let value = '#df66b5';
      /* Parameters:
        color: string // the name of the color.
        value: string // the value of the color.
      */
      updateColor(color, value)`,
    },
    {
      id: '23',
      title: 'updateabreviationsValue',
      types: 'abbreviation, value, abbreviations, change, update, modify',
      description:
        'Update a abbreviation for a values and re-create de classes that have it.',
      code: `
      let abreviationsValue = 'bor1';
      let value = '5px__solid__black';
      /* Parameters:
      abreviationsValue: string // the new abbreviation.
      value: string // the new value.
      */
      updateabreviationsValue(abreviationsValue, value)`,
    },
    {
      id: '24',
      title: 'updateabreviationsClass',
      types:
        'abbreviation, class, classes, abbreviations, change, update, modify',
      description:
        'Update a abbreviation for a class and re-create de classes that have it.',
      code: `
      let abreviationsClass = 'bgFO75';
      let value = 'bef-bg-fairy__OPA__0_75';
      /* Parameters:
      abreviationsClass: string // the new abbreviation.
      value: string // the new value.
      */
      updateabreviationsClass(abreviationsClass, value)`,
    },
    {
      id: '25',
      title: 'updateCombo',
      types: 'combos, combo, change, update, modify',
      description: 'Update a combo  and re-create de classes that have it.',
      code: `
      let combo = 'boxOne';
      let value = 'bef-w-75per bef-border-1px__solid__dark bef-bg-success bef-text-aqua bef-p-1_5rem';
      /* Parameters:
      combo: string // the new combo.
      value: string // the new value.
      */
      updateCombo(combo, value)`,
    },
    {
      id: '26',
      title: 'updateCssNamesParsed',
      types: 'css, cssNames, names, properties, change, update, modify',
      description:
        'Update a cssNamesParse and re-create de classes that have it.',
      code: `
      let cssNameParsed = 'bpos';
      let = 'background-position'
      };
      /* Parameters:
        cssNameParsed: string // the new cssNamesParsed.
        value: string // the new value.
      */
      updateCssNamesParsed(cssNameParsed, value)`,
    },
    {
      id: '27',
      title: 'updateClasses',
      types: 'css, class, classes, change, update, modify',
      description: 'Re-create classes.',
      code: `
      let classesToUpdate = ['bef-text-fairy','bef-bg-monster'];
      /* Parameters:
        classesToUpdate: string[] // the classes to re-create.
      */
      updateClasses(classesToUpdate)`,
    },
    {
      id: '28',
      title: 'deleteColor',
      types: 'color, delete, trash, clear',
      description:
        'Delete a color but not the classes related with that color.',
      code: `
      let color = 'primary';
      /* Parameters:
        color: string // the name of the color.
      */
      deleteColor(color)`,
    },
    {
      id: '29',
      title: 'clearAllColors',
      types: 'color, colors, delete, trash, clear',
      description: 'Delete all colors but not the classes related with them.',
      code: `clearAllColors()`,
    },
    {
      id: '30',
      title: 'changeImportantActive',
      types: 'update, modify',
      description:
        "Change if you want to have or dont have !important in your clases, by default it's active.",
      code: `changeImportantActive()`,
    },
    {
      id: '31',
      title: 'changeDebugOption',
      types: 'debug, console, update, modify',
      description: 'Change if you want to see the debug messages or not.',
      code: `changeDebugOption()`,
    },
    {
      id: '32',
      title: 'changeUseTimerOption',
      types: 'time, create, update, modify',
      description:
        'Change if you want to block or unblock the time to create the css.',
      code: `changeUseTimerOption()`,
    },
    {
      id: '33',
      title: 'setTimeBetweenReCreate',
      types: 'time, create, update, modify',
      description: 'Change the time to create the css.',
      code: `
      let time = 300;
      /* Parameters:
        time: number // the time in milliseconds.
      */
      setTimeBetweenReCreate(time)`,
    },
    {
      id: '34',
      title: 'unbefysize',
      types: 'utility, transform, bef',
      description: 'Traduce the reserved words of a bef class.',
      code: `
      let value = 'bef-wSEL__spanHover-calcSD50px__PLUS__75perED__OPA__0_5';
      /* Parameters:
        value: string // the bef class.
      */
      let befClassTraduced = unbefysize(value) // return string - 'bef-widthSEL spanHover-calc(50px + 75%) OPA 0.5;'`,
    },
    {
      id: '35',
      title: 'befysize',
      types: 'utility, transform, bef',
      description:
        'Traduce bef class with breaking characters to a bef class with the reserved words.',
      code: `
      let value = 'bef-widthSEL spanHover-calc(50px + 75%) OPA 0.5';
      /* Parameters:
        value: string // the value to make a bef class.
      */
      let befClass = befysize(befClass) // return string - 'bef-wSEL__spanHover-calcSD50px__PLUS__75perED__OPA__0_5'`,
    },
    {
      id: '36',
      title: 'consoleLog',
      types: 'debug, console, log, info, trace, error',
      description: 'Show something in the console with some improvements.',
      code: `
      /* Parameters:
        type: 'log' | 'info' | 'trace' | 'error' = 'log', // the type of console log.
        thing: any, // the thing to show in the console.
        style: string = this.styleConsole, // the style of the console log.
        line: string | null = null, // the line of the console log.
        stoper: boolean = !this.isDebug // if true, it will not show the console anymore.
      */
      consoleLog('log', 'Hello World!', 'color: red; font-size: 20px;', 'line 1', false)`,
    },
    {
      id: '37',
      title: 'consoleParser',
      types: 'debug, console, log, info, trace, error',
      description:
        'Show something in the console with some improvements, more eficient that the consoleLog().',
      code: `
      /* Parameters:
      config: IConsoleParser = {
        type?: 'log' | 'info' | 'trace' | 'error' = 'log', // the type of console log.
        thing: any, // the thing to show in the console.
        style?: string = this.styleConsole, // the style of the console log.
        line?: string | null = null, // the line of the console log.
        stoper?: boolean = !this.isDebug // if true, it will not show the console anymore.
      }
      */
      consoleParser({
        thing: 'Hello World!',
      })`,
    },
  ];
  public showMethods: { [key: string]: boolean } = {};
  public methods2ShowKeys: string[] = [];
  public filter: any = '';
  constructor(private _befService: BefService) {}
  ngOnInit(): void {
    this.clearFilter();
    this.cssCreate();
  }
  doFilter() {
    this.showMethods = {};
    this.methods2ShowKeys = [];
    let filterRegex = new RegExp(this.filter, 'i');
    this.methods.forEach((method) => {
      if (
        method.title.toLowerCase().includes(this.filter.toLowerCase()) ||
        method.types.toLowerCase().includes(this.filter.toLowerCase()) ||
        method.description.toLowerCase().includes(this.filter.toLowerCase())
      ) {
        this.showMethods[method.id] = true;
        this.methods2ShowKeys.push(method.id);
      }
    });
  }
  clearFilter() {
    this.filter = '';
    this.methods.forEach((method) => {
      this.showMethods[method.id] = true;
      if (!this.methods2ShowKeys.includes(method.id)) {
        this.methods2ShowKeys.push(method.id);
      }
    });
  }
  cssCreate() {
    this._befService.cssCreate();
  }
}
