/**
 * TimingSingleton manages time-related properties and functionality
 * for performance optimization and CSS creation timing.
 */
export class TimingSingleton {
  private static instance: TimingSingleton;

  // Time management
  public lastTimeAsked2Create: number = new Date().getTime();
  public timesCSSCreated: number = 0;
  public timeBetweenReCreate: number = 1000;
  public lastTimeCssCreateEnded: number = Date.now();

  // Creation postponement
  public creationPostponed: boolean = false;
  public setTimeOutID: ReturnType<typeof setTimeout> | null = null;

  private constructor() {}

  public static getInstance(): TimingSingleton {
    if (!TimingSingleton.instance) {
      TimingSingleton.instance = new TimingSingleton();
    }
    return TimingSingleton.instance;
  }

  /**
   * Updates the last time CSS creation was requested
   */
  public updateLastTimeAsked(): void {
    this.lastTimeAsked2Create = new Date().getTime();
  }

  /**
   * Updates the last time CSS creation ended
   */
  public updateLastTimeCssCreateEnded(): void {
    this.lastTimeCssCreateEnded = Date.now();
  }

  /**
   * Increments the CSS creation counter
   */
  public incrementCssCreated(): void {
    this.timesCSSCreated++;
  }

  /**
   * Checks if enough time has passed since last CSS creation
   */
  public canCreateCss(): boolean {
    const now = Date.now();
    return (now - this.lastTimeCssCreateEnded) >= this.timeBetweenReCreate;
  }

  /**
   * Gets the time elapsed since last CSS creation
   */
  public getTimeSinceLastCreation(): number {
    return Date.now() - this.lastTimeCssCreateEnded;
  }

  /**
   * Sets a timeout for postponed creation
   */
  public setCreationTimeout(callback: () => void, delay?: number): void {
    this.clearCreationTimeout();
    const actualDelay = delay || this.timeBetweenReCreate;
    this.creationPostponed = true;
    this.setTimeOutID = setTimeout(() => {
      this.creationPostponed = false;
      this.setTimeOutID = null;
      callback();
    }, actualDelay);
  }

  /**
   * Clears the creation timeout
   */
  public clearCreationTimeout(): void {
    if (this.setTimeOutID) {
      clearTimeout(this.setTimeOutID);
      this.setTimeOutID = null;
      this.creationPostponed = false;
    }
  }

  /**
   * Checks if creation is currently postponed
   */
  public isCreationPostponed(): boolean {
    return this.creationPostponed;
  }

  /**
   * Sets the time between recreation
   */
  public setTimeBetweenReCreate(time: number): void {
    if (time > 0) {
      this.timeBetweenReCreate = time;
    }
  }

  /**
   * Resets all timing data
   */
  public resetTiming(): void {
    this.lastTimeAsked2Create = new Date().getTime();
    this.timesCSSCreated = 0;
    this.lastTimeCssCreateEnded = Date.now();
    this.clearCreationTimeout();
  }

  /**
   * Gets timing statistics
   */
  public getTimingStats(): {
    lastTimeAsked: number;
    timesCSSCreated: number;
    timeBetweenReCreate: number;
    lastTimeCssCreateEnded: number;
    timeSinceLastCreation: number;
    creationPostponed: boolean;
    canCreateCss: boolean;
  } {
    return {
      lastTimeAsked: this.lastTimeAsked2Create,
      timesCSSCreated: this.timesCSSCreated,
      timeBetweenReCreate: this.timeBetweenReCreate,
      lastTimeCssCreateEnded: this.lastTimeCssCreateEnded,
      timeSinceLastCreation: this.getTimeSinceLastCreation(),
      creationPostponed: this.creationPostponed,
      canCreateCss: this.canCreateCss(),
    };
  }
}
