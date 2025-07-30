import { ValuesSingleton } from '../singletons/valuesSingleton';
import { cssCreate } from './cssCreate';
import { manage_cache } from './manage_cache';
const values: ValuesSingleton = ValuesSingleton.getInstance();
export const utility_configurations = {
  changeImportantActive(option: boolean | undefined): void {
    values.importantActive = option || !values.importantActive;
    if (values.cacheActive) {
      manage_cache.clearAllNoneEssential();
    }
    cssCreate.cssCreate();
  },
};
