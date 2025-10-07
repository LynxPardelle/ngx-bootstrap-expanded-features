import { ValuesSingleton } from '../../../singletons/valuesSingleton';

const values: ValuesSingleton = ValuesSingleton.getInstance();
/**
 * Looks for breakpoint values in a split class string and determines if a breakpoint is present.
 *
 * @param class2CreateSplited - An array of strings representing a split CSS class name
 * @returns An object containing:
 *   - hasBP: boolean indicating whether a breakpoint was found
 *   - values: array of remaining class parts after the breakpoint (if found) or from index 2 (if not found)
 *
 * @example
 * ```typescript
 * const result = look4BPNVals(['bef', 'm', 'md', '1px']);
 * // If 'md' is a valid breakpoint: { hasBP: true, values: ['1px'] }
 * // If 'md' is not a breakpoint: { hasBP: false, values: ['md', '1px'] }
 * ```
 */
export const look4BPNVals = (
  class2CreateSplited: string[]
): {
  hasBP: boolean;
  values: string[];
} => {
  // Early bounds check to avoid accessing undefined array elements
  // Use cached Set for O(1) breakpoint lookup instead of O(n) find operation
  if (class2CreateSplited.length < 3 || !values.breakPoints.has(class2CreateSplited[2])) {
    return {
      hasBP: false,
      values: class2CreateSplited.slice(2),
    };
  } else {
    return {
      hasBP: true,
      values: class2CreateSplited.slice(3),
    };
  }
};
