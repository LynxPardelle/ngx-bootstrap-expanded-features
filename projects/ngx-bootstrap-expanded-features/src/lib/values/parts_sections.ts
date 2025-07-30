import {
  TChosenLogSectionOptions,
  TLogPartsOptions,
  TLogSectionOptions,
} from '../types';

export const allPosibleParts: string[] = [
  /* CssCreate */
  'manage_sheets',
  'updateClasses2Create',
  'primordial',
  'lastTimeAsked2Create',
  'timeBetweenReCreate',
  'timesCSSCreated',
  'lastTimeCssCreateEnded',
  /* doUseTimer */
  'isFirstCall',
  'useTimer',
  /* doUseRecurrentStrategy */
  'recurrent',
  'useRecurrentStrategy',
  'cssCreateIsActive',
  'timesCSSCreated',
  'creationPostponed',
  /* doCssCreate */
  'classes2Create',
  'classes2CreateStringed',
  'bpsStringed',
  'performance',
  /* getNewClasses2Create */
  'combos',
  'indicatorClass',
  'abreviationsClasses',
  'alreadyCreatedClasses',
  /* comboParser */
  'comb',
  'class2CreateElement',
  'combIndex',
  'vals',
  'c',
  'combosCreatedABBR',
  'alreadyABBRCombo',
  'combosCreatedKeys',
  'combCreatedKey',
  'comboABBR',
  'firstPseudo',
  'matches',
  'match',
  'valueToMatch',
  'def',
  'vals',
  'vals_val',
  'valval',
  'valsSource',
  'valsToSortSource',
  'valsToSort',
  'valsNotSorted',
  'noValsNotSorted',
  'ocupedIndexes',
  'valsNotSortedSorted',
  'lastValIndex',
  'emptyValsToFillValsSorted',
  'valsSorted',
  /* parseClass */
  'class2Create',
  'isClean',
  'class2CreateStringed',
  'classWithPseudosConvertedAndSELSplited',
  'property',
  'comboCreatedKey',
  'specify',
  'hasBP',
  'propertyValues',
  /* decryptCombo */
  'cs',
  'comboDecrypted',
  'combosCreatedKeys',
  'comboCreatedKey',
  'comboKeys',
  'comboKey',
  /* send2CreateRules */
  'bp',
  /* abreviationTraductors */
  'value',
  'translatorMap',
  /* convertPseudos */
  'thing',
  'remove',
  'pseudoFiltereds',
  /* valueTraductor */
  'realColor',
  'realColorValue',
  'hasOPA',
  /* btnCreator */
  'secondValue',
  'outline',
  'combinatorsValuesNumbers',
  'shadesArray',
  'shades',
  'shadowColorValue',
  'correctVals',
  'correctValsShadows',
  'newRuleArray',
  /* propertyNValueCorrector */
  'shadowMatches',
  'gradientMatches',
  'shadows2Use',
  'correctedShadows',
  'add2NewRule',
  'newRule',
  /* manageColors */
  'colors',
  'color',
  'colorValue',
  /* colorTransform */
  'colorMatches',
  'shade3Split',
  /* managePartsSections */
  'chosenSectionOptions',
  'chosenSectionOptions.sections',
  'chosenSectionOptions.parts',
  /* manageCSSRules */
  'rules',
  'dontSplitted',
  'rule',
  /* createSimpleRule */
  'newRule',
  /* createMediaRule */
  /* manageAbreviations */
  'abreviationsClasses',
  'abreviationsValues',
  /* manageBps */
  'bps',
  /* manageClasses */
  /* manageCombos */
  /* manageCSSNamesParsed */
  'cssNamesParsed',
  /* manageSheet */
  'sheet',
  /* shadowGradientCreator */
  'shadow',
  'onlyGradient',
  'hOffset',
  'vOffset',
  'blur',
  'spread',
] as const;
export const defaultChosenParts: TLogPartsOptions[] = allPosibleParts.map(
  (part) => part as TLogPartsOptions
) as TLogPartsOptions[];
export const allPosibleSections: string[] = [
  /* CssCreate */
  'cssCreate',
  'doUseTimer',
  'doUseRecurrentStrategy',
  'doCssCreate',
  'getNewClasses2Create',
  'comboParser',
  'valueComboReplacer',
  'values4ComboGetter',
  'parseClass',
  'decryptCombo',
  'send2CreateRules',
  /* abreviationTraductors */
  'abreviationTraductors',
  /* convertPseudos */
  'convertPseudos',
  /* valueTraductor */
  'valueTraductor',
  /* btnCreator */
  'btnCreator',
  /* propertyNValueCorrector */
  'propertyNValueCorrector',
  /* ManageColors */
  'manageColors',
  /* colorTransform */
  'colorTransform',
  /* managePartsSections */
  'managePartsSections',
  /* manageCSSRules */
  'manageCSSRules',
  /* createSimpleRule */
  'createSimpleRule',
  /* createMediaRule */
  'createMediaRule',
  /* manageAbreviations */
  'manageAbreviations',
  /* manageBps */
  'manageBps',
  /* manageClasses */
  'manageClasses',
  /* manageCombos */
  'manageCombos',
  /* manageCSSNamesParsed */
  'manageCSSNamesParsed',
  /* manageSheet */
  'manageSheet',
  /* shadowGradientCreator */
  'shadowGradientCreator'
] as const;
export const defaultChosenSections: TLogSectionOptions[] =
  allPosibleSections.map(
    (section) => section as TLogSectionOptions
  ) as TLogSectionOptions[];
export const defaultChosenSectionOptions: TChosenLogSectionOptions = {
  sections: defaultChosenSections as TLogSectionOptions[],
  parts: defaultChosenParts as TLogPartsOptions[],
};
