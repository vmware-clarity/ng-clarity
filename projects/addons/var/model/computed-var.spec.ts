/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { delay, take, tap } from 'rxjs/operators';

import { ComputedVar, ComputeStrategy, SimpleVar, Var } from './var';

const fnResult = 'fn result:';

class MockWorkflowModel {
  var1: Var<number>;
  var2: Var<number>;
  delay: Var<boolean>;
  cp1: ComputedVar<string>;
  cp2: ComputedVar<number>;
  delayedVar: Var<string>;

  cp1InvocationCount = 0;
}

interface NestedType {
  var1: string;
}

function createModelWith1ComputedProperty(twoVars = false): MockWorkflowModel {
  const model = new MockWorkflowModel();
  model.var1 = Var.of<number>();

  const dependencies = [model.var1];
  if (twoVars) {
    model.var2 = Var.of<number>();
    dependencies.push(model.var2);
  }

  model.cp1 = new ComputedVar<string>({
    dependsOn: dependencies,
    computeFn: (var1Value, var2Value?) => {
      model.cp1InvocationCount++;
      if (var2Value === undefined) {
        return of(`${fnResult}${var1Value}`);
      }
      return of(`${fnResult}${var1Value},${var2Value}`);
    },
  });
  return model;
}

describe('computed-var.spec', () => {
  describe('ComputedVar#value', () => {
    it("'value' is set properly after value$ subscription - no dependencies", () => {
      const model = new MockWorkflowModel();
      model.cp1 = new ComputedVar<string>({
        dependsOn: [],
        computeFn: () => of(fnResult),
      });

      expect(model.cp1.value).toBeUndefined();

      model.cp1.value$.pipe(take(1)).subscribe();

      expect(model.cp1.value).toEqual(fnResult);
    });

    it("'value' is set properly after value$ subscription - with dependencies", () => {
      const model = createModelWith1ComputedProperty();

      expect(model.cp1.value).toBeUndefined();

      model.cp1.value$.pipe(take(1)).subscribe();
      model.var1.value = 1;

      expect(model.cp1.value).toEqual(fnResult + '1');
    });
  });

  describe('ComputedVar#strategy', () => {
    it("'strategy' getter returns the proper value", () => {
      const model = new MockWorkflowModel();
      model.cp1 = new ComputedVar<string>({
        dependsOn: [],
        computeFn: () => of(fnResult),
        strategy: ComputeStrategy.lazy,
      });
      expect(model.cp1.strategy).toEqual(ComputeStrategy.lazy);

      model.cp2 = new ComputedVar<number>({
        dependsOn: [],
        computeFn: () => of(5),
        strategy: ComputeStrategy.eager,
      });
      expect(model.cp2.strategy).toEqual(ComputeStrategy.eager);
    });
  });

  describe('ComputedVar without dependencies', () => {
    it("'value$' emits immediately", done => {
      const model = new MockWorkflowModel();
      model.cp1 = new ComputedVar<string>({
        dependsOn: [],
        computeFn: () => {
          model.cp1InvocationCount++;
          return of(fnResult);
        },
      });

      const subscription = model.cp1.value$.subscribe(result => {
        expect(result).toEqual(fnResult);
        done();
      });

      expect(model.cp1InvocationCount).toEqual(1);
      subscription.unsubscribe();
    });

    it('2 subscriptions will invoke fn only once', () => {
      let subscriptionCount = 0;
      const fnResult$ = new Subject<string>();
      const model = new MockWorkflowModel();
      model.cp1 = new ComputedVar<string>({
        dependsOn: [],
        computeFn: () => {
          model.cp1InvocationCount++;
          return fnResult$.pipe(tap(() => subscriptionCount++));
        },
      });

      // 'computeFn' is invoked once in the constructor.
      expect(model.cp1InvocationCount).toEqual(1);

      let s1Result = '';
      let s2Result = '';
      const subscription1 = model.cp1.value$.subscribe(result => (s1Result = result));
      const subscription2 = model.cp1.value$.subscribe(result => (s2Result = result));

      expect(s1Result).toEqual('');
      expect(s2Result).toEqual('');
      expect(subscriptionCount).toEqual(0);

      fnResult$.next(fnResult);
      expect(s1Result).toEqual(fnResult);
      expect(s2Result).toEqual(fnResult);
      expect(model.cp1InvocationCount).toEqual(1);
      expect(subscriptionCount).toEqual(1);
      subscription1.unsubscribe();
      subscription2.unsubscribe();
    });

    it('throws error if null dependency is added', () => {
      const model = new MockWorkflowModel();
      const dependencies: Var<any>[] = [];
      dependencies.push(model.var1);

      let err: any;
      try {
        model.cp1 = new ComputedVar<string>({
          dependsOn: dependencies,
          computeFn: () => {
            return of('');
          },
        });
      } catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
    });

    it('throws error if compute function throws error', waitForAsync(() => {
      const model = new MockWorkflowModel();
      model.cp1 = new ComputedVar<string>({
        dependsOn: [],
        computeFn: () => {
          return throwError('error');
        },
      });
      model.cp1.value$.subscribe({
        next() {
          fail('should never reach here');
        },
        error(err: unknown) {
          expect(err).toEqual('error');
        },
      });
    }));
  });

  describe('ComputedVar --> SimpleVar', () => {
    it("'value$' emits when dependencies are updated", () => {
      const model = createModelWith1ComputedProperty();

      let cp1ValueResult = '';
      const subscription = model.cp1.value$.subscribe(result => (cp1ValueResult = result));

      // Computed property should not emit until dependencies are set.
      expect(cp1ValueResult).toEqual('');
      expect(model.cp1InvocationCount).toEqual(0);

      // Computed property should emit when its dependency is set.
      model.var1.value = 1;
      expect(cp1ValueResult).toEqual(fnResult + '1');
      expect(model.cp1InvocationCount).toEqual(1);

      // Computed property should emit when its dependency is updated.
      model.var1.value = 2;
      expect(cp1ValueResult).toEqual(fnResult + '2');
      expect(model.cp1InvocationCount).toEqual(2);

      subscription.unsubscribe();
    });

    it("''value$' emits when dependencies are updated without value setter", () => {
      let invocationCount = 0;
      const sp = Var.of<NestedType>({ var1: 'var1' }) as SimpleVar<NestedType>;
      const cp = Var.from(sp).by<string>(val => of(val.var1)) as ComputedVar<string>;
      let cpResult: string | undefined;
      const subscription = cp.value$.subscribe(val => {
        cpResult = val;
        invocationCount++;
      });
      expect(cpResult).toEqual('var1');
      expect(invocationCount).toEqual(1);
      sp.value.var1 = 'updatedVar1';
      sp.updateValueIfDirty();
      expect(cpResult).toEqual('updatedVar1');
      expect(invocationCount).toEqual(2);
      subscription.unsubscribe();
    });

    it("'value$' emits only once if a dependency emits the same value", () => {
      const model = createModelWith1ComputedProperty();

      const subscription = model.cp1.value$.subscribe();

      model.var1.value = 1;
      expect(model.cp1InvocationCount).toEqual(1);

      model.var1.value = 1;
      expect(model.cp1InvocationCount).toEqual(1);

      subscription.unsubscribe();
    });

    it("'value$' emits when its two dependencies emit", () => {
      const model = createModelWith1ComputedProperty(true);

      let cp1ValueResult = '';
      const subscription = model.cp1.value$.subscribe(result => (cp1ValueResult = result));
      expect(model.cp1InvocationCount).toEqual(0);

      model.var1.value = 1;
      expect(model.cp1InvocationCount).toEqual(0);

      model.var2.value = 5;
      expect(cp1ValueResult).toEqual(fnResult + '1,5');
      expect(model.cp1InvocationCount).toEqual(1);

      subscription.unsubscribe();
    });

    it('2 subscriptions will invoke fn twice if there is error and there is no change in depend on var', () => {
      const model = new MockWorkflowModel();
      model.var1 = Var.of(0);
      model.cp1 = new ComputedVar<string>({
        dependsOn: [model.var1],
        computeFn: () => {
          model.cp1InvocationCount++;
          if (model.cp1InvocationCount > 1) {
            return throwError('error');
          }
          return of('computeFnValue');
        },
      });

      let s1Result: string | unknown = '';
      let s1Error: string | unknown = '';
      const subscription1 = model.cp1.value$.subscribe(
        result => (s1Result = result),
        (error: unknown) => (s1Error = error)
      );
      //first subscription should pass
      expect(s1Error).toEqual('');
      expect(s1Result).toEqual('computeFnValue');

      // this will execute the compute invocation, because of change in dependency.
      model.var1.value = 1;
      expect(model.cp1InvocationCount).toEqual(2);

      let s2Result: string | unknown = '';
      let s2Error: string | unknown = '';
      // this should execute compute function again, since second execution is unsucessful
      const subscription2 = model.cp1.value$.subscribe(
        result => (s2Result = result),
        (error: unknown) => (s2Error = error)
      );
      expect(model.cp1InvocationCount).toEqual(3);
      expect(s2Result).toEqual('');
      expect(s2Error).toEqual('error');
      subscription1.unsubscribe();
      subscription2.unsubscribe();
    });
  });

  describe('ComputedVar2 --> ComputedVar1 --> SimpleVar', () => {
    it('dependent calculated property will be executed upon subscription', () => {
      const model = createModelWith1ComputedProperty();
      model.cp2 = new ComputedVar<number>({
        dependsOn: [model.cp1],
        computeFn: (cp1Result: string) => {
          return of(cp1Result.length);
        },
      });

      let cp2ValueResult = 0;
      const subscription = model.cp2.value$.subscribe(result => (cp2ValueResult = result));

      // cp2 will not emit until var1 emits
      expect(model.cp1InvocationCount).toEqual(0);
      expect(cp2ValueResult).toEqual(0);

      model.var1.value = 1;
      expect(model.cp1InvocationCount).toEqual(1);
      expect(cp2ValueResult).toEqual(fnResult.length + 1);

      subscription.unsubscribe();
    });
  });

  describe('ComputedVar2 --> ComputedVar1', () => {
    it('ComputedVar2 errors out, then error is thrown', () => {
      const model = new MockWorkflowModel();
      model.cp1 = new ComputedVar<string>({
        dependsOn: [],
        computeFn: () => {
          return of('cp1Result');
        },
      });
      model.cp2 = new ComputedVar<number>({
        dependsOn: [model.cp1],
        computeFn: () => {
          return throwError('error');
        },
      });

      const subscription = model.cp2.value$.subscribe({
        next(result) {
          expect(result).toEqual(0);
        },
        error(err: unknown) {
          expect(err).toEqual('error');
        },
      });
      subscription.unsubscribe();
    });

    it('ComputedVar1 errors out, then error is propagated to ComputedVar2 subscribers', () => {
      const model = createModelWith1ComputedProperty();
      model.cp1 = new ComputedVar<string>({
        dependsOn: [],
        computeFn: () => {
          return throwError('error');
        },
      });
      model.cp2 = new ComputedVar<number>({
        dependsOn: [model.cp1],
        computeFn: () => {
          return of(2);
        },
      });

      const subscription = model.cp2.value$.subscribe({
        next(result) {
          expect(result).toEqual(0);
        },
        error(err: unknown) {
          expect(err).toEqual('error');
        },
      });
      subscription.unsubscribe();
    });
  });

  describe('isDependencySatisfied', () => {
    it('ComputedVar1 depends on SimpleVar1', () => {
      const s1 = Var.of(0);
      const cp1: ComputedVar<number> = Var.from(s1).by(p1 => of(p1)) as ComputedVar<number>;
      expect(cp1.areDependenciesSatisfied).toEqual(true);
    });

    it('ComputedVar2 --> SimpleVar2 AND ComputedVar2 --> ComputedVar1 --> SimpleVar1', () => {
      const s1 = Var.of(0);
      const cp1: ComputedVar<number> = Var.from(s1).by(p1 => of(p1)) as ComputedVar<number>;
      const s2 = Var.of<number>();
      const cp2: ComputedVar<number> = Var.from(s2, cp1).by(p1 => of(p1)) as ComputedVar<number>;
      expect(cp2.areDependenciesSatisfied).toEqual(false);
      s2.value = 1;
      expect(cp2.areDependenciesSatisfied).toEqual(true);
    });

    it('ComputedVar3 --> ComputedVar2 --> ComputedVar1 --> SimpleVar1', () => {
      const s1 = Var.of<number>();
      const cp1: ComputedVar<number> = Var.from(s1).by(p1 => of(p1)) as ComputedVar<number>;
      const cp2: ComputedVar<number> = Var.from(cp1).by(p1 => of(p1)) as ComputedVar<number>;
      const cp3: ComputedVar<number> = Var.from(cp2).by(p1 => of(p1)) as ComputedVar<number>;
      expect(cp3.areDependenciesSatisfied).toEqual(false);
      s1.value = 0;
      expect(cp3.areDependenciesSatisfied).toEqual(true);
    });
  });

  describe('eager evaluation', () => {
    it('when there is a second subscription, compute function should not be invoked again', fakeAsync(() => {
      const model = new MockWorkflowModel();
      model.delay = Var.of<boolean>();
      model.delayedVar = Var.from(model.delay)
        .withEagerEval()
        .by(d => {
          model.cp1InvocationCount++;
          if (d) {
            return of('delayed').pipe(delay(3000));
          }
          return of('not delayed').pipe(delay(300));
        });
      let result1 = '';
      const subscription1 = (<ComputedVar<string>>model.delayedVar).value$.subscribe(r => {
        result1 = r;
      });
      model.delay.value = false; // should trigger computeFn, which takes 300 ms
      tick(300); // wait for 300ms
      expect(result1).toEqual('not delayed');
      model.delay.value = true; // should trigger computeFn again
      tick(100); // wait for 100ms and subscribe to same value again.
      let result2 = '';
      const subscription2 = (<ComputedVar<string>>model.delayedVar).value$.subscribe(r => {
        result2 = r;
      });
      // Since computation in progress, it should NOT return the previously computed ("not delayed")
      expect(result2).toEqual('');
      tick(3000);
      expect(result1).toEqual('delayed');
      expect(result2).toEqual('delayed');

      // There is no change in dependency, computeFn should not be invoked again.
      expect(model.cp1InvocationCount).toEqual(2);
      subscription1.unsubscribe();
      subscription2.unsubscribe();
    }));
  });
});
