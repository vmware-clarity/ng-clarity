/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, InjectionToken, Type } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';
// import { reportSlowSpecs } from "./slow-specs.spec";

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

  constructor(directiveType: Type<D>, componentType: Type<C>) {
    this.clarityDirectiveType = directiveType;
    this.testComponentType = componentType;
    this.init();
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
 *  perform your overrides before manually calling this.init() on the TestContext.
 */
export function spec<C, H>(
  clarityDirectiveType: Type<C>,
  testComponentType: Type<H>,
  claritySubmodule?: any,
  moduleMetadata: TestModuleMetadata = {},
  autoInit = true
) {
  beforeEach(function () {
    /*
     * I feel slightly dirty writing this, but Jasmine creates plain objects
     * and modifying their prototype is definitely a bad idea
     */
    Object.assign(this, TestContext.prototype);
    // What changed from 8.0.0-rc5 -> 8.0.0 ?!?!!
    // After Anglar 8 updates functions are not getting assigned to this.
    this.detectChanges = TestContext.prototype.detectChanges;
    this.getClarityProvider = TestContext.prototype.getClarityProvider;
    this.init = TestContext.prototype.init;
    this.getProvider = TestContext.prototype.getProvider;
  });

  beforeEach(function (this: TestContext<C, H>) {
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
    this.testingModule = TestBed.configureTestingModule({ ...moduleMetadata, imports, declarations });
    this.clarityDirectiveType = clarityDirectiveType;
    this.testComponentType = testComponentType;
    if (autoInit) {
      this.init();
    }
  });

  afterEach(function (this: TestContext<C, H>) {
    if (this.fixture) {
      this.fixture.destroy();
      this.fixture.nativeElement.remove();
    }
  });
}

export function addHelpers(): void {
  beforeEach(function () {
    /*
     * Ideally we would just make "this" a TestContext, but typing "this" in typescript
     * is a bit too new for all IDEs to correctly process it.
     */
    this.create = <D, C>(
      clarityDirective: Type<D>,
      testComponent: Type<C>,
      providers: any[] = [],
      extraDirectives: Type<any>[] = []
    ) => {
      TestBed.configureTestingModule({
        imports: [ClarityModule, NoopAnimationsModule],
        declarations: [testComponent, ...extraDirectives],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: providers,
      });
      return (this._context = new TestContext<D, C>(clarityDirective, testComponent));
    };

    this.createOnly = <D, C>(
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
      return (this._context = new TestContext<D, C>(clarityDirective, testComponent));
    };

    this.createWithOverrideComponent = <D, C>(
      clarityDirective: Type<D>,
      testComponent: Type<C>,
      providers: any[] = [],
      extraDirectives: Type<any>[] = [],
      serviceOverrides: any[]
    ) => {
      TestBed.configureTestingModule({
        imports: [ClarityModule, NoopAnimationsModule],
        declarations: [testComponent, ...extraDirectives],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: providers,
      }).overrideComponent(clarityDirective, {
        set: {
          providers: serviceOverrides,
        },
      });
      return (this._context = new TestContext<D, C>(clarityDirective, testComponent));
    };

    this.createWithOverrideDirective = <D, C>(
      clarityDirective: Type<D>,
      testComponent: Type<C>,
      providers: any[] = [],
      extraDirectives: Type<any>[] = [],
      serviceOverrides: any[]
    ) => {
      TestBed.configureTestingModule({
        imports: [ClarityModule, NoopAnimationsModule],
        declarations: [testComponent, ...extraDirectives],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: providers,
      }).overrideDirective(clarityDirective, {
        set: {
          providers: serviceOverrides,
        },
      });
      return (this._context = new TestContext<D, C>(clarityDirective, testComponent));
    };
  });

  afterEach(function () {
    if (this._context) {
      this._context.fixture.destroy();
    }
  });
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
 * Helper for testing requestAnimationFrame code. FakeAssync internally mocks requestAnimationFrame as setTimeout(16).
 * That's why we need to test it with tick(16). 16 is not a truly magic number, it's the approximated single frame time
 * of a 60 FPS refresh rate.
 * @param fixture If fixture is provided we will also run change detection. Unlike the usual fakeAsync/tick scenario,
 * where tick() follows the changeDetection, requestAnimationFrame may be used to setup preconditions for a change detection
 * cycle, so it should precede a detectChanges call.
 */
export async function animationFrameTick(fixture?: ComponentFixture<any>) {
  await delay(16);
  if (fixture) {
    fixture.detectChanges();
  }
}

/*
 * uncomment the line below to show how long it takes specs to run
 * need to also uncomment the import up top.
 * would be nice to be able to pass karma/jasmine a flag to turn this off and on.
 */
// reportSlowSpecs();

export function expectActiveElementToBe(element: Element, failOutput = null): void {
  expect(document.activeElement).withContext(failOutput).toBe(element);
}

export function expectActiveElementNotToBe(element: Element, failOutput = null): void {
  expect(document.activeElement).withContext(failOutput).not.toBe(element);
}
