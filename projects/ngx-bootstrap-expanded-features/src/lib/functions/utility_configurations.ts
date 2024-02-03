import { ValuesSingleton } from "../singletons/valuesSingleton";
import { cssCreate } from "./cssCreate";

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const utility_configurations = {
  changeImportantActive(option: boolean | undefined): void {
    values.importantActive = option || !values.importantActive;
    cssCreate.cssCreate();
  },
};
