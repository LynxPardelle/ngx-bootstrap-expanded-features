/* Singletons */
import { ValuesSingleton } from '../../singletons/valuesSingleton';
/* Functions */
import { doCssCreate } from '../main/doCssCreate';
import { console_log } from '../console_log';
/* Types */
import { TLogPartsOptions } from '../../types';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('doUseRecurrentStrategy', t, p);
};
const multiLog = (toLog: [any, TLogPartsOptions?][]) => {
  console_log.multiBetterLogV1('doUseRecurrentStrategy', toLog);
};
export const doUseRecurrentStrategy = async (
  primordial: boolean = false,
  recurrent: boolean = false,
  updateClasses2Create?: string[],
): Promise<void> => {
  multiLog([
    [updateClasses2Create, 'updateClasses2Create'],
    [primordial, 'primordial'],
    [recurrent, 'recurrent'],
  ]);
  if (!recurrent) {
    values.lastTimeAsked2Create = Date.now();
  }
  multiLog([
    [values.useRecurrentStrategy, 'useRecurrentStrategy'],
    [values.lastTimeAsked2Create, 'lastTimeAsked2Create'],
    [new Date(values.lastTimeAsked2Create), 'lastTimeAsked2Create as Date'],
    [values.lastTimeCssCreateEnded, 'lastTimeCssCreateEnded'],
    [new Date(values.lastTimeCssCreateEnded), 'lastTimeCssCreateEnded as Date'],
    [values.timeBetweenReCreate, 'timeBetweenReCreate'],
    [values.cssCreateIsActive, 'cssCreateIsActive'],
    [values.timesCSSCreated, 'timesCSSCreated'],
  ]);
  if (
    (values.lastTimeCssCreateEnded + values.timeBetweenReCreate <
      values.lastTimeAsked2Create ||
      primordial === true ||
      values.timesCSSCreated === 0) &&
    !values.cssCreateIsActive
  ) {
    log(false, 'creationPostponed');
    values.timesCSSCreated++;
    values.cssCreateIsActive = true;
    values.lastTimeCssCreateEnded = await doCssCreate(
      updateClasses2Create
    );
    values.cssCreateIsActive = false;
    multiLog([
      [values.timesCSSCreated, 'timesCSSCreated after doCssCreate'],
      [
        values.lastTimeCssCreateEnded,
        'lastTimeCssCreateEnded after doCssCreate',
      ],
      [
        new Date(values.lastTimeCssCreateEnded),
        'lastTimeCssCreateEnded as Date after doCssCreate',
      ],
    ]);
    doUseRecurrentStrategy(false, true, updateClasses2Create);
  } else if (!recurrent) {
    log(true, 'creationPostponed');
  }
};
