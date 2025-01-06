/* Singletons */
import { ValuesSingleton } from "../../singletons/valuesSingleton";
/* Functions */
import { doCssCreate } from "../main/doCssCreate";
import { console_log } from "../console_log";
const values: ValuesSingleton = ValuesSingleton.getInstance();
export const doUseRecurrentStrategy = async (
    updateClasses2Create: string[] | null = null,
    primordial: boolean = false,
    recurrent: boolean = false
): Promise<void> => {
    if (!recurrent) {
        values.lastTimeAsked2Create = Date.now();
    }
    console_log.consoleLog("info", { useRecurrentStrategy: values.useRecurrentStrategy });
    // Crea una condición que pase si values.lastTimeCssCreateEnded más values.timeBetweenReCreate es menor que lastTimeAsked2Create
    if ((values.lastTimeCssCreateEnded + values.timeBetweenReCreate < values.lastTimeAsked2Create ||
        primordial === true ||
        values.timesCSSCreated === 0) && !values.cssCreateIsActive) {
        console_log.consoleLog("info", { recurrent: recurrent });
        console_log.consoleLog("info", { lastTimeAsked2Create: values.lastTimeAsked2Create });
        console_log.consoleLog("info", { creationPostponed: false });
        console_log.consoleLog("info", { lastTimeCssCreateEnded: values.lastTimeCssCreateEnded });
        console_log.consoleLog("info", { timeBetweenReCreate: values.timeBetweenReCreate });
        console_log.consoleLog("info", { cssCreateIsActive: values.cssCreateIsActive });
        console_log.consoleLog("info", { timesCSSCreated: values.timesCSSCreated });
        console_log.consoleLog("info", { updateClasses2Create: updateClasses2Create });
        console_log.consoleLog("info", { primordial: primordial });
        values.timesCSSCreated++;
        values.cssCreateIsActive = true;
        const lastTimeCssCreateEnded: number = await doCssCreate.start(updateClasses2Create);
        values.lastTimeCssCreateEnded = lastTimeCssCreateEnded;
        console_log.consoleLog("info", { lastTimeCssCreateEnded: values.lastTimeCssCreateEnded });
        values.cssCreateIsActive = false;
        doUseRecurrentStrategy(updateClasses2Create, false, true);
    } else if (!recurrent) {
        console_log.consoleLog("info", { creationPostponed: true });
    }
};
