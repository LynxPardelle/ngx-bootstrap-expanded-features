import { Injectable } from '@angular/core';
/* Interfaces */
import { IAbreviationTraductor, IConsoleParser, IPseudo } from './interfaces';
/* Singleton */
import { ValuesSingleton } from './singletons/valuesSingleton';
/* Functions */
import { abreviation_traductors } from './functions/abreviation_traductors';
import { color_transform } from './functions/color_transform';
import { console_log } from './functions/console_log';
import { css_camel } from './functions/css-camel';
import { cssCreate } from './functions/cssCreate';
import { debugg_options } from './functions/debugg_options';
import { manage_abreviations } from './functions/manage_abreviations';
import { manage_bps } from './functions/manage_bps';
import { manage_classes } from './functions/manage_classes';
import { manage_colors } from './functions/manage_colors';
import { manage_combos } from './functions/manage_combos';
import { manage_CSSNamesParsed } from './functions/manage_CSSNamesParsed';
import { manage_CSSRules } from './functions/manage_CSSRules';
import { manage_sheet } from './functions/manage_sheet';
import { utility_configurations } from './functions/utility_configurations';
import { managePartsSections } from './functions/managePartsNSectionsToSeeOnLog';
/* Types */
import { TLogPartsOptions, TLogSectionOptions } from './types';
@Injectable({
  providedIn: 'root',
})
export class NgxBootstrapExpandedFeaturesService {
  public values: ValuesSingleton = ValuesSingleton.getInstance();
  public indicatorClass: string = this.values.indicatorClass;
  public colors: { [key: string]: string } = this.values.colors;
  public abreviationsClasses: { [key: string]: string } =
    this.values.abreviationsClasses;
  public abreviationsValues: { [key: string]: string } =
    this.values.abreviationsValues;
  public combos: { [key: string]: string[] } = this.values.combos;
  public combosCreated: { [key: string]: string } = this.values.combosCreated;
  public encryptCombo: boolean = this.values.encryptCombo;
  public encryptComboCharacters: string = this.values.encryptComboCharacters;
  public encryptComboCreatedCharacters: string =
    this.values.encryptComboCreatedCharacters;
  public cssNamesParsed: any = this.values.cssNamesParsed;
  public alreadyCreatedClasses: Set<string> = this.values.alreadyCreatedClasses;
  public sheet: any = this.values.sheet;
  public isDebug: boolean = this.values.isDebug;
  public bps: any = this.values.bps;
  public bpsSpecifyOptions: string[] = this.values.bpsSpecifyOptions;
  public limitBPS: boolean = this.values.limitBPS;
  public styleSheetToManage: string = this.values.styleSheetToManage;
  public separator: string = this.values.separator;
  public styleConsole: string = this.values.styleConsole;
  public pseudoClasses: string[] = this.values.pseudoClasses;
  public pseudosHasSDED: Set<string> = this.values.pseudosHasSDED;
  public pseudoElements: string[] = this.values.pseudoElements;
  public pseudos: IPseudo[] = this.values.pseudos;
  public importantActive: boolean = this.values.importantActive;
  public abreviationTraductors: IAbreviationTraductor[] =
    this.values.abreviationTraductors;
  public lastTimeAsked2Create: number = this.values.lastTimeAsked2Create;
  public timesCSSCreated: number = this.values.timesCSSCreated;
  public timeBetweenReCreate: number = this.values.timeBetweenReCreate;
  public useTimer: boolean = this.values.useTimer;
  constructor() {}
  public checkSheet = () => manage_sheet.checkSheet();
  public cssCreate = (
    updateBefs: string[] | null = null,
    primordial: boolean = false
  ) => cssCreate.cssCreate(updateBefs, primordial);
  public createCSSRules = (rule: string) =>
    manage_CSSRules.createCSSRules(rule);
  public colorToRGB = (color: string) => color_transform.colorToRGB(color);
  public RGBToRGBA = (rgb: number[], alpha: number) =>
    color_transform.RGBToRGBA(rgb, alpha);
  public parseRGB = (rgba: string) => color_transform.parseRGB(rgba);
  public HexToRGB = (Hex: string) => color_transform.HexToRGB(Hex);
  public HSLToRGB = (HSL: string) => color_transform.HSLToRGB(HSL);
  public HWBToRGB = (HWB: string) => color_transform.HWBToRGB(HWB);
  public shadeTintColor = (rgb: number[], percent: number) =>
    color_transform.shadeTintColor(rgb, percent);
  public cssValidToCamel = (st: string) => css_camel.cssValidToCamel(st);
  public camelToCSSValid = (st: string) => css_camel.camelToCSSValid(st);
  /* CRUD */
  public pushCssNamesParsed = (cssNamesParsed: any) =>
    manage_CSSNamesParsed.pushCssNamesParsed(cssNamesParsed);
  public pushBPS = (bps: any) => manage_bps.pushBPS(bps);
  public pushColors = (newColors: any) => manage_colors.pushColors(newColors);
  public pushAbreviationsValues = (abreviationsValues: any) =>
    manage_abreviations.pushAbreviationsValues(abreviationsValues);
  public pushAbreviationsClasses = (abreviationsClasses: any) =>
    manage_abreviations.pushAbreviationsClasses(abreviationsClasses);
  public pushCombos = (combos: any) => manage_combos.pushCombos(combos);
  /* Getters */
  public getColors = () => manage_colors.getColors();
  public getBPS = () => manage_bps.getBPS();
  public getAbreviationsValues = () =>
    manage_abreviations.getAbreviationsValues();
  public getAbreviationsClasses = () =>
    manage_abreviations.getAbreviationsClasses();
  public getCombos = () => manage_combos.getCombos();
  public getCssNamesParsed = () => manage_CSSNamesParsed.getCssNamesParsed();
  public getColorsNames = () => manage_colors.getColorsNames();
  public getColorValue = (color: string) => manage_colors.getColorValue(color);
  public getAlreadyCreatedClasses = () =>
    manage_classes.getAlreadyCreatedClasses();
  public getSheet = () => manage_sheet.getSheet();
  /* Update */
  public updateColor = (color: string, value: string) =>
    manage_colors.updateColor(color, value);
  public updateAbreviationsClass = (abreviationsClass: string, value: string) =>
    manage_abreviations.updateAbreviationsClass(abreviationsClass, value);
  public updateAbreviationsValue = (abreviationsValue: string, value: string) =>
    manage_abreviations.updateAbreviationsValue(abreviationsValue, value);
  public updateCombo = (combo: string, values: string[]) =>
    manage_combos.updateCombo(combo, values);
  public updateCssNamesParsed = (cssNameParsed: string, value: string) =>
    manage_CSSNamesParsed.updateCssNamesParsed(cssNameParsed, value);
  public updateClasses = (classesToUpdate: string[]) =>
    manage_classes.updateClasses(classesToUpdate);
  /* Delete */
  public deleteColor = (color: string) => manage_colors.deleteColor(color);
  public clearAllColors = () => manage_colors.clearAllColors();
  /* Utility */
  public changeImportantActive = (active: boolean) =>
    utility_configurations.changeImportantActive(
      (active = !this.importantActive)
    );
  public changeDebugOption = (active: boolean = !this.isDebug) =>
    debugg_options.changeDebugOption(active);
  public changeUseTimerOption = (active: boolean = !this.useTimer) =>
    debugg_options.changeUseTimerOption(active);
  public setTimeBetweenReCreate = (time: number) =>
    debugg_options.setTimeBetweenReCreate(time);
  public unbefysize = (value: string) =>
    abreviation_traductors.unbefysize(value);
  public befysize = (value: string) => abreviation_traductors.befysize(value);
  public consoleLog = (
    type: 'log' | 'info' | 'trace' | 'error' = 'log',
    thing: any,
    style: string = this.values.styleConsole,
    line: string | undefined = undefined,
    stoper: boolean = !this.values.isDebug
  ) => console_log.consoleLog(type, thing, style, line, stoper);
  public consoleParser = (config: IConsoleParser) =>
    console_log.consoleParser(config);
  /* ManagePartsNSectionsForLog */
  public pushSection = (newSection: string) =>
    managePartsSections.pushSection(newSection);
  public pushPart = (newPart: string) => managePartsSections.pushPart(newPart);
  public getChosenSectionsOptions = () =>
    managePartsSections.getChosenSectionsOptions();
  public getChosenSectionsOptionsSections = () =>
    managePartsSections.getChosenSectionsOptionsSections();
  public getChosenSectionsOptionsParts = () =>
    managePartsSections.getChosenSectionsOptionsParts();
  public getAllPosibleSections = () =>
    managePartsSections.getAllPosibleSections();
  public getAllPosibleParts = () => managePartsSections.getAllPosibleParts();
  public changeSections = (newSections: TLogSectionOptions[]) =>
    managePartsSections.changeSections(newSections);
  public changeParts = (newParts: TLogPartsOptions[]) =>
    managePartsSections.changeParts(newParts);
  public deleteSection = (sectionToDelete: TLogSectionOptions) =>
    managePartsSections.deleteSection(sectionToDelete);
  public deletePart = (partToDelete: TLogPartsOptions) =>
    managePartsSections.deletePart(partToDelete);
}
