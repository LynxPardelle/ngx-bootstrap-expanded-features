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

const values: ValuesSingleton = ValuesSingleton.getInstance();
interface IparseClassReturn {
  class2Create: string;
  bpsStringed: IBPS[];
  classes2CreateStringed: string;
}
export const parseClass = async (
  class2Create: string,
  bpsStringed: IBPS[],
  classes2CreateStringed: string,
  updateClasses2Create: string[] | null = null
): Promise<IparseClassReturn> => {
  // Check if already created CssClass and return if it is
  if (!updateClasses2Create) {
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
    }
  } else {
    values.alreadyCreatedClasses.push(class2Create);
  }
  // Get the class for the final string from the original class2Create after the conversion of the abreviations
  let class2CreateStringed = '.' + class2Create;
  console_log.consoleLog('info', {
    class2CreateStringed: class2CreateStringed,
  });
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
  console_log.consoleLog('info', {
    class2CreateSplited: class2CreateSplited,
  });
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
  console_log.consoleLog('info', {
    classWithPseudosConvertedAndSELSplited:
      classWithPseudosConvertedAndSELSplited,
  });
  // Declaring the property to create the combinations and use Pseudos
  let property = classWithPseudosConvertedAndSELSplited[0];
  console_log.consoleLog('info', { property: property });
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
  console_log.consoleLog('info', { specify: specify });
  // Decrypt the combo of the class if it has been encrypted with the encryptCombo flag
  if (!!specify && values.encryptCombo) {
    console_log.consoleLog('info', {
      specifyPreDecryptCombo: specify,
      class2CreatePreDecryptCombo: class2Create,
      class2CreateStringedPreDecryptCombo: class2CreateStringed,
    });
    [specify, class2Create, class2CreateStringed] = await decryptCombo(
      specify,
      class2Create,
      class2CreateStringed
    );
    console_log.consoleLog('info', {
      specifyPostDecryptCombo: specify,
      class2CreatePostDecryptCombo: class2Create,
      class2CreateStringedPostDecryptCombo: class2CreateStringed,
    });
  }
  // Getting if the class has breakPoints, the value and the second value if it has
  let [hasBP, propertyValues] = Object.values(
    await look4BPNVals(class2CreateSplited)
  );
  console_log.consoleLog('info', {
    hasBP: hasBP,
    propertyValues: propertyValues,
  });
  // Traducing the values to the css notation
  propertyValues = await Promise.all(
    propertyValues.map(async (pv: string) => {
      return await valueTraductor(pv, property);
    })
  );
  console_log.consoleLog('info', {
    propertyValues: propertyValues,
  });
  if (!propertyValues[0]) {
    propertyValues[0] = 'default';
  }
  console_log.consoleLog('info', {
    class2CreateStringedBeforeProperty2ValueJoiner: class2CreateStringed,
  });
  // Joining the property and the values
  class2CreateStringed += await property2ValueJoiner(
    property,
    class2CreateSplited,
    class2Create,
    propertyValues,
    specify
  );
  console_log.consoleLog('info', {
    class2CreateStringedAfterProperty2ValueJoiner: class2CreateStringed,
  });
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
  console_log.consoleLog('info', {
    class2CreateStringedAfterImportant: class2CreateStringed,
  });
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
  console_log.consoleLog('info', {
    classes2CreateStringedAfterSeparators: classes2CreateStringed,
  });
  return {
    class2Create: class2Create,
    bpsStringed: bpsStringed,
    classes2CreateStringed: classes2CreateStringed,
  };
};
