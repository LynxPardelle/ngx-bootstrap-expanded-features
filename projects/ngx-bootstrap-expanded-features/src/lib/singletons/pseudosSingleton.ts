import { IPseudo } from '../interfaces';
import { css_camel } from '../functions/css-camel';

/**
 * PseudosSingleton manages CSS pseudo-classes and pseudo-elements
 * used throughout the library.
 */
export class PseudosSingleton {
  private static instance: PseudosSingleton;

  // Pseudo-classes
  public pseudoClasses: string[] = [
    'Active',
    'AnyLink',
    'Autofill',
    'Blank',
    'Checked',
    'Current',
    'Default',
    'Defined',
    'Dir',
    'Disabled',
    'Empty',
    'Enabled',
    'First',
    'FirstChild',
    'FirstOfType',
    'Focus',
    'FocusVisible',
    'FocusWithin',
    'Fullscreen',
    'Future',
    'Has',
    'Host',
    'Hover',
    'InRange',
    'Indeterminate',
    'Invalid',
    'Is',
    'Lang',
    'LastChild',
    'LastOfType',
    'Left',
    'Link',
    'LocalLink',
    'Modal',
    'Muted',
    'Not',
    'NthChild',
    'NthLastChild',
    'NthLastOfType',
    'NthOfType',
    'OnlyChild',
    'OnlyOfType',
    'Optional',
    'OutOfRange',
    'Past',
    'Paused',
    'PictureInPicture',
    'PlaceHolderShown',
    'Playing',
    'PopoverOpen',
    'ReadOnly',
    'ReadWrite',
    'Required',
    'Right',
    'Root',
    'Scope',
    'Seeking',
    'Stalled',
    'Target',
    'TargetWithin',
    'UserInvalid',
    'UserValid',
    'Valid',
    'Visited',
    'VolumeLocked',
    'Where',
  ];

  // Pseudo-elements
  public pseudoElements: string[] = [
    'After',
    'Backdrop',
    'Before',
    'Cue',
    'CueRegion',
    'FileSelectorButton',
    'FirstLetter',
    'FirstLine',
    'GrammarError',
    'Highlight',
    'Marker',
    'Part',
    'Placeholder',
    'Selection',
    'Slotted',
    'SpellingError',
    'TargetText',
    'ViewTransition',
    'ViewTransitionGroup',
    'ViewTransitionImagePair',
    'ViewTransitionNew',
    'ViewTransitionOld',
  ];

  // Pseudos that have start/end delimiters
  public pseudosHasSDED: Set<string> = new Set([
    'Dir',
    'Not',
    'Lang',
    'Has',
    'Host',
    'Is',
    'NthChild',
    'NthLastChild',
    'NthLastOfType',
    'NthOfType',
    'Part',
    'Slotted',
    'Where',
  ]);

  // Page-specific pseudos (for @page rules)
  public pageSpecificSet: Set<string> = new Set(['Right', 'Left']);

  // Combined and processed pseudos
  public pseudos: IPseudo[] = [];

  private constructor() {
    this.initializePseudos();
  }

  public static getInstance(): PseudosSingleton {
    if (!PseudosSingleton.instance) {
      PseudosSingleton.instance = new PseudosSingleton();
    }
    return PseudosSingleton.instance;
  }

  /**
   * Initializes the combined pseudos array with proper formatting
   */
  private initializePseudos(): void {
    const separator = 'þµÞ'; // Using the separator directly for now

    this.pseudos = this.pseudoClasses
      .sort((e1: string, e2: string) => e2.length - e1.length)
      .map((pse: string) => ({
        mask: pse,
        real: `${separator}:${css_camel.camelToCSSValid(pse)}`,
      }))
      .concat(
        this.pseudoElements
          .sort((e1: string, e2: string) => e2.length - e1.length)
          .map((pse: string) => ({
            mask: pse,
            real: `${separator}::${css_camel.camelToCSSValid(pse)}`,
          }))
      );
  }

  /**
   * Updates the separator and reinitializes pseudos
   */
  public updateSeparator(newSeparator: string): void {
    this.pseudos = this.pseudoClasses
      .sort((e1: string, e2: string) => e2.length - e1.length)
      .map((pse: string) => ({
        mask: pse,
        real: `${newSeparator}:${css_camel.camelToCSSValid(pse)}`,
      }))
      .concat(
        this.pseudoElements
          .sort((e1: string, e2: string) => e2.length - e1.length)
          .map((pse: string) => ({
            mask: pse,
            real: `${newSeparator}::${css_camel.camelToCSSValid(pse)}`,
          }))
      );
  }

  /**
   * Checks if a pseudo has start/end delimiters
   */
  public hasSDED(pseudoName: string): boolean {
    return this.pseudosHasSDED.has(pseudoName);
  }

  /**
   * Checks if a pseudo is page-specific
   */
  public isPageSpecific(pseudoName: string): boolean {
    return this.pageSpecificSet.has(pseudoName);
  }

  /**
   * Gets a pseudo by mask name
   */
  public getPseudoByMask(mask: string): IPseudo | undefined {
    return this.pseudos.find(pseudo => pseudo.mask === mask);
  }

  /**
   * Adds a custom pseudo-class
   */
  public addPseudoClass(pseudoClass: string): void {
    if (!this.pseudoClasses.includes(pseudoClass)) {
      this.pseudoClasses.push(pseudoClass);
      this.initializePseudos();
    }
  }

  /**
   * Adds a custom pseudo-element
   */
  public addPseudoElement(pseudoElement: string): void {
    if (!this.pseudoElements.includes(pseudoElement)) {
      this.pseudoElements.push(pseudoElement);
      this.initializePseudos();
    }
  }
}
