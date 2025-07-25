/* Interfaces */
import { IBPS } from '../../interfaces';
/* Singletons */
import { ValuesSingleton } from '../../singletons/valuesSingleton';
/* Funtions */
import { console_log } from '../console_log';
/* Utilities */
import { getNewClasses2Create } from './private_utilities/getNewClasses2Create';
import { parseClass } from './private_utilities/parseClass';
import { send2CreateRules } from './private_utilities/send2CreateRules';
/* Types */
import { TLogPartsOptions } from '../../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('doCssCreate', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('doCssCreate', toLog);
};
export const doCssCreate = async (
  updateClasses2Create?: string[]
): Promise<number> => {
  try {
    log(updateClasses2Create, 'updateClasses2Create');
    const startTimeCSSCreate = performance.now();
    const classes2Create =
      updateClasses2Create || (await getNewClasses2Create());
    log(classes2Create, 'classes2Create');
    let classes2CreateStringed = '';
    let bpsStringed: IBPS[] = values.bps.map((b: any) => b);
    for (let class2Create of classes2Create) {
      [class2Create, bpsStringed, classes2CreateStringed] = Object.values(
        await parseClass(
          class2Create,
          bpsStringed,
          classes2CreateStringed,
          !updateClasses2Create
        )
      );
    }
    multiLog([
      [classes2CreateStringed, 'classes2CreateStringed'],
      [bpsStringed, 'bpsStringed'],
    ]);
    send2CreateRules(classes2CreateStringed, bpsStringed);
    const endTimeCSSCreate = await performance.now();
    log(
      `Call to doCssCreate() took ${endTimeCSSCreate - startTimeCSSCreate} milliseconds`,
      'performance'
    );
    let class2CreateTimer = document.getElementById(
      values.indicatorClass + 'Timer'
    );
    if (class2CreateTimer) {
      class2CreateTimer.innerHTML = `
            <p>
            Call to cssCreate() took ${
              endTimeCSSCreate - startTimeCSSCreate
            } milliseconds
            </p>
            `;
    }
    return Date.now();
  } catch (err) {
    console_log.consoleLog('error', { err: err });
    return Date.now();
  }
};
