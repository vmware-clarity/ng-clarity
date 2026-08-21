/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable } from 'rxjs';

import { Var } from './var';

/**
 * Evaluation strategy.
 */
export interface EvalStrategy<R> {
  withEagerEval: () => R;
  withLazyEval: () => R;
}

//---------------------------------------------------------------------------------------
// Var without dependencies
//---------------------------------------------------------------------------------------

/**
 * Result of {@link Var.from} when invoked without parameters.
 */
export interface From0DepReturnSchema extends ByFunctionWithoutArgs, EvalStrategy<ByFunctionWithoutArgs> {}

export interface ByFunctionWithoutArgs {
  /**
   * Create {@link Var} by applying a transition function.
   * @param fn Transition function.
   */
  by: <R>(fn: () => Observable<R>) => Var<R>;
}

//---------------------------------------------------------------------------------------
// Var that depends on 1 Var
//---------------------------------------------------------------------------------------

export interface From1DepReturnSchema<D1> extends SingleDepOperators<D1>, EvalStrategy<SingleDepOperators<D1>> {}

/**
 * Result of {@link Var.from} when invoked with exactly one dependent var.
 *
 * D1 - the type of the Var passed to Var.from(dep: Var<D>) function.
 */
export interface SingleDepOperators<D1> {
  /**
   * Create {@link Var} by applying a transition function on the specified dependent Var.
   * @param fn Transition function. It receives dependency {@link Var.value} as
   *    input parameter.
   */
  by: <R>(fn: (depValue: D1) => Observable<R>) => Var<R>;

  /**
   * Extract single property from another {@link Var.value} result.
   * There is a compile-time check for the specified property name.
   *
   * @example
   * const v3 = Var.of({ name: "dummy", value: true });
   *
   * const p1: Var<string> = Var.from(v3).pluck("name");
   * const p2: Var<boolean> = Var.from(v3).pluck("value");
   *
   * Var.from(v3).pluck("non_existing_property_name");     // compile time error
   */
  pluck: <K extends keyof D1>(propName: K) => Var<D1[K]>; // D1[K] - mapped type

  // TODO: This use case is more complex that simply copying the value of another var.
  //  If the dependent var is updated, its copy will also get updated on next step transition.
  //  However we need to decide what to do if the user has changed the copied value using the
  //  {Var#value} setter.
  //  Do we want to ALWAYS reset the user value? If so Back + Next will reset the user change.
  //  Do we want to reset the user entered value ONLY IF the dependent value is changed?
  //
  // asInitialValue: () => Var<D>;
}

//---------------------------------------------------------------------------------------
// Var that depends on 2 Vars
//---------------------------------------------------------------------------------------

/**
 * Result of {@link Var.from} when invoked with two dependent vars:
 * <code>Var.from(dep1, dep2)</code>
 */
export interface From2DepReturnSchema<D1, D2>
  extends ByFunctionWith2Types<D1, D2>, EvalStrategy<ByFunctionWith2Types<D1, D2>> {}

export interface ByFunctionWith2Types<D1, D2> {
  /**
   * Create {@link Var} by applying a transition function on the specified dependent vars.
   * @param fn Transition function. It receives dependency {@link Var.value} as
   *    input parameter.
   *
   * @example
   *    const dep1: Var<D1> = ...;
   *    const dep2: Var<D2> = ...;
   *    const newVar = Var.from(dep1, dep2).by(
   *       (v1: D1, v2: D2) => { ... }
   *    );
   */
  by: <R>(fn: (v1: D1, v2: D2) => Observable<R>) => Var<R>;
}

//---------------------------------------------------------------------------------------
// Var that depends on 3 Vars
//---------------------------------------------------------------------------------------

/**
 * Result of {@link Var.from} when invoked with three dependent vars:
 * <code>Var.from(dep1, dep2, dep3)</code>
 */
export interface From3DepReturnSchema<D1, D2, D3>
  extends ByFunctionWith3Types<D1, D2, D3>, EvalStrategy<ByFunctionWith3Types<D1, D2, D3>> {}

export interface ByFunctionWith3Types<D1, D2, D3> {
  /**
   * Create {@link Var} by applying a transition function on the specified dependent vars.
   * @param fn Transition function. It receives dependency {@link Var.value} as
   *    input parameter.
   *
   * @example
   *    const dep1: Var<D1> = ...;
   *    const dep2: Var<D2> = ...;
   *    const dep3: Var<D3> = ...;
   *    const newVar = Var.from(dep1, dep2, dep3).by(
   *       (v1: D1, v2: D2, v3: D3) => { ... }
   *    );
   */
  by: <R>(fn: (v1: D1, v2: D2, v3: D3) => Observable<R>) => Var<R>;
}

//---------------------------------------------------------------------------------------
// Var that depends on 4 Vars
//---------------------------------------------------------------------------------------

export interface From4DepReturnSchema<D1, D2, D3, D4>
  extends ByFunctionWith4Types<D1, D2, D3, D4>, EvalStrategy<ByFunctionWith4Types<D1, D2, D3, D4>> {}

/**
 * Result of {@link Var.from} when invoked with four dependent vars:
 * <code>Var.from(dep1, dep2, dep3, dep4)</code>
 */
export interface ByFunctionWith4Types<D1, D2, D3, D4> {
  /**
   * Create {@link Var} by applying a transition function on the specified dependent vars.
   * @param fn Transition function. It receives dependency {@link Var.value} as
   *    input parameter.
   *
   * @example
   *    const dep1: Var<D1> = ...;
   *    const dep2: Var<D2> = ...;
   *    const dep3: Var<D3> = ...;
   *    const dep4: Var<D4> = ...;
   *    const newVar = Var.from(dep1, dep2, dep3, dep4).by(
   *       (v1: D1, v2: D2, v3: D3, v4: D4) => { ... }
   *    );
   */
  by: <R>(fn: (v1: D1, v2: D2, v3: D3, v4: D4) => Observable<R>) => Var<R>;
}

//---------------------------------------------------------------------------------------
// Var that depends on 5 Vars
//---------------------------------------------------------------------------------------

export interface From5DepReturnSchema<D1, D2, D3, D4, D5>
  extends ByFunctionWith5Types<D1, D2, D3, D4, D5>, EvalStrategy<ByFunctionWith5Types<D1, D2, D3, D4, D5>> {}

/**
 * Result of {@link Var.from} when invoked with five dependent vars:
 * <code>Var.from(dep1, dep2, dep3, dep4, dep5)</code>
 */
export interface ByFunctionWith5Types<D1, D2, D3, D4, D5> {
  /**
   * Create {@link Var} by applying a transition function on the specified dependent vars.
   * @param fn Transition function. It receives dependency {@link Var.value} as
   *    input parameter.
   *
   * @example
   *    const dep1: Var<D1> = ...;
   *    const dep2: Var<D2> = ...;
   *    const dep3: Var<D3> = ...;
   *    const dep4: Var<D4> = ...;
   *    const dep5: Var<D5> = ...;
   *    const newVar = Var.from(dep1, dep2, dep3, dep4, dep5).by(
   *       (v1: D1, v2: D2, v3: D3, v4: D4, v5: D5) => { ... }
   *    );
   */
  by: <R>(fn: (v1: D1, v2: D2, v3: D3, v4: D4, v5: D5) => Observable<R>) => Var<R>;
}

//---------------------------------------------------------------------------------------
// Var that depends on more than 5 Vars
//---------------------------------------------------------------------------------------

/**
 * Result of {@link Var.from} when invoked with more than five dependent vars:
 */
export interface FromMultiDepReturnSchema {
  /**
   * Create {@link Var} by applying a transition function on the specified dependent vars.
   * @param fn Transition function. It receives dependency {@link Var.value|values} as
   *    input parameters.
   */
  by: <R>(fn: (...depValues: any[]) => Observable<R>) => Var<R>;
}
