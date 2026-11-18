/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  InjectionToken,
  NgModule,
  OnInit,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { renderFixture } from '@clr/angular/utils/testing';

import { HostWrapper } from './host-wrapper';
import { ClrHostWrappingModule } from './host-wrapping.module';

const WRAPPER_SERVICE = new InjectionToken<number>('WrapperService');

@Component({
  selector: 'wrapper-component',
  template: `Hello <ng-content></ng-content>!`,
  providers: [{ provide: WRAPPER_SERVICE, useValue: 42 }],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class WrapperComponent {}

@Directive({
  selector: '[wrappedDirective]',
  standalone: false,
})
class WrappedDirective implements OnInit {
  injected: number;

  constructor(private vcr: ViewContainerRef) {}

  ngOnInit() {
    this.injected = new HostWrapper(WrapperComponent, this.vcr).get(WRAPPER_SERVICE);
  }
}

@NgModule({
  declarations: [WrapperComponent, WrappedDirective],
  exports: [WrapperComponent, WrappedDirective],
})
class HostWrappingTestModule {}

@Component({
  template: `<span wrappedDirective>World</span>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class WrappingTest {}

@Component({
  template: `<wrapper-component><span wrappedDirective>World</span></wrapper-component>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ExplicitTest {}

@Component({
  template: `@if (show) {
    <span wrappedDirective>World</span>
  }`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class NgIfTest {
  show = true;
}

interface TestContext<T extends WrappingTest | ExplicitTest | NgIfTest> {
  fixture: ComponentFixture<T>;
  wrapper: WrapperComponent;
  wrapped: WrappedDirective;
}

describe('Host wrapping', () => {
  let testContext: TestContext<WrappingTest>;
  beforeEach(() => {
    testContext = {} as TestContext<WrappingTest>;
  });

  function setupTest<T>(testContext: TestContext<T>, testComponent: Type<T>) {
    TestBed.configureTestingModule({
      imports: [ClrHostWrappingModule, HostWrappingTestModule],
      declarations: [testComponent],
    });
    testContext.fixture = TestBed.createComponent(testComponent);
    renderFixture(testContext.fixture);
    testContext.wrapper = testContext.fixture.debugElement.query(By.directive(WrapperComponent)).componentInstance;
    testContext.wrapped = testContext.fixture.debugElement
      .query(By.directive(WrappedDirective))
      .injector.get(WrappedDirective);
  }

  describe('with an explicit wrapper', () => {
    beforeEach(() => {
      const typedContext = testContext as unknown as TestContext<ExplicitTest>;

      setupTest(typedContext, ExplicitTest);
    });

    afterEach(() => {
      const typedContext = testContext as unknown as TestContext<ExplicitTest>;

      typedContext.fixture.destroy();
    });

    it('renders one wrapper and one child', () => {
      const typedContext = testContext as unknown as TestContext<ExplicitTest>;

      expect(typedContext.fixture.nativeElement.textContent.trim()).toBe('Hello World!');
    });

    it('proxies to the default injector', () => {
      const typedContext = testContext as unknown as TestContext<ExplicitTest>;

      expect(typedContext.wrapped.injected).toBe(42);
    });

    it("doesn't create extra elements", () => {
      expect(testContext.fixture.nativeElement.childElementCount).toBe(1);
      expect(testContext.fixture.nativeElement.firstElementChild.childElementCount).toBe(1);
    });
  });

  describe('without an explicit wrapper', () => {
    beforeEach(() => {
      setupTest(testContext, WrappingTest);
    });

    afterEach(() => {
      testContext.fixture.destroy();
    });

    it('creates a wrapper and projects the host into it', () => {
      expect(testContext.fixture.nativeElement.textContent.trim()).toBe('Hello World!');
    });

    it("proxies to the newly created wrapper's injector", () => {
      expect(testContext.wrapped.injected).toBe(42);
    });

    it("doesn't leave useless elements", () => {
      expect(testContext.fixture.nativeElement.childElementCount).toBe(1);
      expect(testContext.fixture.nativeElement.firstElementChild.childElementCount).toBe(1);
    });
  });

  describe('with @if', () => {
    beforeEach(() => {
      const typedContext = testContext as unknown as TestContext<NgIfTest>;

      setupTest(typedContext, NgIfTest);
    });

    afterEach(() => {
      const typedContext = testContext as unknown as TestContext<NgIfTest>;

      typedContext.fixture.destroy();
    });

    it('correctly destroys and recreates everything', () => {
      const typedContext = testContext as unknown as TestContext<NgIfTest>;

      expect(typedContext.fixture.nativeElement.textContent.trim()).toBe('Hello World!');

      typedContext.fixture.componentInstance.show = false;
      renderFixture(typedContext.fixture);
      expect(typedContext.fixture.nativeElement.textContent.trim()).toBe('');

      typedContext.fixture.componentInstance.show = true;
      renderFixture(typedContext.fixture);
      expect(typedContext.fixture.nativeElement.textContent.trim()).toBe('Hello World!');
    });
  });
});
