import { IBPS } from '../interfaces';

/**
 * BreakpointsSingleton manages responsive design breakpoints
 * and related configuration for the library.
 */
export class BreakpointsSingleton {
  private static instance: BreakpointsSingleton;

  // Breakpoint definitions
  public bps: IBPS[] = [
    {
      bp: 'sm',
      value: '576px',
      class2Create: '',
    },
    {
      bp: 'md',
      value: '768px',
      class2Create: '',
    },
    {
      bp: 'lg',
      value: '992px',
      class2Create: '',
    },
    {
      bp: 'xl',
      value: '1200px',
      class2Create: '',
    },
    {
      bp: 'xxl',
      value: '1400px',
      class2Create: '',
    },
  ];

  // Breakpoint management
  public breakPoints: Set<string> = new Set(['sm', 'md', 'lg', 'xl', 'xxl']);

  private constructor() {}

  public static getInstance(): BreakpointsSingleton {
    if (!BreakpointsSingleton.instance) {
      BreakpointsSingleton.instance = new BreakpointsSingleton();
    }
    return BreakpointsSingleton.instance;
  }

  /**
   * Gets a breakpoint configuration by name
   */
  public getBreakpoint(bpName: string): IBPS | undefined {
    return this.bps.find(bp => bp.bp === bpName);
  }

  /**
   * Checks if a breakpoint exists
   */
  public hasBreakpoint(bpName: string): boolean {
    return this.breakPoints.has(bpName);
  }

  /**
   * Adds a new breakpoint
   */
  public addBreakpoint(bp: IBPS): void {
    if (!this.hasBreakpoint(bp.bp)) {
      this.bps.push(bp);
      this.breakPoints.add(bp.bp);
      this.sortBreakpoints();
    }
  }

  /**
   * Removes a breakpoint
   */
  public removeBreakpoint(bpName: string): void {
    this.bps = this.bps.filter(bp => bp.bp !== bpName);
    this.breakPoints.delete(bpName);
  }

  /**
   * Updates a breakpoint value
   */
  public updateBreakpoint(bpName: string, newValue: string): void {
    const bp = this.getBreakpoint(bpName);
    if (bp) {
      bp.value = newValue;
    }
  }

  /**
   * Sorts breakpoints by their pixel values
   */
  private sortBreakpoints(): void {
    this.bps.sort((a, b) => {
      const aValue = parseInt(a.value.replace('px', ''));
      const bValue = parseInt(b.value.replace('px', ''));
      return aValue - bValue;
    });
  }

  /**
   * Gets all breakpoint names as an array
   */
  public getBreakpointNames(): string[] {
    return Array.from(this.breakPoints);
  }

  /**
   * Gets the breakpoint values as a map
   */
  public getBreakpointMap(): Map<string, string> {
    const map = new Map<string, string>();
    this.bps.forEach(bp => {
      map.set(bp.bp, bp.value);
    });
    return map;
  }
}
