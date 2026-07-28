/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { of } from 'rxjs';

import { ComputedVar, ComputeStrategy, SimpleVar, Var } from './var';

function verifyComputedVar<T>(c: Var<T>, expectedValue: T, strategy: ComputeStrategy = ComputeStrategy.lazy): void {
  expect(c instanceof ComputedVar).toEqual(true);
  const cv: ComputedVar<T> = <ComputedVar<T>>c;
  // Value will be undefined, because function will be executed on subscribe.
  expect(c.value).toBeUndefined();
  // Subscribe to evaluate the "computeFn".
  cv.value$.subscribe().unsubscribe();
  expect(c.value).toEqual(expectedValue);
  expect(cv.strategy).toEqual(strategy);
}

describe('var.spec', () => {
  describe('Var.of()', () => {
    it('create SimpleVar without initial value', () => {
      const v: Var<string> = Var.of<string>();
      expect(v instanceof SimpleVar).toEqual(true);
      expect(v.value).toBeUndefined();
    });

    it('create SimpleVar with initial value', () => {
      const v: Var<string> = Var.of<string>('testValue');
      expect(v instanceof SimpleVar).toEqual(true);
      expect(v.value).toEqual('testValue');
    });
  });

  describe('Var.from().by()', () => {
    it('Var.form().by() without dependencies', () => {
      const c: Var<string> = Var.from().by(() => of('goodbye world'));
      verifyComputedVar(c, 'goodbye world');
    });

    it('Var.form().by() with 1 dependency', () => {
      const v1 = Var.of('hello');
      const c: Var<string> = Var.from(v1).by((v1Value: string) => of(`${v1Value}!`));
      verifyComputedVar(c, 'hello!');
    });

    it('Var.form().by() with 2 dependencies', () => {
      const v1 = Var.of('Hello');
      const v2 = Var.of('Cleveland');
      const c: Var<string> = Var.from(v1, v2).by((v1Value: string, v2Value: string) => of(`${v1Value}, ${v2Value}!`));
      verifyComputedVar(c, 'Hello, Cleveland!');
    });

    it('will not break if dependent values cannot be serialized', () => {
      const circularDep: any = {
        p1: 'world',
        self: null,
      };
      circularDep.self = circularDep;
      const v1 = Var.of('Howdy');
      const v2 = Var.of(circularDep);
      const c: Var<string> = Var.from(v1, v2).by((v1Value: string, obj: any) => of(`${v1Value} ${obj.p1}!`));
      verifyComputedVar(c, 'Howdy world!');
    });
  });

  describe('Var.from().pluck()', () => {
    it('Var.form().pluck() first level property', () => {
      const v1 = Var.of({ name: 'dummy', value: true });
      const c1: Var<string> = Var.from(v1).pluck('name');
      const c2: Var<boolean> = Var.from(v1).pluck('value');

      verifyComputedVar(c1, 'dummy');
      verifyComputedVar(c2, true);
    });
  });

  describe('Var.from().withEagerEval()', () => {
    it('Var.form().withEagerEval().by() without dependencies', () => {
      const c: Var<string> = Var.from()
        .withEagerEval()
        .by(() => of('Samo Levski!'));
      verifyComputedVar(c, 'Samo Levski!', ComputeStrategy.eager);
    });

    it('Var.form().withEagerEval().by() with 1 dependency', () => {
      const v1 = Var.of('hello');
      const c: Var<string> = Var.from(v1)
        .withEagerEval()
        .by((v1Value: string) => of(`${v1Value}!`));
      verifyComputedVar(c, 'hello!', ComputeStrategy.eager);
    });

    it('Var.form().withEagerEval().by() with 2 dependencies', () => {
      const v1 = Var.of('hello');
      const v2 = Var.of('world');
      const c: Var<string> = Var.from(v1, v2)
        .withEagerEval()
        .by((v1Value: string, v2Value: string) => of(`${v1Value} ${v2Value}!`));
      verifyComputedVar(c, 'hello world!', ComputeStrategy.eager);
    });

    it('Var.form().withEagerEval().pluck() first level property', () => {
      const v1 = Var.of({ name: 'dummy', value: true });
      const c1: Var<string> = Var.from(v1).withEagerEval().pluck('name');
      const c2: Var<boolean> = Var.from(v1).withEagerEval().pluck('value');

      verifyComputedVar(c1, 'dummy', ComputeStrategy.eager);
      verifyComputedVar(c2, true, ComputeStrategy.eager);
    });
  });

  describe('Var.from().withLazyEval()', () => {
    it('Var.form().withLazyEval().by() without dependencies', () => {
      const c: Var<string> = Var.from()
        .withLazyEval()
        .by(() => of('hello world'));
      verifyComputedVar(c, 'hello world', ComputeStrategy.lazy);
    });

    it('Var.form().withLazyEval().by() with 1 dependency', () => {
      const v1 = Var.of('hello');
      const c: Var<string> = Var.from(v1)
        .withLazyEval()
        .by((v1Value: string) => of(`${v1Value}!`));
      verifyComputedVar(c, 'hello!', ComputeStrategy.lazy);
    });

    it('Var.form().withLazyEval().by() with 2 dependencies', () => {
      const v1 = Var.of('hello');
      const v2 = Var.of('world');
      const c: Var<string> = Var.from(v1, v2)
        .withLazyEval()
        .by((v1Value: string, v2Value: string) => of(`${v1Value} ${v2Value}!`));
      verifyComputedVar(c, 'hello world!', ComputeStrategy.lazy);
    });

    it('Var.form().withLazyEval().pluck() first level property', () => {
      const v1 = Var.of({ name: 'dummy', value: true });
      const c1: Var<string> = Var.from(v1).withLazyEval().pluck('name');
      const c2: Var<boolean> = Var.from(v1).withLazyEval().pluck('value');

      verifyComputedVar(c1, 'dummy', ComputeStrategy.lazy);
      verifyComputedVar(c2, true, ComputeStrategy.lazy);
    });
  });
});
