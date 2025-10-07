/* Singletons */
import { ValuesSingleton } from '../../singletons/valuesSingleton';
/* Functions */
import { console_log } from '../console_log';
import { doCssCreate } from '../main/doCssCreate';
/* Types */
import { TLogPartsOptions } from '../../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('doUseTimer', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('doUseTimer', toLog);
};
export const doUseTimer = (primordial: boolean = false, isFirstCall: boolean = true): number | void => {
  multiLog([
    [primordial, 'primordial'],
    [isFirstCall, 'isFirstCall'],
  ]);
  if (isFirstCall) {
    values.lastTimeAsked2Create = Date.now();
  }
  multiLog([
    [values.useTimer, 'useTimer'],
    [values.lastTimeAsked2Create, 'lastTimeAsked2Create'],
    [new Date(values.lastTimeAsked2Create), 'lastTimeAsked2Create as Date'],
    [values.lastTimeCssCreateEnded, 'lastTimeCssCreateEnded'],
    [new Date(values.lastTimeCssCreateEnded), 'lastTimeCssCreateEnded as Date'],
    [values.timeBetweenReCreate, 'timeBetweenReCreate'],
    [values.timesCSSCreated, 'timesCSSCreated'],
  ]);
  if (
    Date.now() - values.lastTimeCssCreateEnded >= values.timeBetweenReCreate ||
    primordial === true ||
    values.timesCSSCreated === 0
  ) {
    values.timesCSSCreated++;
    values.lastTimeCssCreateEnded = doCssCreate(values.timesCSSCreated);
    multiLog([
      [values.timesCSSCreated, 'timesCSSCreated after doCssCreate'],
      [values.lastTimeCssCreateEnded, 'lastTimeCssCreateEnded after doCssCreate'],
      [new Date(values.lastTimeCssCreateEnded), 'lastTimeCssCreateEnded as Date after doCssCreate'],
    ]);
    return values.lastTimeCssCreateEnded;
  } else if (Date.now() - values.timeBetweenReCreate < values.lastTimeAsked2Create) {
    // Delete the previous setTimeout if it exists
    if (values.setTimeOutID) {
      clearTimeout(values.setTimeOutID);
    }
    values.setTimeOutID = setTimeout(() => {
      return doUseTimer(primordial, false);
    }, values.timeBetweenReCreate);
  }
};
