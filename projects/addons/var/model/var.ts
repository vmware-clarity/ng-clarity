/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { combineLatest, Observable, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { catchError, shareReplay, switchMap, tap } from 'rxjs/operators';

import { resettableShareReplay } from './resettable-share-replay';
import {
  From0DepReturnSchema,
  From1DepReturnSchema,
  From2DepReturnSchema,
  From3DepReturnSchema,
  From4DepReturnSchema,
  From5DepReturnSchema,
  FromMultiDepReturnSchema,
} from './var-builder-api';
import { stringify } from '../util/util';

/**
 * Workflow variable used to define properties in the workflow model.
 *
 * <h2>Use Cases</h2>
 * This class is designed for the following use cases:
 * <ol>
 * <li>Create variable, that wraps generic data type. Use cases:
 *    <ul>
 *       <li>Pass a value as dependency to other workflow variables. When a new value is
 *           set, the dependent variable will be reevaluated.
 *       <li>[Future] Define mapping between workflow and step model variables.
 *       <li>[Future] Output step model values in a reactive manner.
 *    </ul>
 * @see {@link Var.of}
 *
 * <li>Create variable, that can depend on other {@link Var}s. Use cases:
 *    <ul>
 *       <li>Invoke async function to retrieve data.
 *       <li>Transform the result of another {@link Var}.
 *       <li>Extract a property of another {@link Var}.
 *       <li>[Future] Use the result of one {@link Var} as initial value of another.
 *    </ul>
 * @see {@link Var.from}
 * </ol>
 *
 * <h2>Using Var for Data Retrieval</h2>
 *
 * The main use case of this class is to move the data request outside of the step component.
 * This gives the following benefits:
 * - Component will not deal with asynchronous data; it will be pre-computed and injected
 * - Increased re-usability of steps
 * - Loading indicator comes for free.
 * - Default error handling
 * - Caching of calculated values and re-calculating when necessary
 *
 * <h2>Step Model Mapping</h2>
 *
 * <b>Step model property</b> can reference workflow {@link Var} property using
 * <code>@InputMapping</code> and <code>@OutputMapping</code> decorators.
 * Mapped step model property should be of type "T".
 *
 * <h2>Examples:</h2>
 *
 * @example Create new variable without initial value
 * const v1: Var<string> = Var.of();
 *
 *
 * @example Create new variable with initial value
 * const v2: Var<string> = Var.of("hello");
 *
 *
 * @example Data Retrieval
 * // "portGroupInfo" depends on "hostId"
 * this.model.portGroupInfo = Var.from(this.model.hostId).by(
 *    (hostId: string) => {
 *       // Note that "hostId" is "this.model.hostId.value", pre-calculated if it is ComputedVar.
 *       return <Observable<HostStandardSwitchData>>this.dataService.getData$(hostId, PG_INFO_PROP);
 *    }
 * );
 *
 *
 * @example Created computed property without any dependencies
 * const c1: Var<number> = Var.from().by(() => of(42));
 *
 *
 * @example Create computed property with dependencies
 * const c2: Var<string> = Var.from(c1, v2).by(
 *    (c1Val, c2Val) => of(`Result: ${c1Val} ${c2Val}`));
 *
 *
 * @example Transform another Var value
 * // Invoke transformation function on "c2" result.
 * const c3: Var<number> = Var.from(c2).by((c2Val: string) => of(c2Val.length + 3));
 *
 *
 * @example Extract single property from another var
 * const v3 = Var.of({ name: "dummy", value: true });
 *
 * const p1: Var<string> = Var.from(v3).pluck("name");
 * const p2: Var<boolean> = Var.from(v3).pluck("value");
 *
 * // There is a compile-time check for the specified property name.
 * Var.from(v3).pluck("non_existing_property_name");     // compile time error
 *
 *
 * @example Mapping step model property to workflow model Var
 * class MyWizardModel {
 *    readonly vlanIds: Var<number[]> = Var.of();
 * }
 *
 * // First step outputs selected vLANs
 * class Step1Model {
 *    @OutputMapping({propertyName="vlanIds"})
 *    vlanIds: number[];
 * }
 *
 * // Second step uses the selected vLANs form the first step
 * class Step2Model {
 *    @InputMapping({propertyName="vlanIds"})
 *    vlanIds: number[];
 * }
 */
export abstract class Var<T> {
  #value: T;

  protected constructor() {
    // no action
  }

  /**
   * Value of the variable. It can be undefined
   */
  get value(): T {
    return this.#value;
  }
  set value(newValue: T) {
    this.#value = newValue;
    this.onSetValue(newValue);
  }

  /**
   * Create a variable, that wraps generic data type.
   * @param initialValue Initial value of the {@link value} property.
   */
  static of<U>(initialValue?: U): Var<U> {
    const result: Var<U> = <Var<U>>new SimpleVar<U>();
    if (initialValue !== undefined) {
      result.value = initialValue;
    }
    return result;
  }

  /**
   * Create a variable by applying a transition function simultaneously on zero or more
   * {@link Var} results. Created Var maintains a dependency chain with the Vars, it is
   * built from. If any of the dependent variables is changed, the transition function
   * will be re-evaluated. The orchestration of when this happens is done in
   * WorkflowModelManager.
   */
  static from(): From0DepReturnSchema;
  static from<D1>(dep: Var<D1>): From1DepReturnSchema<D1>;
  static from<D1, D2>(dep1: Var<D1>, dep2: Var<D2>): From2DepReturnSchema<D1, D2>;
  static from<D1, D2, D3>(dep1: Var<D1>, dep2: Var<D2>, dep3: Var<D3>): From3DepReturnSchema<D1, D2, D3>;
  static from<D1, D2, D3, D4>(
    dep1: Var<D1>,
    dep2: Var<D2>,
    dep3: Var<D3>,
    dep4: Var<D4>
  ): From4DepReturnSchema<D1, D2, D3, D4>;
  static from<D1, D2, D3, D4, D5>(
    dep1: Var<D1>,
    dep2: Var<D2>,
    dep3: Var<D3>,
    dep4: Var<D4>,
    dep5: Var<D5>
  ): From5DepReturnSchema<D1, D2, D3, D4, D5>;
  static from(...deps: Var<any>[]): FromMultiDepReturnSchema;
  static from(...deps: Var<any>[]): any {
    function fromApi(strategy: ComputeStrategy) {
      return {
        by<U>(fn: (...depValues: any[]) => Observable<U>): Var<U> {
          return <Var<U>>new ComputedVar<U>({
            dependsOn: deps,
            computeFn: fn,
            strategy: strategy,
          });
        },

        pluck<U>(propName: string): Var<U> {
          return <Var<U>>new ComputedVar<U>({
            dependsOn: deps,
            computeFn: (depValue: any) => of(depValue[propName]),
            strategy: strategy,
          });
        },
      };
    }

    return {
      ...fromApi(ComputeStrategy.lazy),
      withEagerEval: () => fromApi(ComputeStrategy.eager),
      withLazyEval: () => fromApi(ComputeStrategy.lazy),
    };
  }

  /**
   * Hook that is invoked when {@link value} setter is invoked. This is necessary, because
   * of TS issue with overriding property setters - setting the protected "this._value"
   * in a descendant class is breaking the {@link value} getter - it will always return
   * undefined. The TS issue is fixed in newer versions.
   */
  protected abstract onSetValue(newValue: T): void;
}

export class SimpleVar<T> extends Var<T> {
  private static count = 0;

  /**
   * Workflow property name. Used only for troubleshooting.
   * Set by WorkflowModelManager.
   */
  name: string;

  private lastValueStr: string | undefined;

  #value$: Observable<T> = new ReplaySubject<T>(1);
  #isSet = false;

  constructor() {
    super();
    this.name = 'simpleVar' + SimpleVar.count++;
  }

  /**
   * Observable that emits every time when {@link value} property is set.
   */
  get value$(): Observable<T> {
    return this.#value$;
  }

  /**
   * Whether the value is set.
   * If initial value is undefined (e.g. Var.of(undefined)), this will return false.
   * Undefined can be set only through the {@link value} setter.
   */
  get isSet(): boolean {
    return this.#isSet;
  }

  /**
   * When {@link value} is updated without calling setter i.e., nested object of value is updated
   * {@link value$} does not emit updated value, call this method to emit {@link value$} with updated {@link value}
   */
  updateValueIfDirty(): void {
    if (this.lastValueStr !== stringify(this.value)) {
      this.onSetValue(this.value);
    }
  }

  protected onSetValue(newValue: T): void {
    this.#isSet = true;
    this.lastValueStr = stringify(newValue);
    (<ReplaySubject<T>>this.#value$).next(newValue);
  }
}

/**
 * Parameters of the {@link ComputedVar} constructor.
 */
export interface ComputedVarSchema<T> {
  /**
   * Properties, on which this computed property depends.
   * These are other workflow model properties, necessary to calculate this one.
   * Dependency values (i.e. {@link Var.value}) are passed to "computeFn"
   * as input parameters in the same order as they are defined here.
   *
   * Dependencies can be of type {@link ComputedVar}. This will create property
   * chain that will be executed whenever necessary.
   */
  dependsOn: Var<any>[];

  /**
   * Function that will calculate the value of the property based on its dependencies.
   *
   * @param dependencyValues
   *    <b>Values</b> (i.e. {@link Var.value}) of the defined dependent
   *    properties, passed in the same order.
   */
  computeFn: (...depValues: any[]) => Observable<T>;

  /**
   * Strategy for executing the {@link computeFn}. Implementation of the strategies is
   * in the WorkflowModelManager class.
   *
   * @default ComputeStrategy.lazy
   */
  strategy?: ComputeStrategy;
}

/**
 * Types of strategies that are available for a {@link ComputedVar}.
 * Implementation of the strategies is in the WorkflowModelManager class.
 */
export enum ComputeStrategy {
  /**
   * Invoke the {@link ComputedVarSchema.computeFn} as soon as its dependencies are populated.
   */
  eager = 'eager',

  /**
   * Invoke the {@link ComputedVarSchema.computeFn} on navigation to a step that has an
   * <code>@InputMapping</code> to the workflow Var.
   */
  lazy = 'lazy',
}

/**
 * Workflow variable that is calculated using user-defined function.
 * Optionally the property can depend on other properties of type {@link SimpleVar}
 * or {@link ComputedVar}. Dependency values (i.e. {@link Var#value})
 * are passed to "computeFn" as input parameters. "computeFn" must use only these input
 * parameters to do its business and must not access directly other model variables
 * (using closure).
 *
 * Computed property is executed once on {@link ComputedVar.value$} subscription and its
 * result is cached. It will be re-calculated if its dependencies are changed.
 */
export class ComputedVar<T> extends Var<T> {
  private static count = 0;

  /**
   * Workflow property name. Used only for troubleshooting.
   * Set by WorkflowModelManager.
   */
  name: string;

  private lastDependencyValues: string | undefined;
  private isLastComputationSuccessful = false;
  #value$: Observable<T>;

  constructor(private config: ComputedVarSchema<T>) {
    super();
    this.name = 'computedVar' + ComputedVar.count++;
    this.validateArguments(config);
    this.setDefaults(config);
    this.initValue();
  }

  /**
   * Subscription to this observable triggers the calculation of compute function.
   */
  get value$(): Observable<T> {
    return this.#value$;
  }

  /**
   * Return the {@link ComputeStrategy|strategy} that will be used to evaluate the
   * compute function.
   */
  get strategy(): ComputeStrategy {
    return this.config.strategy as ComputeStrategy;
  }

  /**
   * Return boolean whether the dependencies are satisfied for the compute function
   */
  get areDependenciesSatisfied(): boolean {
    const computedVarDependencySatisfied = this.config.dependsOn
      .filter((flowVar: Var<any>) => {
        return flowVar instanceof ComputedVar;
      })
      .every(curr => (<ComputedVar<any>>curr).areDependenciesSatisfied);
    const simpleVarDependencySatisfied = this.config.dependsOn
      .filter((flowVar: Var<any>) => {
        return flowVar instanceof SimpleVar;
      })
      .every(curr => (<SimpleVar<any>>curr).isSet);
    return computedVarDependencySatisfied && simpleVarDependencySatisfied;
  }

  /**
   * Returns the list of property names that have unsatisfied dependencies
   */
  get unsatisfiedDependencies(): string[] {
    const unsatisfiedDependencies: string[] = [];
    this.config.dependsOn.forEach(flowVar => {
      if (flowVar instanceof SimpleVar && !flowVar.isSet) {
        unsatisfiedDependencies.push(flowVar.name);
      } else if (flowVar instanceof ComputedVar && !flowVar.areDependenciesSatisfied) {
        unsatisfiedDependencies.push(flowVar.name);
      } else {
        // no action
      }
    });
    return unsatisfiedDependencies;
  }

  protected onSetValue(): void {}

  private validateArguments(arg: ComputedVarSchema<T>): void {
    arg.dependsOn.forEach((dependency: Var<any>, index: number) => {
      if (!dependency) {
        throw new Error(`${name}: Dependency is null or undefined at dependsOn[${index}]`);
      }
    });
  }

  private setDefaults(config: ComputedVarSchema<T>): void {
    config.strategy = config.strategy || ComputeStrategy.lazy;
  }

  /**
   * Initialize {@link _value} field.
   */
  private initValue(): void {
    const depValues$: Observable<any>[] = this.extractDependencyValues$();
    this.#value$ = depValues$.length
      ? this.initValueFromDependencies(depValues$)
      : this.config.computeFn().pipe(
          tap((fnResult: T) => {
            this.value = fnResult;
          }),
          // Execute "computeFn" only on first subscription. Subsequent subscriptions
          // will get the cached value.
          shareReplay(1)
        );
  }

  private initValueFromDependencies(depValues$: Observable<any>[]): Observable<T> {
    const reset$ = new Subject<void>();
    return combineLatest(depValues$).pipe(
      switchMap((depValues: any[]) => {
        let depValuesChanged = true;
        const depValuesStr = stringify(depValues);
        if (depValuesStr !== undefined) {
          if (depValues?.length && this.lastDependencyValues === depValuesStr) {
            depValuesChanged = false;
          }
        } else {
          console.warn(
            'Can not detect if dependencies have changed for Var ' + this.name + '. Assume they have changed!'
          );
        }

        if (!this.isLastComputationSuccessful || depValuesChanged) {
          // Do not reset if there is no computed value yet.
          if (this.lastDependencyValues) {
            // Reset the ReplaySubject in 'resettableShareReplay'. Subscribers
            // will no longer get the cached value. They will be subscribed to the
            // new ReplaySubject, that will emit once the 'computeFn' finishes.
            reset$.next();
          }

          return this.config.computeFn(...depValues).pipe(
            tap((fnResult: T) => {
              this.lastDependencyValues = depValuesStr;
              this.isLastComputationSuccessful = true;
              this.value = fnResult;
            }),
            catchError((e: unknown) => {
              this.isLastComputationSuccessful = false;
              return throwError(() => e);
            })
          );
        }
        return of(this.value);
      }),
      resettableShareReplay({
        bufferSize: 1,
        // When subscriptions count reaches zero, unsubscribe from source.
        // The next subscription will subscribe again and will NOT reply the last value.
        refCount: true,
        reset: reset$,
      })
    );
  }

  private extractDependencyValues$(): Observable<any>[] {
    return this.config.dependsOn.map((flowVar: Var<any>) => {
      if (flowVar instanceof ComputedVar) {
        return flowVar.value$;
      } else if (flowVar instanceof SimpleVar) {
        return flowVar.value$;
      } else {
        // Developer error.
        throw new Error('Unsupported Var descendant');
      }
    });
  }
}
