import { ValuesSingleton } from "../singletons/valuesSingleton";

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const debugg_options = {
  changeDebugOption(option: boolean | undefined): void {
    values.isDebug = option || !values.isDebug;
  },
  changeUseTimerOption(option: boolean | undefined): void {
    values.useTimer = option || !values.useTimer;
  },
  setTimeBetweenReCreate(time: number): void {
    values.timeBetweenReCreate = time;
  },
};
