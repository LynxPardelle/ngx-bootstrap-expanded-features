/* Singletons */
import { ValuesSingleton } from '../singletons/valuesSingleton';
/* Interfaces */
import { IBPS } from '../interfaces';
/* Funtions */
import { console_log } from './console_log';
import { cssCreate } from './cssCreate';

interface WithBefs {
  befs: string; // DEPRECATED
}
interface IBPSWithBefs extends IBPS, WithBefs {}
/* Types */
import { TLogPartsOptions } from '../types';
import { manage_cache } from './manage_cache';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('manageBps', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('manageBps', toLog);
};
export const manage_bps = {
  pushBPS(
    bps: (Omit<IBPSWithBefs, 'class2Create'> & {
      class2Create?: string;
    })[]
  ): void {
    try {
      for (let nb of bps) {
        // get the bps that match the current breakpoint
        let bp = values.bps.find((b: any) => b.bp === nb.bp);
        if (bp) {
          bp.value = nb.value;
          bp.class2Create = '';
        } else {
          values.bps.push({
            bp: nb.bp,
            value: nb.value,
            class2Create: '',
          });
          values.breakPoints.add(nb.bp);
        }
      }
      if (values.cacheActive) {
        manage_cache.clearAllNoneEssential();
      }
      cssCreate.cssCreate();
    } catch (err) {
      console_log.consoleLog('error', { err: err });
    }
  },
  getBPS(): IBPS[] {
    log(values.bps, 'bps');
    return values.bps;
  },
};
