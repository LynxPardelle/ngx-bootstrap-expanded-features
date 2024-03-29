import { ValuesSingleton } from '../../../singletons/valuesSingleton';
import { comboParser } from './comboParser';
const values: ValuesSingleton = ValuesSingleton.getInstance();
export const getNewClasses2Create = async (
  classes2Create: string[]
): Promise<string[]> => {
  // Get all HTMLElements in page
  Array.from(document.querySelectorAll('*')).forEach((value: Element) => {
    value.classList.forEach(async (item: any) => {
      let comb = Object.keys(values.combos).find((cs) => {
        return item.includes(cs);
      });
      if (!!comb && values.combos[comb]) {
        classes2Create = await comboParser(
          item,
          comb,
          value as HTMLElement,
          classes2Create
        );
      } else if (
        !comb &&
        !classes2Create.includes(item) &&
        item !== values.indicatorClass &&
        (item.includes(values.indicatorClass) ||
          Object.keys(values.abreviationsClasses).find((aC) =>
            item.includes(aC)
          ))
      ) {
        classes2Create.push(item);
      }
    });
  });
  return classes2Create;
};
