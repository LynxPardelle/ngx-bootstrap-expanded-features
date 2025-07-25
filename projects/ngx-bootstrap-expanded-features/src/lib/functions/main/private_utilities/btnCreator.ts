/* Singletons */
import { ValuesSingleton } from '../../../singletons/valuesSingleton';
import { color_transform } from '../../color_transform';
import { console_log } from '../../console_log';
import { combinators } from '../../utilities/combinators';
import {
  TNameVal,
  TNameValNumber,
  TNameValProp,
} from '../private_types/types.private';
import { propertyNValueCorrector } from './propertyNValueCorrector';
/* Types */
import { TLogPartsOptions } from '../../../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('btnCreator', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('btnCreator', toLog);
};
export const btnCreator = async (
  class2Create: string,
  specify: string,
  value: string,
  secondValue: string = 'transparent',
  outline: boolean = false
): Promise<string> => {
  multiLog([
    [class2Create, 'class2Create'],
    [specify, 'specify'],
    [value, 'value'],
    [secondValue, 'secondValue'],
    [outline, 'outline'],
  ]);
  const combinatorsValuesNumbers = combinators.combineArrays<
    TNameVal,
    number,
    TNameValNumber
  >(
    {
      name: 'val',
      array: [
        { name: 'value', val: value },
        { name: 'secondValue', val: secondValue },
      ],
    },
    { name: 'number', array: [-15, -20, -25, 3] }
  );
  log(combinatorsValuesNumbers, 'combinatorsValuesNumbers');
  const shadesArray: TNameVal[] = await Promise.all(
    combinatorsValuesNumbers.map(
      async (a: TNameValNumber): Promise<TNameVal> => {
        return {
          name: `${a.val.name},${a.number}`,
          val: color_transform.getShadeTintColorOrGradient(a.number, a.val.val),
        };
      }
    )
  );
  log(shadesArray, 'shadesArray');
  const shades: { [key: string]: string } =
    combinators.combineIntoObject(shadesArray);
  multiLog([
    [shades, 'shades'],
    [shades['value,3'], `shades ['value,3']`],
    [shades['secondValue,3'], `shades ['secondValue,3']`],
  ]);
  let shadowColorValue: string = color_transform.opacityCreator(
    shades['value,3'],
    0.5
  );
  let shadowColorSecondValue: string = color_transform.opacityCreator(
    shades['secondValue,3'],
    0.5
  );
  log(shadowColorValue, 'shadowColorValue');
  const shadowNumericalValues: string = '0 0 0 0.25rem ';
  const correctVals: { [key: string]: string } = combinators.combineIntoObject(
    await Promise.all(
      combinators
        .combineArrays<TNameVal, string, TNameValProp>(
          {
            name: 'val',
            array: [
              { name: 'value', val: value },
              { name: 'secondValue', val: secondValue },
            ].concat(shadesArray),
          },
          { name: 'prop', array: ['background-color', 'color', 'border-color'] }
        )
        .map(async (a: TNameValProp): Promise<TNameVal> => {
          return {
            name: `${a.val.name},${a.prop}`,
            val: await propertyNValueCorrector(a.prop, a.val.val),
          };
        })
    )
  );
  const correctValsShadows: { [key: string]: string } =
    combinators.combineIntoObject(
      await Promise.all(
        combinators
          .combineArrays<TNameVal, string, TNameValProp>(
            {
              name: 'val',
              array: [
                {
                  name: 'shadowColorValue',
                  val: shadowNumericalValues + shadowColorValue,
                },
                {
                  name: 'shadowColorSecondValue',
                  val: shadowNumericalValues + shadowColorSecondValue,
                },
              ].concat(shadesArray),
            },
            {
              name: 'prop',
              array: ['box-shadow'],
            }
          )
          .map(async (a: TNameValProp): Promise<TNameVal> => {
            return {
              name: `${a.val.name}Corrected`,
              val: await propertyNValueCorrector(a.prop, a.val.val),
            };
          })
      )
    );
  multiLog([
    [correctVals, 'correctVals'],
    [correctValsShadows, 'correctValsShadows'],
  ]);
  let SpecifyRegex: RegExp = new RegExp(values.specify, 'g');
  let newRuleArray: string[] = [];
  /* Basic Button */
  newRuleArray.push(
    `${specify}{${
      !!outline
        ? correctVals['value,color'] +
          correctVals['secondValue,background-color'] +
          correctVals['value,border-color']
        : correctVals['value,background-color'] +
          correctVals['value,border-color']
    }}`.replace(SpecifyRegex, specify)
  );
  /* Hover Button */
  newRuleArray.push(
    `${values.specify}{${
      !!outline
        ? correctVals['secondValue,color'] +
          correctVals['value,-15,background-color'] +
          correctVals['secondValue,border-color']
        : correctVals['value,-20,border-color'] +
          correctVals['value,background-color']
    }}`.replace(SpecifyRegex, `.${class2Create}${specify}:hover`)
  );
  /* FocusButton */
  if (!!outline) {
    newRuleArray.push(
      `${values.specify}{${
        !!outline
          ? correctVals['secondValue,-15,background-color'] +
            correctVals['secondValue,-15,border-color']
          : correctVals['value,-15,background-color'] +
            correctVals['value,-15,border-color']
      }}`.replace(
        SpecifyRegex,
        `.btn-check:focus + .${class2Create}${specify}, .${class2Create}${specify}:focus`
      )
    );
  }
  /* Checked Button */
  newRuleArray.push(
    `${values.specify}{${
      !!outline
        ? correctVals['value,-25,border-color']
        : correctVals['value,-20,background-color'] +
          correctVals['value,-25,border-color']
    }${
      !!outline
        ? correctValsShadows['shadowColorValueCorrected']
        : correctValsShadows['shadowColorValueCorrected']
    }
  }`.replace(
      SpecifyRegex,
      `.btn-check:checked + .${class2Create}${specify}, .btn-check:active + .${class2Create}${specify}, .${class2Create}${specify}.active, .show > .${class2Create}${specify} .dropdown-toggle, .${class2Create}${specify}:active`
    )
  );
  newRuleArray.push(
    `${values.specify}{${
      !!outline
        ? correctValsShadows['shadowColorValueCorrected']
        : correctValsShadows['shadowColorValueCorrected']
    }}`.replace(
      SpecifyRegex,
      `.show > .${class2Create}${specify} .dropdown-toggle:focus, .btn-check:checked + .btn-check:focus, .btn-check:active + .${class2Create}${specify}:focus, .${class2Create}${specify}.active:focus, .${class2Create}${specify}:active:focus`
    )
  );
  log(newRuleArray, 'newRuleArray');
  return newRuleArray.filter((c) => c !== '').join(values.separator);
};
