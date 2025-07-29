import { TChosenLogSectionOptions } from '../types';
import { defaultChosenSectionOptions } from '../values/parts_sections';

/**
 * ConfigSingleton manages basic configuration settings and global flags
 * for the ngx-bootstrap-expanded-features library.
 */
export class ConfigSingleton {
  private static instance: ConfigSingleton;

  // Core configuration
  public indicatorClass: string = 'bef';
  public separator: string = 'þµÞ';
  public specify: string = '🜏🜏🜏';
  public styleSheetToManage: string = 'bef-styles';

  // Feature flags
  public isDebug: boolean = false;
  public importantActive: boolean = true;
  public encryptCombo: boolean = true;
  public limitBPS: boolean = false;
  public useTimer: boolean = true;
  public useRecurrentStrategy: boolean = true;

  // Special characters for encryption
  public encryptComboCharacters: string = '■■■';
  public encryptComboCreatedCharacters: string = '🜔🜔🜔';

  // Breakpoint specification options
  public bpsSpecifyOptions: string[] = [
    '',
    'html',
    'html body',
    'html body #' + this.indicatorClass + '-bp',
    '#' + this.indicatorClass + '-bp',
  ];

  // Logging configuration
  public chosenSectionOptions: TChosenLogSectionOptions = defaultChosenSectionOptions;
  public styleConsole: string = '';

  private constructor() {
    this.initStyleConsole();
  }

  public static getInstance(): ConfigSingleton {
    if (!ConfigSingleton.instance) {
      ConfigSingleton.instance = new ConfigSingleton();
    }
    return ConfigSingleton.instance;
  }

  private initStyleConsole(): void {
    // Will be set properly once ColorsSingleton is available
    this.styleConsole = 'padding: 1rem; background-color: #f0f0f0; color: #333;';
  }

  /**
   * Updates the style console with colors from ColorsSingleton
   */
  public updateStyleConsole(mysticColor: string, lavenderLPColor: string): void {
    this.styleConsole = `padding: 1rem; background-color: ${mysticColor}; color: ${lavenderLPColor};`;
  }

  /**
   * Updates breakpoint specification options when indicator class changes
   */
  public updateBpsSpecifyOptions(): void {
    this.bpsSpecifyOptions = [
      '',
      'html',
      'html body',
      'html body #' + this.indicatorClass + '-bp',
      '#' + this.indicatorClass + '-bp',
    ];
  }

  /**
   * Sets the indicator class and updates related options
   */
  public setIndicatorClass(newClass: string): void {
    this.indicatorClass = newClass;
    this.updateBpsSpecifyOptions();
  }
}
