import { TCombineArrays, TNameVal } from '../main/private_types/types.private';

export const combinators = {
  combineArrays<T, U, V>(a: TCombineArrays, b: TCombineArrays): V[] {
    return a.array.reduce(
      (acc: { [key: string]: string }[], val: T) => [
        ...acc,
        ...b.array.map((v: U) => ({ [a.name]: val, [b.name]: v })),
      ],
      []
    );
  },
  combineIntoObject(array: TNameVal[]): { [key: string]: string } {
    return array.reduce((acc: { [key: string]: any }, val: TNameVal) => {
      return { ...acc, [val.name]: val.val };
    }, {});
  },
};
