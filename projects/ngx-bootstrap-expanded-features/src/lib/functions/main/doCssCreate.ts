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
export const doCssCreate = (id: number, updateClasses2Create?: string[]): number => {
  try {
    log(updateClasses2Create, `updateClasses2Create [id:${id}]`);
    const startTimeCSSCreate = performance.now();
    const classes2Create: string[] = updateClasses2Create || getNewClasses2Create();
    log(classes2Create, `classes2Create [id:${id}]`);
    const classes2CreateStringed: string[] = [];
    const bpsStringed: IBPS[] = values.bps.map((b: any) => b);
    for (let class2Create of classes2Create) {
      let returnedClasses2CreateStringed: string;
      let returnedBpsStringed: IBPS | undefined;
      [returnedClasses2CreateStringed, returnedBpsStringed] = Object.values(
        parseClass(class2Create, !updateClasses2Create)
      );
      classes2CreateStringed.push(returnedClasses2CreateStringed);
      if (returnedBpsStringed) {
        for (let bps of bpsStringed) {
          if (bps.bp === returnedBpsStringed.bp) {
            bps.class2Create += returnedBpsStringed.class2Create;
            break;
          }
        }
      }
    }
    multiLog([
      [classes2CreateStringed, `classes2CreateStringed [id:${id}]`],
      [bpsStringed, `bpsStringed [id:${id}]`],
    ]);
    send2CreateRules(classes2CreateStringed.join(''), bpsStringed);
    const endTimeCSSCreate = performance.now();
    let timeToCreate: string | number = endTimeCSSCreate - startTimeCSSCreate;
    timeToCreate = timeToCreate.toFixed(2) + 'ms';
    console_log.consoleLog('info', `Call to cssCreate() took ${timeToCreate}.`);
    let class2CreateTimer = document.getElementById(values.indicatorClass + 'Timer');
    if (class2CreateTimer) {
      // create a first time created if there is no first time created element
      if (!document.getElementById('firstTimeCreated')) {
        const firstTimeCreated = document.createElement('p');
        firstTimeCreated.id = 'firstTimeCreated';
        firstTimeCreated.innerHTML = `The first time cssCreate() was called took ${timeToCreate}.`;
        class2CreateTimer.appendChild(firstTimeCreated);
      }
      const message = `Call to cssCreate() took ${timeToCreate}.`;
      let cssCreateMessage = document.getElementById('cssCreateMessage');
      if (!cssCreateMessage) {
        cssCreateMessage = document.createElement('p');
        cssCreateMessage.id = 'cssCreateMessage';
        cssCreateMessage.innerHTML = message;
        class2CreateTimer.appendChild(cssCreateMessage);
      } else {
        cssCreateMessage.innerHTML = message;
      }
    }
    return Date.now();
  } catch (err) {
    console_log.consoleLog('error', { err: err });
    return Date.now();
  }
};
