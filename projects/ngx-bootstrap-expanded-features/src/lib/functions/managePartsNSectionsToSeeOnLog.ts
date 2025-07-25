/* Singletons */
import { ValuesSingleton } from '../singletons/valuesSingleton';
/* Funtions */
import { console_log } from './console_log';
/* Types */
import {
  TChosenLogSectionOptions,
  TLogPartsOptions,
  TLogSectionOptions,
} from '../types';
import { allPosibleParts, allPosibleSections } from '../values/parts_sections';
const values: ValuesSingleton = ValuesSingleton.getInstance();
const log = (t: any, p?: TLogPartsOptions) => {
  console_log.betterLogV1('managePartsSections', t, p);
};
export const managePartsSections = {
  pushSection(
    newSection: string
  ): void | { errors: string[] } | { success: boolean; message: string } {
    const errors: string[] = [];
    log(values.chosenSectionOptions.sections, 'chosenSectionOptions.sections');
    try {
      if (values.chosenSectionOptions.sections.includes(newSection)) {
        errors.push(`The section "${newSection}" already exists.`);
      } else if (allPosibleSections.includes(newSection)) {
        values.chosenSectionOptions.sections.push(newSection);
      }
    } catch (err: unknown) {
      console_log.consoleLog('error', { err: err });
      if (err instanceof Error) {
        errors.push(`Error while pushing section: ${err.message}`);
      }
    }
    log(
      values.chosenSectionOptions.sections,
      'chosenSectionOptions.sections after pushSection'
    );
    if (errors.length > 0) {
      return { errors };
    } else {
      return {
        success: true,
        message: `Section "${newSection}" added successfully.`,
      };
    }
  },
  pushPart(
    newPart: string
  ): void | { errors: string[] } | { success: boolean; message: string } {
    const errors: string[] = [];
    log(values.chosenSectionOptions.parts, 'chosenSectionOptions.parts');
    try {
      if (values.chosenSectionOptions.parts.includes(newPart)) {
        errors.push(`The part "${newPart}" already exists.`);
      } else if (allPosibleParts.includes(newPart)) {
        values.chosenSectionOptions.parts.push(newPart);
      }
    } catch (err: unknown) {
      console_log.consoleLog('error', { err: err });
      if (err instanceof Error) {
        errors.push(`Error while pushing part: ${err.message}`);
      }
    }
    log(
      values.chosenSectionOptions.parts,
      'chosenSectionOptions.parts after pushPart'
    );
    if (errors.length > 0) {
      return { errors };
    } else {
      return {
        success: true,
        message: `Part "${newPart}" added successfully.`,
      };
    }
  },
  getChosenSectionsOptions(): TChosenLogSectionOptions {
    log(
      values.chosenSectionOptions,
      'chosenSectionOptions in getChosenSectionsOptions'
    );
    return values.chosenSectionOptions;
  },
  getChosenSectionsOptionsSections(): TLogSectionOptions[] {
    log(
      values.chosenSectionOptions.sections,
      'chosenSectionOptions.sections in getChosenSectionsOptionsSections'
    );
    return values.chosenSectionOptions.sections;
  },
  getChosenSectionsOptionsParts(): TLogPartsOptions[] {
    log(
      values.chosenSectionOptions.parts,
      'chosenSectionOptions.parts in getChosenSectionsOptionsParts'
    );
    return values.chosenSectionOptions.parts;
  },
  getAllPosibleSections(): TLogSectionOptions[] {
    log(allPosibleSections, 'allPosibleSections in getAllPosibleSections');
    return allPosibleSections;
  },
  getAllPosibleParts(): TLogPartsOptions[] {
    log(allPosibleParts, 'allPosibleParts in getAllPosibleParts');
    return allPosibleParts;
  },
  changeSections(
    newSections: TLogSectionOptions[]
  ): void | { errors: string[] } | { success: boolean; message: string } {
    const errors: string[] = [];
    log(values.chosenSectionOptions.sections, 'chosenSectionOptions.sections');
    try {
      if (
        newSections.some((section) => !allPosibleSections.includes(section))
      ) {
        errors.push(
          `One or more sections in the provided array do not exist in allPosibleSections.`
        );
      } else {
        values.chosenSectionOptions.sections = newSections;
      }
    } catch (err: unknown) {
      console_log.consoleLog('error', { err: err });
      if (err instanceof Error) {
        errors.push(`Error while changing sections: ${err.message}`);
      }
    }
    log(
      values.chosenSectionOptions.sections,
      'chosenSectionOptions.sections after changeSections'
    );
  },
  changeParts(
    newParts: TLogPartsOptions[]
  ): void | { errors: string[] } | { success: boolean; message: string } {
    const errors: string[] = [];
    log(values.chosenSectionOptions.parts, 'chosenSectionOptions.parts');
    try {
      if (newParts.some((part) => !allPosibleParts.includes(part))) {
        errors.push(
          `One or more parts in the provided array do not exist in allPosibleParts.`
        );
      } else {
        values.chosenSectionOptions.parts = newParts;
      }
    } catch (err: unknown) {
      console_log.consoleLog('error', { err: err });
      if (err instanceof Error) {
        errors.push(`Error while changing parts: ${err.message}`);
      }
    }
    log(
      values.chosenSectionOptions.parts,
      'chosenSectionOptions.parts after changeParts'
    );
  },
  deleteSection(
    sectionToDelete: TLogSectionOptions
  ): void | { errors: string[] } | { success: boolean; message: string } {
    const errors: string[] = [];
    log(values.chosenSectionOptions.sections, 'chosenSectionOptions.sections');
    try {
      if (!values.chosenSectionOptions.sections.includes(sectionToDelete)) {
        errors.push(`The section "${sectionToDelete}" does not exist.`);
      } else {
        values.chosenSectionOptions.sections =
          values.chosenSectionOptions.sections.filter(
            (section) => section !== sectionToDelete
          );
      }
    } catch (err: unknown) {
      console_log.consoleLog('error', { err: err });
      if (err instanceof Error) {
        errors.push(`Error while deleting section: ${err.message}`);
      }
    }
    log(
      values.chosenSectionOptions.sections,
      'chosenSectionOptions.sections after deleteSection'
    );
    if (errors.length > 0) {
      return { errors };
    } else {
      return {
        success: true,
        message: `Section "${sectionToDelete}" deleted successfully.`,
      };
    }
  },
  deletePart(
    partToDelete: TLogPartsOptions
  ): void | { errors: string[] } | { success: boolean; message: string } {
    const errors: string[] = [];
    log(values.chosenSectionOptions.parts, 'chosenSectionOptions.parts');
    try {
      if (!values.chosenSectionOptions.parts.includes(partToDelete)) {
        errors.push(`The part "${partToDelete}" does not exist.`);
      } else {
        values.chosenSectionOptions.parts =
          values.chosenSectionOptions.parts.filter(
            (part) => part !== partToDelete
          );
      }
    } catch (err: unknown) {
      console_log.consoleLog('error', { err: err });
      if (err instanceof Error) {
        errors.push(`Error while deleting part: ${err.message}`);
      }
    }
    log(
      values.chosenSectionOptions.parts,
      'chosenSectionOptions.parts after deletePart'
    );
    if (errors.length > 0) {
      return { errors };
    } else {
      return {
        success: true,
        message: `Part "${partToDelete}" deleted successfully.`,
      };
    }
  },
};
