/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, InjectionToken, Type } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClarityModule } from '@clr/angular';

export class TestContext<D, C> {
  fixture: ComponentFixture<C>;
  testComponentType: Type<C>;
  clarityDirectiveType: Type<D>;
  testingModule: TestBed;
  testComponent: C;
  testElement: any;
  clarityDirective: D;
  clarityElement: any;

  private clarityDebugElement: DebugElement;

  constructor(directiveType: Type<D>, componentType: Type<C>, autoInit = true) {
    this.clarityDirectiveType = directiveType;
    this.testComponentType = componentType;
    if (autoInit) {
      this.init();
    }
  }

  init() {
    this.fixture = TestBed.createComponent(this.testComponentType);
    this.fixture.detectChanges();
    this.testComponent = this.fixture.componentInstance;
    this.testElement = this.fixture.nativeElement;
    this.clarityDebugElement = this.fixture.debugElement.query(By.directive(this.clarityDirectiveType));
    if (!this.clarityDebugElement) {
      const componentName = (this.testComponentType as any).name;
      const clarityDirectiveName = (this.clarityDirectiveType as any).name;
      throw new Error(`Test component ${componentName} doesn't contain a ${clarityDirectiveName}`);
    }
    this.clarityDirective = this.clarityDebugElement.injector.get(this.clarityDirectiveType);
    this.clarityElement = this.clarityDebugElement.nativeElement;
  }

  getProvider<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T {
    return TestBed.inject(token, notFoundValue);
  }

  // The Function type here is just to tell Typescript to be nice with abstract classes. Weird.
  getClarityProvider<T>(token: Type<T> | InjectionToken<T> | Function, notFoundValue?: T): T {
    return this.clarityDebugElement.injector.get(token, notFoundValue);
  }

  /** Wait for Angular's scheduled rendering without forcing a change detection pass. */
  stable(): Promise<void> {
    return this.fixture.whenStable();
  }

  /** Set a host component input through Angular so OnPush views receive a notification. */
  async setInput(name: string, value: unknown): Promise<void> {
    this.fixture.componentRef.setInput(name, value);
    await this.stable();
  }

  /**
   * Delegate method to avoid verbosity
   */
  detectChanges() {
    this.fixture.detectChanges();
  }
}
/**
 * @param clarityDirectiveType - the Clarity directive/component class being tested
 * @param testComponentType - the host test component used to run the specs
 * @param claritySubmodule - If you need a whole Clarity component submodule to test the component, provide it here
 * @param moduleMetadata - custom additional metadata for the testing module: extra imports, extra declarations, etc.
 * @param autoInit - the host test component is instantiated by default when the test starts. If you need to override
 *  some component's provider, templates or other override TestBed provides, set this autoInit option to false and
 *  perform your overrides before manually calling context.init() on the TestContext returned by the accessor.
 */
export function spec<C, H>(
  clarityDirectiveType: Type<C>,
  testComponentType: Type<H>,
  claritySubmodule?: any,
  moduleMetadata: TestModuleMetadata = {},
  autoInit = true
) {
  let context: TestContext<C, H>;

  beforeEach(() => {
    const imports = [];
    if (claritySubmodule) {
      imports.push(claritySubmodule);
    }
    if (moduleMetadata && moduleMetadata.imports) {
      imports.push(...moduleMetadata.imports);
    }
    const declarations: Type<any>[] = [testComponentType];
    if (!claritySubmodule) {
      declarations.push(clarityDirectiveType);
    }
    if (moduleMetadata && moduleMetadata.declarations) {
      declarations.push(...moduleMetadata.declarations);
    }
    const testingModule = TestBed.configureTestingModule({ ...moduleMetadata, imports, declarations });
    context = new TestContext(clarityDirectiveType, testComponentType, false);
    context.testingModule = testingModule;
    if (autoInit) {
      context.init();
    }
  });

  afterEach(() => {
    if (context?.fixture) {
      context.fixture.destroy();
      context.fixture.nativeElement.remove();
    }
  });

  return () => context;
}

/** Create fixture helpers scoped to the current suite, with cleanup after each test. */
export function createTestHelpers() {
  const contexts: TestContext<any, any>[] = [];
  const create = <D, C>(
    clarityDirective: Type<D>,
    testComponent: Type<C>,
    providers: any[] = [],
    extraDirectives: Type<any>[] = []
  ) => {
    TestBed.configureTestingModule({
      imports: [ClarityModule],
      declarations: [testComponent, ...extraDirectives],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: providers,
    });
    const context = new TestContext<D, C>(clarityDirective, testComponent);
    contexts.push(context);
    return context;
  };

  const createOnly = <D, C>(
    clarityDirective: Type<D>,
    testComponent: Type<C>,
    providers: any[] = [],
    extraDirectives: Type<any>[] = []
  ) => {
    TestBed.configureTestingModule({
      declarations: [clarityDirective, testComponent, ...extraDirectives],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: providers,
    });
    const context = new TestContext<D, C>(clarityDirective, testComponent);
    contexts.push(context);
    return context;
  };

  const createWithOverrideComponent = <D, C>(
    clarityDirective: Type<D>,
    testComponent: Type<C>,
    providers: any[] = [],
    extraDirectives: Type<any>[] = [],
    serviceOverrides: any[]
  ) => {
    TestBed.configureTestingModule({
      imports: [ClarityModule],
      declarations: [testComponent, ...extraDirectives],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: providers,
    }).overrideComponent(clarityDirective, {
      set: {
        providers: serviceOverrides,
      },
    });
    const context = new TestContext<D, C>(clarityDirective, testComponent);
    contexts.push(context);
    return context;
  };

  const createWithOverrideDirective = <D, C>(
    clarityDirective: Type<D>,
    testComponent: Type<C>,
    providers: any[] = [],
    extraDirectives: Type<any>[] = [],
    serviceOverrides: any[]
  ) => {
    TestBed.configureTestingModule({
      imports: [ClarityModule],
      declarations: [testComponent, ...extraDirectives],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: providers,
    }).overrideDirective(clarityDirective, {
      set: {
        providers: serviceOverrides,
      },
    });
    const context = new TestContext<D, C>(clarityDirective, testComponent);
    contexts.push(context);
    return context;
  };
  afterEach(() => {
    for (const context of contexts) {
      context.fixture.destroy();
    }
    contexts.length = 0;
  });

  return { create, createOnly, createWithOverrideComponent, createWithOverrideDirective };
}

export function assertEqualDates(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
export function delay(ms = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Turns the CSS animations and transitions back on (`test.ts` turns them off for all the specs). Returns the function
 * turning them off again; call it in an `afterEach`.
 */
export function enableCssAnimations(): () => void {
  const noAnimationsStyle = document.getElementById('clr-test-no-animations') as HTMLStyleElement | null;
  if (noAnimationsStyle) {
    noAnimationsStyle.disabled = true;
  }
  return () => {
    if (noAnimationsStyle) {
      noAnimationsStyle.disabled = false;
    }
  };
}

/** Finishes the running animations (CSS or Web Animations) of the element and of its descendants. */
export function finishAnimations(element: Element) {
  element.getAnimations({ subtree: true }).forEach(animation => {
    if (animation.effect?.getComputedTiming().iterations !== Infinity) {
      animation.finish();
    }
  });
}

/**
 * Allow a browser animation frame before checking a fixture. Keep requestAnimationFrame real when using Vitest timers.
 */
export async function animationFrameTick(fixture?: ComponentFixture<any>) {
  await delay(16);
  if (fixture) {
    fixture.detectChanges();
  }
}

export function expectActiveElementToBe(element: Element, failOutput = null): void {
  expect(document.activeElement, failOutput).toBe(element);
}

export function expectActiveElementNotToBe(element: Element, failOutput = null): void {
  expect(document.activeElement, failOutput).not.toBe(element);
}
