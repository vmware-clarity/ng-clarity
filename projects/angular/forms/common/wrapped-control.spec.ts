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
  ElementRef,
  Injector,
  NgModule,
  Renderer2,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ClrIcon } from '@clr/angular/icon';
import { delay } from '@clr/angular/testing';
import { ClrHostWrappingModule, HostWrapper } from '@clr/angular/utils';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrAbstractContainer } from './abstract-container';
import { ClrControlError } from './control-subtexts/error';
import { ClrControlHelper } from './control-subtexts/helper';
import { ClrControlSuccess } from './control-subtexts/success';
import { ControlClassService } from './providers/control-class.service';
import { ControlIdService } from './providers/control-id.service';
import { LayoutService } from './providers/layout.service';
import { MarkControlService } from './providers/mark-control.service';
import { NgControlService } from './providers/ng-control.service';
import { WrappedFormControl } from './wrapped-control';

/*
 * Components using the WrappedFormControl we want to test.
 */
@Component({
  selector: 'test-wrapper',
  template: `<ng-content></ng-content>`,
  providers: [ControlIdService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestWrapper {}

@Directive({
  selector: '[testControl]',
  standalone: false,
})
class TestControl extends WrappedFormControl<TestWrapper> {
  constructor(vcr: ViewContainerRef, el: ElementRef<HTMLElement>) {
    super(vcr, TestWrapper, null, null, null, el);
  }
}

@Component({
  selector: 'test-wrapper2',
  template: `
    <div id="first"><ng-content></ng-content></div>
    <div id="second"><ng-content></ng-content></div>
  `,
  providers: [ControlIdService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestWrapper2 {}

@Directive({
  selector: '[testControl2]',
  standalone: false,
})
class TestControl2 extends WrappedFormControl<TestWrapper2> {
  constructor(vcr: ViewContainerRef, el: ElementRef<HTMLElement>) {
    super(vcr, TestWrapper2, null, null, null, el);
  }
}

@Component({
  selector: 'test-wrapper3',
  template: `<div id="wrapper"><ng-content></ng-content></div>`,
  providers: [ControlIdService, NgControlService, ControlClassService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestWrapper3 extends ClrAbstractContainer {}

@Directive({
  selector: '[testControl3]',
  standalone: false,
})
class TestControl3 extends WrappedFormControl<TestWrapper3> {
  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef<HTMLElement>
  ) {
    super(vcr, TestWrapper3, injector, control, renderer, el);
  }
}

@Component({
  selector: 'form-wrapper',
  template: `<div id="form-wrapper"><ng-content></ng-content></div>`,
  providers: [MarkControlService, LayoutService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class FormWrapper {}

@NgModule({
  imports: [ClrHostWrappingModule, FormsModule],
  declarations: [TestWrapper, TestControl, TestWrapper2, TestControl2, TestControl3, TestWrapper3, FormWrapper],
  exports: [TestWrapper, TestControl, TestWrapper2, TestControl2, TestControl3, TestWrapper3, FormWrapper],
})
class WrappedFormControlTestModule {}

/*
 * Actual test components, one for each case we support
 */
@Component({
  template: `<input testControl />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class NoWrapperNoId {}

@Component({
  template: `<input testControl id="hello" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class NoWrapperWithId {}

@Component({
  template: `<test-wrapper><input testControl /></test-wrapper>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class WithWrapperNoId {}

@Component({
  template: `<test-wrapper><input testControl id="hello" /></test-wrapper>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class WithWrapperWithId {}

@Component({
  template: `<test-wrapper2><input testControl id="hello" /></test-wrapper2>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class WithMultipleNgContent {}

@Component({
  template: `
    <form-wrapper>
      <test-wrapper3>
        <input testControl3 [(ngModel)]="model" required />
      </test-wrapper3>
    </form-wrapper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class WithControl {
  model = '';
}

@Component({
  template: `
    <form-wrapper>
      <test-wrapper3><input type="number" testControl3 [(ngModel)]="model" required /></test-wrapper3>
      <test-wrapper3><input type="number" testControl3 [(ngModel)]="model" required id="control2" /></test-wrapper3>
    </form-wrapper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class WithNumberControl {
  model = '';
}

@Component({
  template: `
    <form-wrapper>
      <test-wrapper3>
        <input testControl3 [(ngModel)]="model" required />
        <clr-control-helper>Helper</clr-control-helper>
      </test-wrapper3>
    </form-wrapper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class WithControlAndHelper {
  model = '';
}

@Component({
  template: `
    <form-wrapper>
      <test-wrapper3>
        <input testControl3 [(ngModel)]="model" required />
        <clr-control-error>Error</clr-control-error>
      </test-wrapper3>
    </form-wrapper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class WithControlAndError {
  model = '';
}

@Component({
  template: `
    <form-wrapper>
      <test-wrapper3>
        <input testControl3 [(ngModel)]="model" required />
        <clr-control-success>Success</clr-control-success>
      </test-wrapper3>
    </form-wrapper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class WithControlAndSuccess {
  model = '';
}

@Component({
  template: `
    <form-wrapper>
      <test-wrapper3>
        <label> Label </label>
        <textarea testControl3 [formControl]="form.get('control') || form.get('alternative')"></textarea>
        <clr-control-success>Successful!</clr-control-success>
      </test-wrapper3>
    </form-wrapper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class WithDynamicFormControl {
  form = new FormGroup<any>({
    alternative: new FormControl(),
  });

  addControl() {
    this.form.addControl('control', new FormControl('TEST'));
  }
}

@Component({
  template: `
    <form-wrapper>
      <test-wrapper3>
        <label> Label </label>
        <textarea testControl3 [(ngModel)]="form['control']"></textarea>
        <clr-control-success>Successful!</clr-control-success>
      </test-wrapper3>
    </form-wrapper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class WithDynamicNgControl {
  form = {};
  addControl() {
    this.form['control'] = 'TEST';
  }
}

interface TestContext {
  fixture: ComponentFixture<any>;
  wrapper: TestWrapper;
  control: any;
  controlIdService: ControlIdService;
  input: any;
  controlClassService?: ControlClassService;
  markControlService?: MarkControlService;
  ngControlService?: NgControlService;
  layoutService?: LayoutService;
}

describe('Forms common utilities', () => {
  describe('WrappedFormControl', () => {
    let testContext: TestContext;
    beforeEach(() => {
      testContext = {} as TestContext;
    });

    function setupTest<T>(testContext: TestContext, testComponent: Type<T>, testControl: any, includeProviders = true) {
      TestBed.configureTestingModule({
        imports: [ClrIcon, WrappedFormControlTestModule, FormsModule, ReactiveFormsModule],
        declarations: [testComponent, ClrControlError, ClrControlHelper, ClrControlSuccess],
        providers: includeProviders ? [MarkControlService, ControlClassService, NgControlService, LayoutService] : [],
      });
      testContext.fixture = TestBed.createComponent(testComponent);
      renderFixture(testContext.fixture);
      const wrapperDebugElement =
        testContext.fixture.debugElement.query(By.directive(TestWrapper)) ||
        testContext.fixture.debugElement.query(By.directive(TestWrapper3));
      testContext.wrapper = wrapperDebugElement.componentInstance;
      testContext.control = testContext.fixture.debugElement.query(By.directive(testControl)).injector.get(testControl);
      testContext.controlIdService = wrapperDebugElement.injector.get(ControlIdService);
      testContext.input = testContext.fixture.nativeElement.querySelector('input');
      // Capture them only when present, they are optional
      try {
        testContext.markControlService = wrapperDebugElement.injector.get(MarkControlService);
        testContext.controlClassService = wrapperDebugElement.injector.get(ControlClassService);
        testContext.ngControlService = wrapperDebugElement.injector.get(NgControlService);
        testContext.layoutService = wrapperDebugElement.injector.get(LayoutService);
      } catch (error) {
        // Swallow errors
        console.log(includeProviders ? error : new Error(`EXPECTED ERROR: ${error}`));
      }
    }

    // These two tests are expected to throw errors which are swallowed with try / catch in setupTest
    describe('getProviderFromContainer', () => {
      it('gets a provider from the container', () => {
        setupTest(testContext, WithWrapperNoId, TestControl, false);
        expect(testContext.control.getProviderFromContainer(ControlIdService)).toEqual(testContext.controlIdService);
      });

      it('returns not found if provider is missing', () => {
        setupTest(testContext, WithWrapperNoId, TestControl, false);
        expect(testContext.control.getProviderFromContainer(MarkControlService, false)).toBe(false);
      });
    });

    describe('with an explicit wrapper', () => {
      it('uses HostWrapper to inject the ControlIdService', () => {
        vi.spyOn(HostWrapper.prototype, 'get');
        setupTest(testContext, WithWrapperNoId, TestControl);
        expect(HostWrapper.prototype.get).toHaveBeenCalledWith(ControlIdService);
      });

      it('sets the id of the host to the id given by the service', () => {
        setupTest(testContext, WithWrapperNoId, TestControl);
        expect(testContext.input.getAttribute('id')).toBe(testContext.controlIdService.id);
      });

      it('updates the service to the correct id if it exists', () => {
        setupTest(testContext, WithWrapperWithId, TestControl);
        expect(testContext.input.getAttribute('id')).toBe('hello');
        expect(testContext.controlIdService.id).toBe('hello');
      });
    });

    describe('without an explicit wrapper', () => {
      it('uses HostWrapper to inject the ControlIdService', () => {
        vi.spyOn(HostWrapper.prototype, 'get');
        setupTest(testContext, NoWrapperNoId, TestControl);
        expect(HostWrapper.prototype.get).toHaveBeenCalledWith(ControlIdService);
      });

      it('sets the id of the host to the id given by the service', () => {
        setupTest(testContext, NoWrapperNoId, TestControl);
        expect(testContext.input.getAttribute('id')).toBe(testContext.controlIdService.id);
      });

      it('updates the service to the correct id if it exists', () => {
        setupTest(testContext, NoWrapperWithId, TestControl);
        expect(testContext.input.getAttribute('id')).toBe('hello');
        expect(testContext.controlIdService.id).toBe('hello');
      });
    });

    describe('with multiple projection slots', () => {
      it('projects into the second slot when configured', () => {
        setupTest(testContext, WithMultipleNgContent, TestControl);
        expect(testContext.fixture.nativeElement.querySelector('#first').innerHTML).toBe('');
        expect(testContext.fixture.nativeElement.querySelector('#second').querySelector('input')).toBeTruthy();
      });
    });

    describe('with a real NgControl', () => {
      it('sets the control class', () => {
        vi.spyOn(ControlClassService.prototype, 'initControlClass');
        setupTest(testContext, WithControl, TestControl3);
        expect(ControlClassService.prototype.initControlClass).toHaveBeenCalled();
      });

      it('subscribes to requests to mark as touched', () => {
        setupTest(testContext, WithControl, TestControl3);
        expect(testContext.input.className).not.toContain('ng-touched');
        testContext.markControlService.markAsTouched();
        renderFixture(testContext.fixture);
        expect(testContext.input.className).toContain('ng-touched');
      });

      it('sets the control on ngControlService', () => {
        vi.spyOn(NgControlService.prototype, 'addControl');
        setupTest(testContext, WithControl, TestControl3);
        expect(NgControlService.prototype.addControl).toHaveBeenCalled();
      });

      it('triggers status changes on blur', () => {
        setupTest(testContext, WithControl, TestControl3);
        vi.spyOn(TestControl3.prototype, 'triggerValidation');
        testContext.input.focus();
        testContext.input.blur();
        renderFixture(testContext.fixture);
        expect(TestControl3.prototype.triggerValidation).toHaveBeenCalled();
      });

      it('blur marks the control as touched', () => {
        setupTest(testContext, WithNumberControl, TestControl3);
        testContext.input.focus();
        testContext.input.blur();
        renderFixture(testContext.fixture);
        expect(testContext.input.className).toContain('ng-touched');
        expect(testContext.fixture.nativeElement.querySelector('#control2').className).toContain('ng-untouched');
      });

      it('implements ngOnDestroy', () => {
        setupTest(testContext, WithControl, TestControl3);
        expect(testContext.control.ngOnDestroy).toBeDefined();
      });
    });

    describe('with dynamic controls', () => {
      it('with form-control directive', () => {
        setupTest(testContext, WithDynamicFormControl, TestControl3);
        vi.spyOn<any, any>(TestControl3.prototype, 'triggerValidation');
        testContext.fixture.componentInstance.addControl();
        renderFixture(testContext.fixture);
        expect(TestControl3.prototype.triggerValidation).toHaveBeenCalled();
      });

      it('with ng-control directive', () => {
        setupTest(testContext, WithDynamicNgControl, TestControl3);
        vi.spyOn(TestControl3.prototype, 'triggerValidation');
        testContext.fixture.componentInstance.addControl();
        renderFixture(testContext.fixture);
        expect(TestControl3.prototype.triggerValidation).toHaveBeenCalled();
      });
    });

    describe('aria roles', () => {
      it('adds the aria-describedby for helper', () => {
        const untypedContext: any = testContext;

        setupTest(untypedContext, WithControlAndHelper, TestControl3);
        untypedContext.control.triggerValidation();
        expect(untypedContext.input.getAttribute('aria-describedby')).toContain('-helper');
      });

      it('does not set aria-describedby unless helper is present', () => {
        const untypedContext: any = testContext;

        setupTest(untypedContext, WithControl, TestControl3);
        untypedContext.control.triggerValidation();
        expect(untypedContext.input.getAttribute('aria-describedby')).toBe(null);
      });

      it('adds the aria-describedby with helper and error ids', async () => {
        setupTest(testContext, WithControlAndError, TestControl3);
        testContext.input.focus();
        testContext.input.blur();
        renderFixture(testContext.fixture);
        await delay();
        expect(testContext.input.getAttribute('aria-describedby')).toEqual(
          `${testContext.input.id}-helper ${testContext.input.id}-error`
        );
      });

      it('adds the aria-describedby for error messages', async () => {
        setupTest(testContext, WithControlAndError, TestControl3);
        testContext.input.focus();
        testContext.input.blur();
        renderFixture(testContext.fixture);
        await delay();
        expect(testContext.input.getAttribute('aria-describedby')).toContain('-error');
      });

      it('does not set aria-describedby unless error helper is present', () => {
        const untypedContext: any = testContext;

        setupTest(untypedContext, WithControl, TestControl3);
        untypedContext.input.focus();
        untypedContext.input.blur();
        renderFixture(untypedContext.fixture);

        expect(untypedContext.input.getAttribute('aria-describedby')).toBe(null);
      });

      it('adds the aria-describedby for success messages', async () => {
        setupTest(testContext, WithControlAndSuccess, TestControl3);
        testContext.input.focus();
        testContext.fixture.componentInstance.model = 'test';
        renderFixture(testContext.fixture);
        await delay();

        testContext.input.blur();
        renderFixture(testContext.fixture);
        await delay();

        expect(testContext.input.getAttribute('aria-describedby')).toContain('-success');
      });

      it('adds the aria-describedby with helper and success ids', async () => {
        setupTest(testContext, WithControlAndSuccess, TestControl3);
        testContext.input.focus();
        testContext.fixture.componentInstance.model = 'test';
        renderFixture(testContext.fixture);
        await delay();

        testContext.input.blur();
        renderFixture(testContext.fixture);
        await delay();

        expect(testContext.input.getAttribute('aria-describedby')).toEqual(
          `${testContext.input.id}-helper ${testContext.input.id}-success`
        );
      });

      it('does not set aria-describedby unless success helper is present', async () => {
        const untypedContext: any = testContext;

        setupTest(untypedContext, WithControl, TestControl3);
        untypedContext.input.focus();
        untypedContext.fixture.componentInstance.model = 'test';
        untypedContext.input.blur();
        renderFixture(untypedContext.fixture);
        await delay();

        expect(untypedContext.input.getAttribute('aria-describedby')).toBe(null);
      });
    });
  });
});
