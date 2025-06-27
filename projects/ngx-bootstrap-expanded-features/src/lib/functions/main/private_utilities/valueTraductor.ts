import { ValuesSingleton } from '../../../singletons/valuesSingleton';
import { abreviation_traductors } from '../../abreviation_traductors';
import { console_log } from '../../console_log';
import { color_transform } from './../../color_transform';
const values: ValuesSingleton = ValuesSingleton.getInstance();
export const valueTraductor = async (
  value: string,
  property: string
): Promise<string> => {
  value = abreviation_traductors.abreviationTraductor(
    !!values.abreviationsValues[value]
      ? values.abreviationsValues[value]
      : value
  );
  if (!property.includes('content')) {
    value = await opaParser(value);
    // MatchForColors and ReplaceForColors
    let colors = Object.keys(values.colors)
      .sort((c1, c2) => {
        return c2.length - c1.length;
      })
      .map((c) => `(${c})`)
      .join('|');
    let colorsRegString: string = `(?<![a-zA-Z0-9])(${colors})(?![a-zA-Z0-9])`;
    let colorsReg = new RegExp(colorsRegString, 'gi');
    let matches = value.match(colorsReg);
    console_log.consoleLog('info', { matches: matches });
    if (!!matches) {
      for (let match of matches) {
        console_log.consoleLog('info', { match: match });
        let realColor: string | undefined =
          values.colors[match.replace(/\s/g, '')];
        console_log.consoleLog('info', { realColor: realColor });
        let realColorValue: string = realColor;
        switch (true) {
          case !!realColor &&
            realColor.startsWith('rgb') &&
            !realColor.includes('rgba'):
            realColorValue = `rgba(${realColor}, 1)`;
            break;
          case !!realColor && realColor.startsWith('#'):
            realColorValue = `rgba(${color_transform.colorToRGB(
              realColor
            )}, 1)`;
            break;
          default:
            realColorValue = realColorValue;
        }
        console_log.consoleLog('info', { realColorValue: realColorValue });
        if (!!realColorValue) {
          value = value.replace(match, realColorValue);
          console_log.consoleLog('info', { value: value });
        }
      }
    }
  }
  return value;
};
export const opaParser = async (value: string): Promise<string> => {
  let hasOPA: boolean = value.includes('OPA');
  console_log.consoleLog('info', { hasOPA: hasOPA, value: value });
  if (!!hasOPA) {
    const reg = new RegExp(
      /(?:([A-z0-9#]*)|(?:(rgb)|(hsl)|(hwb))a?\([0-9\.\,\s%]*\))\s?OPA\s?0\.[0-9]*/gi
    );
    const OPAS: string[] | null = value.match(reg);
    if (!!OPAS) {
      await Promise.all(
        OPAS.map(async (OPA) => {
          const color = OPA.split('OPA')[0];
          const OPAValue = OPA.split('OPA')[1];
          const realColor = `${color_transform
            .colorToRGB(
              !!values.colors[color.toString().replace(/\s/g, '')]
                ? values.colors[color.toString().replace(/\s/g, '')]
                : color
            )
            .toString()}`;
          value = !!OPAValue
            ? value
                .replace(color, `rgba(${realColor},${OPAValue})`)
                .replace('OPA' + OPAValue, '')
            : value;
          return value;
        })
      );
    }
  }
  return value;
};
