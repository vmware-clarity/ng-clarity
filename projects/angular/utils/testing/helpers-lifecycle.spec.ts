/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Directive, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Mock } from 'vitest';

import { createTestHelpers, spec, TestContext } from './helpers';

@Injectable()
class TestService {
  value = 'original';
}

@Directive({
  selector: '[helperTest]',
  providers: [TestService],
  standalone: false,
})
class TestDirective {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'helper-test-host',
  template: '<span helperTest>{{ value }}</span>',
  providers: [TestService],
  standalone: false,
})
class TestHost {
  value = 'initial';
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<helper-test-host />',
  standalone: false,
})
class TestWrapper {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '',
})
class TeardownTestHost {
  destroyed = false;

  ngOnDestroy() {
    this.destroyed = true;
  }
}

describe('Test environment teardown', () => {
  let previousHost: TeardownTestHost;

  beforeEach(() => {
    if (previousHost) {
      expect(previousHost.destroyed).toBe(true);
    }
    TestBed.configureTestingModule({ imports: [TeardownTestHost] });
    previousHost = TestBed.createComponent(TeardownTestHost).componentInstance;
  });

  it('creates a fresh host', () => {
    expect(previousHost.destroyed).toBe(false);
  });

  it('destroys the previous fixture before starting another test', () => {
    expect(previousHost.destroyed).toBe(false);
  });
});

describe('Test context helpers', () => {
  describe('spec', () => {
    const contexts = new Set<TestContext<TestDirective, TestHost>>();
    const getContext = spec(TestDirective, TestHost);

    beforeEach(() => {
      expect(contexts.has(getContext())).toBe(false);
      contexts.add(getContext());
      expect(getContext().testComponent.value).toBe('initial');
    });

    it('exposes the initialized fixture through a closure', () => {
      const context = getContext();
      expect(context.fixture.componentInstance).toBe(context.testComponent);
      expect(context.clarityDirective).toEqual(expect.any(TestDirective));
      context.testComponent.value = 'changed';
      context.detectChanges();
      expect(context.clarityElement.textContent).toBe('changed');
    });

    it('creates a fresh context for each test', () => {
      expect(getContext()).toEqual(expect.any(TestContext));
    });
  });

  describe('deferred initialization', () => {
    const getContext = spec(TestDirective, TestHost, undefined, {}, false);

    it('allows TestBed overrides before creating the fixture', () => {
      const context = getContext();
      expect(context.fixture).toBeUndefined();
      TestBed.overrideDirective(TestDirective, {
        set: { providers: [{ provide: TestService, useValue: { value: 'overridden' } }] },
      });
      context.init();
      expect(context.getClarityProvider(TestService).value).toBe('overridden');
    });

    it('cleans up safely when a test never initializes its fixture', () => {
      expect(getContext().fixture).toBeUndefined();
    });
  });

  describe('fixture factories', () => {
    let destroy: Mock;

    afterEach(() => {
      expect(destroy).toHaveBeenCalled();
    });

    describe('create', () => {
      const helpers = createTestHelpers();

      it('creates and cleans up a fixture with extra directives', () => {
        const context = helpers.create(TestDirective, TestHost, [], [TestDirective]);
        destroy = vi.spyOn(context.fixture, 'destroy');
        expect(context.clarityDirective).toEqual(expect.any(TestDirective));
      });
    });

    describe('createOnly', () => {
      const helpers = createTestHelpers();

      it('declares the directive without importing ClarityModule', () => {
        const context = helpers.createOnly(TestDirective, TestHost);
        destroy = vi.spyOn(context.fixture, 'destroy');
        expect(context.clarityDirective).toEqual(expect.any(TestDirective));
      });
    });

    describe('createWithOverrideComponent', () => {
      const helpers = createTestHelpers();

      it('applies component provider overrides', () => {
        const context = helpers.createWithOverrideComponent(
          TestHost,
          TestWrapper,
          [],
          [TestHost, TestDirective],
          [{ provide: TestService, useValue: { value: 'component override' } }]
        );
        destroy = vi.spyOn(context.fixture, 'destroy');
        expect(context.getClarityProvider(TestService).value).toBe('component override');
      });
    });

    describe('createWithOverrideDirective', () => {
      const helpers = createTestHelpers();

      it('applies directive provider overrides', () => {
        const context = helpers.createWithOverrideDirective(
          TestDirective,
          TestHost,
          [],
          [TestDirective],
          [{ provide: TestService, useValue: { value: 'directive override' } }]
        );
        destroy = vi.spyOn(context.fixture, 'destroy');
        expect(context.getClarityProvider(TestService).value).toBe('directive override');
      });
    });
  });
});
