import { ValuesSingleton } from "../../../singletons/valuesSingleton";
interface BPNVals {
  hasBP: boolean;
  values: string[];
}
const values: ValuesSingleton = ValuesSingleton.getInstance();
export const look4BPNVals = async (
  class2CreateSplited: string[]
): Promise<BPNVals> => {
  if (values.bps.find((b: any) => class2CreateSplited[2] === b.bp)) {
    return {
      hasBP: true,
      values: class2CreateSplited.slice(3),
    };
  } else {
    return {
      hasBP: false,
      values: class2CreateSplited.slice(2),
    };
  }
};
