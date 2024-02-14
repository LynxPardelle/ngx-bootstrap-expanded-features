import { console_log } from '../../../functions/console_log';

type TVals2Sort = {
  index: number;
  val: string;
};
export const values4ComboGetter = async (
  class2Create: string
): Promise<string[]> => {
  if (!!class2Create.includes('VALS')) {
    let valsSource: string = class2Create.split('VALS')[1];
    console_log.consoleLog('info', { valsSource: valsSource });
    let valueReg = new RegExp(/VAL([0-9_]+)N[A-z0-9]+VAL\1N/, 'g');
    if (valueReg.test(valsSource)) {
      let valsToSortSource: RegExpMatchArray | null =
        valsSource.match(valueReg);
      console_log.consoleLog('info', { valsToSortSource: valsToSortSource });
      if (!!valsToSortSource) {
        let valsToSortExtras: TVals2Sort[] = [];
        let valsToSort: TVals2Sort[] = valsToSortSource.map((v: string) => {
          let index: string = v.split('VAL')[1].split('N')[0];
          let valReplace: RegExp = new RegExp(`VAL${index}N`, 'g');
          let firstIndex: number = parseInt(index);
          if (index.includes('_')) {
            let indexes: string[] = index.split('_');
            firstIndex = parseInt(indexes[0]);
            indexes.forEach((i: string, it: number) => {
              if (it > 0) {
                valsToSortExtras.push({
                  index: parseInt(i),
                  val: v.replace(valReplace, ''),
                });
              }
            });
          }
          return {
            index: firstIndex,
            val: v.replace(valReplace, ''),
          };
        });
        valsToSort = valsToSort.concat(valsToSortExtras);
        console_log.consoleLog('info', { valsToSort: valsToSort });
        let valsNotSorted: string[] = valsSource.split('VL');
        console_log.consoleLog('info', { valsNotSorted: valsNotSorted });
        let noValsNotSorted: boolean = false;
        if (valsNotSorted.length >= 1) {
          valsNotSorted.shift();
        }
        if (valsNotSorted.length <= 0) {
          noValsNotSorted = true;
        }
        console_log.consoleLog('info', { noValsNotSorted: noValsNotSorted });
        let ocupedIndexes: number[] = valsToSort.map((v) => v.index);
        console_log.consoleLog('info', { ocupedIndexes: ocupedIndexes });
        if (!noValsNotSorted) {
          // Sort the valsNotSorted with indexes not used
          let valsNotSortedSorted: TVals2Sort[] = valsNotSorted.map((v) => {
            let index = 1;
            while (ocupedIndexes.includes(index)) {
              index++;
            }
            ocupedIndexes.push(index);
            return {
              index: index,
              val: v,
            };
          });
          console_log.consoleLog('info', {
            valsNotSortedSorted: valsNotSortedSorted,
          });
          valsNotSortedSorted.sort((v1, v2) => {
            return v1.index - v2.index;
          });
          console_log.consoleLog('info', {
            valsNotSortedSortedSorted: valsNotSortedSorted,
          });
          valsToSort = valsToSort.concat(valsNotSortedSorted);
          valsToSort.sort((v1, v2) => {
            return v1.index - v2.index;
          });
          console_log.consoleLog('info', { valsToSort: valsToSort });
        }
        let emptyValsToFillValsSorted: TVals2Sort[] = [];
        let lastValIndex = valsToSort.sort((v1, v2) => {
          return v1.index - v2.index;
        })[valsToSort.length - 1].index;
        console_log.consoleLog('info', { lastValIndex: lastValIndex });
        for (let i = 0; i < lastValIndex; i++) {
          if (!ocupedIndexes.includes(i)) {
            emptyValsToFillValsSorted.push({
              index: i,
              val: '',
            });
          }
        }
        console_log.consoleLog('info', {
          emptyValsToFillValsSorted: emptyValsToFillValsSorted,
        });
        let valsSorted: TVals2Sort[] = valsToSort
          .concat(emptyValsToFillValsSorted)
          .sort((v1, v2) => {
            return v1.index - v2.index;
          });
        console_log.consoleLog('info', { valsSorted: valsSorted });
        return valsSorted.map((v) => v.val);
      } else {
        return valsSource.split('VL');
      }
    } else {
      return valsSource.split('VL');
    }
  } else {
    return [];
  }
};
