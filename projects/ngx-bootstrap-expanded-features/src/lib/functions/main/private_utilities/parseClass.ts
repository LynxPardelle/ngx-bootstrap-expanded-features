/* Singletons */
import { ValuesSingleton } from '../../../singletons/valuesSingleton';
/* Interfaces */
import { IBPS } from '../../../interfaces';
/* Functions */
import { abreviation_traductors } from '../../abreviation_traductors';
import { console_log } from '../../../functions/console_log';
import { convertPseudos } from './convertPseudos';
import { look4BPNVals } from './look4BPNVals';
import { valueTraductor } from './valueTraductor';
import { decryptCombo } from './decryptCombo';
import { property2ValueJoiner } from './property2ValueJoiner';
import { manage_cache } from '../../manage_cache';
/* Types */
import { TLogPartsOptions } from '../../../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('parseClass', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('parseClass', toLog);
};
interface IparseClassReturn {
  class2Create: string;
  bpsStringed: IBPS[];
  classes2CreateStringed: string;
}
/**
 * Parses a CSS class string and converts it into valid CSS rules with breakpoint support.
 *
 * This function takes a class name with abbreviated CSS properties and values, processes it through
 * various transformations including abbreviation expansion, pseudo-class conversion, breakpoint handling,
 * and value translation to generate valid CSS rules.
 *
 * @param class2Create - The CSS class name to parse and create (may contain abbreviations)
 * @param bpsStringed - Array of breakpoint objects containing breakpoint information
 * @param classes2CreateStringed - Accumulated string of CSS classes being created
 * @param isClean - Whether to check for already created classes to avoid duplicates (default: true)
 *
 * @returns Promise resolving to an object containing:
 *   - class2Create: The processed class name
 *   - bpsStringed: Updated breakpoint array with new CSS rules
 *   - classes2CreateStringed: Updated accumulated CSS classes string
 *
 * @example
 * ```typescript
 * await parseClass('bef-overflowX-hidden', [], '', true):
 * {
 *   class2Create: 'lib-margin-10',
 *   bpsStringed: [
 *      {
 *        "bp": "sm",
 *        "value": "576px",
 *        "class2Create": ""
 *      },
 *      {
 *        "bp": "md",
 *        "value": "768px",
 *        "class2Create": ""
 *      },
 *      {
 *        "bp": "lg",
 *        "value": "992px",
 *        "class2Create": ""
 *      },
 *      {
 *        "bp": "xl",
 *        "value": "1200px",
 *        "class2Create": ""
 *      },
 *      {
 *        "bp": "xxl",
 *        "value": "1400px",
 *        "class2Create": ""
 *      }
 *   ],
 *   classes2CreateStringed: '.bef-overflowX-hidden{overflow-x:hidden !important;}þµÞ'
 * }
 * ```
 *
 * @remarks
 * - Handles abbreviation expansion (e.g., 'm' to 'margin')
 * - Processes pseudo-classes and combinators
 * - Supports breakpoint-specific styling
 * - Applies important flags when active
 * - Maintains cache of already created classes to prevent duplicates
 * - Supports encrypted combo classes when encryption is enabled
 */
export const parseClass = async (
  class2Create: string,
  bpsStringed: IBPS[],
  classes2CreateStringed: string,
  isClean: boolean = true
): Promise<IparseClassReturn> => {
  // Early validation
  if (!class2Create || !values.sheet) {
    return {
      class2Create,
      bpsStringed: [],
      classes2CreateStringed: '',
    };
  }
  // Check cache first for instant response
  if (values.cacheActive) {
    const cachedResult = manage_cache.getCached<{
      class2Create: string;
      bpsStringed: IBPS[];
      classes2CreateStringed: string;
    }>(class2Create, 'parseClass');
    if (cachedResult) {
      return {
        class2Create: cachedResult.class2Create,
        bpsStringed: [...cachedResult.bpsStringed], // Deep copy arrays to prevent mutation
        classes2CreateStringed: cachedResult.classes2CreateStringed,
      };
    }
  }
  multiLog([
    [class2Create, 'class2Create'],
    [bpsStringed, 'bpsStringed'],
    [classes2CreateStringed, 'classes2CreateStringed'],
    [isClean, 'isClean'],
  ]);
  // Check if already created CssClass and return if it is
  if (isClean) {
    if (
      values.alreadyCreatedClasses.has(class2Create) ||
      [...values.sheet.cssRules].find((i: CSSRule) =>
        i.cssText.split(' ').find((aC: string) => {
          return aC.replace('.', '') === class2Create;
        })
      )
    ) {
      return {
        class2Create: class2Create,
        bpsStringed: bpsStringed,
        classes2CreateStringed: classes2CreateStringed,
      };
    } else {
      values.alreadyCreatedClasses.add(class2Create);
    }
  } else {
    values.alreadyCreatedClasses.add(class2Create);
  }
  log(values.alreadyCreatedClasses, 'alreadyCreatedClasses');
  // Get the class for the final string from the original class2Create after the conversion of the abreviations
  let class2CreateStringed = '.' + class2Create;
  log(class2CreateStringed, 'class2CreateStringed');
  // De-abreviate the class if it has abreviations
  if (!class2Create.includes(values.indicatorClass)) {
    let abbrClss = Object.keys(values.abreviationsClasses).find((aC) =>
      class2Create.includes(aC)
    );
    if (!!abbrClss) {
      class2Create = class2Create.replace(
        abbrClss,
        values.abreviationsClasses[abbrClss]
      );
    }
  }
  // Split to decompose and interpret the class to create
  /*
    [0] => indicatorClass
    [1] => css property
    [2] => bp or the first|unique value
   */
  const class2CreateSplited = class2Create.split('-');
  log(class2CreateSplited, 'class2CreateSplited');
  // Convert the pseudos from camel case into valid pseudo and separate pseudos and combinators from the property
  let comboCreatedKey: string | undefined;
  for (const cC of values.combosCreatedKeys) {
    if (class2Create.includes(cC)) {
      comboCreatedKey = cC;
      break;
    }
  }
  if (comboCreatedKey) {
    let comboKeyReg = new RegExp(comboCreatedKey, 'g');
    class2CreateSplited[1] = class2CreateSplited[1].replace(
      comboKeyReg,
      values.encryptComboCreatedCharacters
    );
  }

  // Convert pseudos and process selectors
  const classWithPseudosConvertedAndSELSplited = convertPseudos(
    class2CreateSplited[1]
  )
    .replace(/SEL/g, values.separator)
    .split(`${values.separator}`);

  log(
    classWithPseudosConvertedAndSELSplited,
    'classWithPseudosConvertedAndSELSplited'
  );

  // Declaring the property to create the combinations and use Pseudos
  const property = classWithPseudosConvertedAndSELSplited[0];
  log(property, 'property');

  // Optimized specify generation
  const specifyParts = classWithPseudosConvertedAndSELSplited.slice(1);
  let specify: string = abreviation_traductors.abreviationTraductor(
    specifyParts.join('')
  );

  // Handle combo key restoration
  if (comboCreatedKey) {
    const comboKeyCypherReg = values.cacheActive
      ? (manage_cache.getCached<RegExp>(
          `comboKeyCypherReg|${class2Create}`,
          'regExp',
          () => new RegExp(values.encryptComboCreatedCharacters, 'g')
        ) as RegExp)
      : new RegExp(values.encryptComboCreatedCharacters, 'g');
    class2CreateSplited[1] = class2CreateSplited[1].replace(
      comboKeyCypherReg,
      comboCreatedKey
    );
    multiLog([
      [specify, 'specify PreComboKeyRestoration'],
      [class2Create, 'class2Create PreComboKeyRestoration'],
      [class2CreateStringed, 'class2CreateStringed PreComboKeyRestoration'],
    ]);
    specify = specify.replace(comboKeyCypherReg, comboCreatedKey);
    class2Create = class2Create.replace(comboKeyCypherReg, comboCreatedKey);
    class2CreateStringed = class2CreateStringed.replace(
      comboKeyCypherReg,
      comboCreatedKey
    );
    multiLog([
      [specify, 'specify PostComboKeyRestoration'],
      [class2Create, 'class2Create PostComboKeyRestoration'],
      [class2CreateStringed, 'class2CreateStringed PostComboKeyRestoration'],
    ]);
  }

  // Decrypt the combo of the class if it has been encrypted with the encryptCombo flag
  if (!!specify && values.encryptCombo) {
    multiLog([
      [specify, 'specify PreDecryptCombo'],
      [class2Create, 'class2Create PreDecryptCombo'],
      [class2CreateStringed, 'class2CreateStringed PreDecryptCombo'],
    ]);
    [specify, class2Create, class2CreateStringed] = decryptCombo(
      specify,
      class2Create,
      class2CreateStringed
    );
    multiLog([
      [specify, 'specify PostDecryptCombo'],
      [class2Create, 'class2Create PostDecryptCombo'],
      [class2CreateStringed, 'class2CreateStringed PostDecryptCombo'],
    ]);
  }

  // Getting if the class has breakPoints, the value and the second value if it has
  const bpResult = look4BPNVals(class2CreateSplited);
  const [hasBP, propertyValues]: [boolean, string[]] = Object.values(
    bpResult
  ) as [boolean, string[]];

  multiLog([
    [hasBP, 'hasBP'],
    [propertyValues, 'propertyValues'],
  ]);

  // Optimized value translation with parallel processing
  const translatedValues = await Promise.all(
    propertyValues.map(async (pv: string) => {
      return await valueTraductor(pv, property);
    })
  );

  log(translatedValues, 'translatedValues');
  if (!translatedValues[0]) {
    translatedValues[0] = 'default';
  }
  multiLog([
    [translatedValues, 'translatedValues AfterValueTraductor'],
    [class2CreateSplited, 'class2CreateStringed BeforeProperty2ValueJoiner'],
  ]);

  // Joining the property and the values
  class2CreateStringed += await property2ValueJoiner(
    property,
    class2CreateSplited,
    class2Create,
    translatedValues,
    specify
  );

  log(class2CreateStringed, 'class2CreateStringed AfterProperty2ValueJoiner');

  // Put the important flag if it is active
  if (!!values.importantActive) {
    const importantRegex = values.cacheActive
      ? (manage_cache.getCached<RegExp>(
          `importantRegex|${class2Create}`,
          'regExp',
          () => new RegExp('\\s?!important\\s?', 'g')
        ) as RegExp)
      : new RegExp('\\s?!important\\s?', 'g');
    for (let cssProperty of class2CreateStringed.split(';')) {
      if (!cssProperty.includes('!important') && cssProperty.length > 5) {
        class2CreateStringed = class2CreateStringed
          .replace(cssProperty, cssProperty + ' !important')
          .replace(importantRegex, ' !important');
      }
    }
  }

  log(class2CreateStringed, 'class2CreateStringed AfterImportant');

  if (
    class2CreateStringed.includes('{') &&
    class2CreateStringed.includes('}')
  ) {
    if (hasBP === true) {
      const separatorRegex = values.cacheActive
        ? (manage_cache.getCached<RegExp>(
            `separatorRegex|${class2Create}`,
            'regExp',
            () => new RegExp(values.separator, 'g')
          ) as RegExp)
        : new RegExp(values.separator, 'g');
      class2CreateStringed = class2CreateStringed.replace(separatorRegex, '');

      // Optimized breakpoint assignment
      const targetBp = class2CreateSplited[2];
      for (let i = 0; i < bpsStringed.length; i++) {
        if (bpsStringed[i].bp === targetBp) {
          bpsStringed[i].class2Create += class2CreateStringed;
          break;
        }
      }
    } else {
      classes2CreateStringed += class2CreateStringed + values.separator;
    }
  }

  // Final cleanup
  classes2CreateStringed = classes2CreateStringed.replace(/\s+/g, ' ');

  multiLog([
    [class2Create, 'class2Create AfterSeparators'],
    [bpsStringed, 'bpsStringed AfterSeparators'],
    [classes2CreateStringed, 'classes2CreateStringed AfterSeparators'],
  ]);

  const result = {
    class2Create: class2Create,
    bpsStringed: bpsStringed,
    classes2CreateStringed: classes2CreateStringed,
  };

  if (values.cacheActive) {
    manage_cache.addCached(class2Create, 'parseClass', result);
  }

  return result;
};
