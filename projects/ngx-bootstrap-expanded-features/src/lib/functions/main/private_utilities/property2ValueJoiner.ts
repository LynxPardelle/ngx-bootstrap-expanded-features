/* Singletons */
import { ValuesSingleton } from '../../../singletons/valuesSingleton';
import { css_camel } from '../../css-camel';
import { btnCreator } from './btnCreator';
const values: ValuesSingleton = ValuesSingleton.getInstance();
export const property2ValueJoiner = async (
  property: string,
  class2CreateSplited: string[],
  class2Create: string,
  propertyValues: string[] = [''],
  specify: string = ''
): Promise<string> => {
  switch (true) {
    case !!values.cssNamesParsed[property.toString()]:
      let cssNameParsed = values.cssNamesParsed[property.toString()];
      if (typeof cssNameParsed === 'string') {
        return `${specify}{${values.cssNamesParsed[property.toString()]}:${
          propertyValues[0]
        };}`;
      } else {
        return `${specify}{${cssNameParsed
          .map((c: any, i: number) => {
            return `${c}:${propertyValues[i] || propertyValues[0] || ''};`;
          })
          .join('')}}`;
      }
      break;
    case class2CreateSplited[1].startsWith('link'):
      return ` a${specify}{color:${propertyValues[0]};}`;
      break;
    case class2CreateSplited[1].startsWith('btnOutline'):
      return await btnCreator(
        class2Create,
        specify,
        propertyValues[0],
        propertyValues[1] || '',
        true
      );
      break;
    case class2CreateSplited[1].startsWith('btn'):
      return await btnCreator(class2Create, specify, propertyValues[0]);
      break;
    default:
      return `${specify}{${css_camel.camelToCSSValid(property)}:${
        propertyValues[0]
      };}`;
      break;
  }
};
