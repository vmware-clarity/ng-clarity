/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DebugElement, InjectionToken, ModuleWithProviders, Type } from '@angular/core';
import { ComponentFixture, TestBed, TestBedStatic, TestModuleMetadata, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

// import { reportSlowSpecs } from "./slow-specs.spec";

export class TestContext<C, H> {
  /*
   * Spec config
   */
  clarityDirectiveType: Type<C>;
  hostType: Type<H>;
  testingModule: TestBed | TestBedStatic;

  /*
   * Objects instantiated for one test
   */
  fixture: ComponentFixture<H>;
  hostComponent: H;
  hostElement: HTMLElement;
  clarityDirective: C;
  clarityElement: HTMLElement;

  private clarityDebugElement: DebugElement;

  // Initialization logic can be manually called to allow for overrides before instantiation
  init() {
    this.fixture = TestBed.createComponent(this.hostType);
    this.fixture.detectChanges();
    this.hostComponent = this.fixture.componentInstance;
    this.hostElement = this.fixture.nativeElement;
    this.clarityDebugElement = this.fixture.debugElement.query(By.directive(this.clarityDirectiveType));
    if (!this.clarityDebugElement) {
      const componentName = this.hostType.name;
      const clarityDirectiveName = this.clarityDirectiveType.name;
      throw new Error(`Test component ${componentName} doesn't contain a ${clarityDirectiveName}`);
    }
    this.clarityDirective = this.clarityDebugElement.injector.get(this.clarityDirectiveType);
    this.clarityElement = this.clarityDebugElement.nativeElement;
  }

  getProvider<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T {
    return TestBed.get(token, notFoundValue);
  }

  // The Function type here is just to tell Typescript to be nice with abstract classes. Weird.

  // eslint-disable-next-line @typescript-eslint/ban-types
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
 * @param hostType - the host test component used to run the specs
 * @param claritySubmodule - If you need a whole Clarity component submodule to test the component, provide it here
 * @param moduleMetadata - custom additional metadata for the testing module: extra imports, extra declarations, etc.
 * @param autoInit - the host test component is instantiated by default when the test starts. If you need to override
 *  some component's provider, templates or other override TestBed provides, set this autoInit option to false and
 *  perform your overrides before manually calling this.init() on the TestContext.
 */
export function spec<C, H>(
  clarityDirectiveType: Type<C>,
  hostType: Type<H>,
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
    const declarations: Type<any>[] = [hostType];
    if (!claritySubmodule) {
      declarations.push(clarityDirectiveType);
    }
    if (moduleMetadata && moduleMetadata.declarations) {
      declarations.push(...moduleMetadata.declarations);
    }
    this.testingModule = TestBed.configureTestingModule({ ...moduleMetadata, imports, declarations });
    this.clarityDirectiveType = clarityDirectiveType;
    this.hostType = hostType;
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

/**
 * This was initially a copy-paste of the datagrid helpers, but when we modularized Clarity, it got updated to
 * something that's way too rigid and doesn't help for complex specs anymore. Deprecating for now, I'm going
 * to create a temporary new one until we can take some time to finally, one day, if ever, hopefully, maybe,
 * unify our test helpers across all of our code base.
 * @deprecated
 */
export function addHelpersDeprecated(
  modulesToImport?: Array<Type<any> | ModuleWithProviders<RouterModule> | any[]>
): void {
  beforeEach(function () {
    /*
     * Ideally we would just make "this" a TestContext, but typing "this" in typescript
     * is a bit too new for all IDEs to correctly process it.
     */
    this.create = <D, C>(clarityDirective: Type<D>, testComponent: Type<C>, providers: any[] = []) => {
      TestBed.configureTestingModule({ imports: modulesToImport, declarations: [testComponent], providers: providers });
      this._context = new TestContext<D, C>();
      this._context.clarityDirectiveType = clarityDirective;
      this._context.hostType = testComponent;
      this._context.init();
      return this._context;
    };
  });

  afterEach(function () {
    if (this._context) {
      this._context.fixture.destroy();
    }
  });
}

/**
 * Helper for testing requestAnimationFrame code. FakeAssync internally mocks requestAnimationFrame as setTimeout(16).
 * That's why we need to test it with tick(16). 16 is not a truly magic number, it's the approximated single frame time
 * of a 60 FPS refresh rate.
 * @param fixture If fixture is provided we will also run change detection. Unlike the usual fakeAsync/tick scenario,
 * where tick() follows the changeDetection, requestAnimationFrame may be used to setup preconditions for a change detection
 * cycle, so it should precede a detectChanges call.
 */
export function animationFrameTick(fixture?: ComponentFixture<any>) {
  tick(16);
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
