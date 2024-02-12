import { ValuesSingleton } from '../../../singletons/valuesSingleton';
import { console_log } from '../../console_log';
import { shadowGradientCreator } from './shadowGradientCreator';

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const propertyNValueCorrector = async (
  property2Use: string,
  value: string
): Promise<string> => {
  console_log.consoleLog('info', {
    property2Use: property2Use,
    value: value,
  });
  let newRule: string = '';
  if (['box-shadow'].includes(property2Use) && value.includes('gradient')) {
    let shadowRegex: RegExp =
      /(inset)?(\s?-?[0-9\.]+(?:(px)|(cm)|(mm)|(pt)|(in)|(pc)|(r?em)|(vmin)|(vh)|(vm(ax)?)|(%)|(vw))?\s?){2,4}(([A-z]+\-[A-z]+\([0-9\.]+(?:%|(deg)),\s*)?(((((?:(rgb)|(hsl))a?)\((([0-9]*)(%)?(deg)?,?\s?){1,4}(\/?\s?([0-9\.]*)(%)?\s?)\))|(#[0-9A-Fa-f]{3,8}))(\s*[0-9]*%,?\)?)?)*)(inset)?/g;
    let onlyGradientRegex: RegExp =
      /(([A-z]+\-[A-z]+\([0-9\.]+(?:%|(deg)),\s*)?(((((?:(rgb)|(hsl))a?)\((([0-9]*)(%)?(deg)?,?\s?){1,4}(\/?\s?([0-9\.]*)(%)?\s?)\))|(#[0-9A-Fa-f]{3,8}))(\s*[0-9]*%,?\)?)?)*)/g;
    console_log.consoleLog('info', { value4RShadowRegex: value });
    let shadows2Use: string[] = [''];
    const shadowMatches: RegExpMatchArray | null = value.match(shadowRegex);
    console_log.consoleLog('info', { shadowMatches: shadowMatches });
    const gradientMatches: RegExpMatchArray | null =
      value.match(onlyGradientRegex);
    console_log.consoleLog('info', { gradientMatches: gradientMatches });
    let onlyGradient: boolean = false;
    if (!!shadowMatches && shadowMatches.every((a) => a.includes('gradient'))) {
      shadows2Use = shadowMatches.filter((a) => a !== '' && a.length > 2);
    } else if (
      !!gradientMatches &&
      gradientMatches.every((a) => a.includes('gradient'))
    ) {
      shadows2Use = gradientMatches.filter((a) => a !== '' && a.length > 2);
      onlyGradient = true;
    }
    console_log.consoleLog('info', { shadows2Use: shadows2Use });
    let correctedShadows: string[] = await Promise.all(
      shadows2Use.map(async (a: string) => {
        return await shadowGradientCreator(a, onlyGradient);
      })
    );
    console_log.consoleLog('info', { correctedShadows: correctedShadows });
    let add2NewRule: string = correctedShadows
      .map((a: string, i: number) => {
        if (i <= 1) {
          return `${values.separator}${values.specify}${
            i === 0 ? '::before' : '::after'
          }{${a}`;
        } else {
          return '';
        }
      })
      .join('');
    console_log.consoleLog('info', { add2NewRule: add2NewRule });
    newRule = `transform-style:preserve-3d;}${add2NewRule}`;
    console_log.consoleLog('info', { newRuleWithShadow: newRule });
  } else {
    newRule = `${
      ['background-color', 'color'].includes(property2Use) &&
      value.includes('gradient')
        ? 'background-image'
        : property2Use === 'border-color' && value.includes('gradient')
        ? `border-image-source`
        : property2Use
    }:${value};${
      property2Use === 'color' && value.includes('gradient')
        ? `background-clip: text;background-size: 100%;-webkit-background-clip: text;-moz-background-clip: text;-webkit-text-fill-color: transparent;-moz-text-fill-color: transparent;`
        : property2Use === 'border-color' && value.includes('gradient')
        ? `border-image-slice:2;border-image-width:2px;`
        : ''
    }`;
  }
  console_log.consoleLog('info', { newRule: newRule });
  return newRule;
};
