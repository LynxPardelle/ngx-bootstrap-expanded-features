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
export const parseClass = async (
  class2Create: string,
  bpsStringed: IBPS[],
  classes2CreateStringed: string,
  isClean: boolean = true
): Promise<IparseClassReturn> => {
  multiLog([
    [class2Create, 'class2Create'],
    [bpsStringed, 'bpsStringed'],
    [classes2CreateStringed, 'classes2CreateStringed'],
    [isClean, 'isClean'],
  ]);
  // Check if already created CssClass and return if it is
  if (isClean) {
    if (
      values.alreadyCreatedClasses.find((aC: any) => {
        return aC === class2Create;
      }) ||
      [...values.sheet.cssRules].find((i) =>
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
      values.alreadyCreatedClasses.push(class2Create);
    }
  } else {
    values.alreadyCreatedClasses.push(class2Create);
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
  let class2CreateSplited = class2Create.split('-');
  log(class2CreateSplited, 'class2CreateSplited');
  // Convert the pseudos from camel case into valid pseudo and separate pseudos and combinators from the property
  let comboCreatedKey: string | undefined = Object.keys(
    values.combosCreated
  ).find((cC) => {
    return class2Create.includes(cC);
  });
  if (!!comboCreatedKey) {
    let comboKeyReg = new RegExp(comboCreatedKey, 'g');
    class2CreateSplited[1] = class2CreateSplited[1].replace(
      comboKeyReg,
      values.encryptComboCreatedCharacters
    );
  }
  let classWithPseudosConvertedAndSELSplited = convertPseudos(
    class2CreateSplited[1]
  )
    .replace(/SEL/g, values.separator)
    .split(`${values.separator}`);
  log(
    classWithPseudosConvertedAndSELSplited,
    'classWithPseudosConvertedAndSELSplited'
  );
  // Declaring the property to create the combinations and use Pseudos
  let property = classWithPseudosConvertedAndSELSplited[0];
  log(property, 'property');
  // Getting the specify to traduce the library abreviations to utilizable css notation
  let specify = abreviation_traductors.abreviationTraductor(
    classWithPseudosConvertedAndSELSplited
      .map((bs: any, i: any) => {
        if (i !== 0) {
          return bs;
        } else {
          return '';
        }
      })
      .join('')
  );
  if (!!comboCreatedKey) {
    let comboKeyCypherReg = new RegExp(
      values.encryptComboCreatedCharacters,
      'g'
    );
    class2CreateSplited[1] = class2CreateSplited[1].replace(
      comboKeyCypherReg,
      comboCreatedKey
    );
    specify = specify.replace(comboKeyCypherReg, comboCreatedKey);
    class2Create = class2Create.replace(comboKeyCypherReg, comboCreatedKey);
    class2CreateStringed = class2CreateStringed.replace(
      comboKeyCypherReg,
      comboCreatedKey
    );
  }
  log(specify, 'specify');
  // Decrypt the combo of the class if it has been encrypted with the encryptCombo flag
  if (!!specify && values.encryptCombo) {
    multiLog([
      [specify, 'specify PreDecryptCombo'],
      [class2Create, 'class2Create PreDecryptCombo'],
      [class2CreateStringed, 'class2CreateStringed PreDecryptCombo'],
    ]);
    [specify, class2Create, class2CreateStringed] = await decryptCombo(
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
  let [hasBP, propertyValues] = Object.values(
    await look4BPNVals(class2CreateSplited)
  );
  multiLog([
    [hasBP, 'hasBP'],
    [propertyValues, 'propertyValues'],
  ]);
  // Traducing the values to the css notation
  propertyValues = await Promise.all(
    propertyValues.map(async (pv: string) => {
      return await valueTraductor(pv, property);
    })
  );
  log(propertyValues, 'propertyValues');
  if (!propertyValues[0]) {
    propertyValues[0] = 'default';
  }
  multiLog([
    [propertyValues, 'propertyValues AfterValueTraductor'],
    [class2CreateSplited, 'class2CreateStringed BeforeProperty2ValueJoiner'],
  ]);
  // Joining the property and the values
  class2CreateStringed += await property2ValueJoiner(
    property,
    class2CreateSplited,
    class2Create,
    propertyValues,
    specify
  );
  log(class2CreateStringed, 'class2CreateStringed AfterProperty2ValueJoiner');
  // Put the important flag if it is active
  if (!!values.importantActive) {
    for (let cssProperty of class2CreateStringed.split(';')) {
      if (!cssProperty.includes('!important') && cssProperty.length > 5) {
        class2CreateStringed = class2CreateStringed
          .replace(cssProperty, cssProperty + ' !important')
          .replace(/(\s?\!important\s?)+/g, ' !important');
      }
    }
  }
  log(class2CreateStringed, 'class2CreateStringed AfterImportant');
  if (
    class2CreateStringed.includes('{') &&
    class2CreateStringed.includes('}')
  ) {
    if (hasBP === true) {
      class2CreateStringed = class2CreateStringed.replace(
        new RegExp(values.separator, 'g'),
        ''
      );
      bpsStringed = bpsStringed.map((b) => {
        if (class2CreateSplited[2] === b.bp) {
          b.class2Create += class2CreateStringed;
        }
        return b;
      });
    } else {
      classes2CreateStringed += class2CreateStringed + values.separator;
    }
  }
  multiLog([
    [class2Create, 'class2Create AfterSeparators'],
    [bpsStringed, 'bpsStringed AfterSeparators'],
    [classes2CreateStringed, 'classes2CreateStringed AfterSeparators'],
  ]);
  return {
    class2Create: class2Create,
    bpsStringed: bpsStringed,
    classes2CreateStringed: classes2CreateStringed,
  };
};
