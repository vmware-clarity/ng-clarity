/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Directive, ElementRef, Injector, NgModule, Renderer2, Type, ViewContainerRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { HostWrapper } from '../../utils/host-wrapping/host-wrapper';
import { ClrHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { ClrAbstractContainer } from './abstract-container';
import { ClrControlError } from './error';
import { ClrControlHelper } from './helper';
import { CONTROL_STATE, IfControlStateService } from './if-control-state/if-control-state.service';
import { ControlClassService } from './providers/control-class.service';
import { ControlIdService } from './providers/control-id.service';
import { LayoutService } from './providers/layout.service';
import { MarkControlService } from './providers/mark-control.service';
import { NgControlService } from './providers/ng-control.service';
import { ClrControlSuccess } from './success';
import { WrappedFormControl } from './wrapped-control';

/*
 * Components using the WrappedFormControl we want to test.
 */
@Component({
  selector: 'test-wrapper',
  template: `<ng-content></ng-content>`,
  providers: [ControlIdService],
  standalone: false,
})
class TestWrapper {}

@Directive({
  selector: '[testControl]',
  standalone: false,
})
class TestControl extends WrappedFormControl<TestWrapper> {
  constructor(vcr: ViewContainerRef) {
    super(vcr, TestWrapper, null, null, null, null);
  }
}

@Component({
  selector: 'test-wrapper2',
  template: `
    <div id="first"><ng-content></ng-content></div>
    <div id="second"><ng-content></ng-content></div>
  `,
  providers: [ControlIdService],
  standalone: false,
})
class TestWrapper2 {}

@Directive({
  selector: '[testControl2]',
  standalone: false,
})
class TestControl2 extends WrappedFormControl<TestWrapper2> {
  constructor(vcr: ViewContainerRef) {
    super(vcr, TestWrapper2, null, null, null, null);
  }
}

@Component({
  selector: 'test-wrapper3',
  template: `<div id="wrapper"><ng-content></ng-content></div>`,
  providers: [ControlIdService, NgControlService, IfControlStateService, ControlClassService],
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
  standalone: false,
})
class NoWrapperNoId {}

@Component({
  template: `<input testControl id="hello" />`,
  standalone: false,
})
class NoWrapperWithId {}

@Component({
  template: `<test-wrapper><input testControl /></test-wrapper>`,
  standalone: false,
})
class WithWrapperNoId {}

@Component({
  template: `<test-wrapper><input testControl id="hello" /></test-wrapper>`,
  standalone: false,
})
class WithWrapperWithId {}

@Component({
  template: `<test-wrapper2><input testControl id="hello" /></test-wrapper2>`,
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
  ifControlStateService: IfControlStateService;
  layoutService?: LayoutService;
}

export default function (): void {
  describe('WrappedFormControl', () => {
    function setupTest<T>(testContext: TestContext, testComponent: Type<T>, testControl: any) {
      TestBed.configureTestingModule({
        imports: [WrappedFormControlTestModule, FormsModule, ReactiveFormsModule],
        declarations: [testComponent, ClrControlError, ClrControlHelper, ClrControlSuccess],
      });
      testContext.fixture = TestBed.createComponent(testComponent);
      testContext.fixture.detectChanges();
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
        testContext.ifControlStateService = wrapperDebugElement.injector.get(IfControlStateService);
        testContext.layoutService = wrapperDebugElement.injector.get(LayoutService);
      } catch (error) {
        // Swallow errors
      }
    }

    describe('getProviderFromContainer', function () {
      it('gets a provider from the container', function (this: TestContext) {
        setupTest(this, WithWrapperNoId, TestControl);
        expect(this.control.getProviderFromContainer(ControlIdService)).toEqual(this.controlIdService);
      });

      it('returns not found if provider is missing', function (this: TestContext) {
        setupTest(this, WithWrapperNoId, TestControl);
        expect(this.control.getProviderFromContainer(MarkControlService, false)).toBeFalse();
      });
    });

    describe('with an explicit wrapper', function () {
      it('uses HostWrapper to inject the ControlIdService', function (this: TestContext) {
        spyOn(HostWrapper.prototype, 'get').and.callThrough();
        setupTest(this, WithWrapperNoId, TestControl);
        expect(HostWrapper.prototype.get).toHaveBeenCalledWith(ControlIdService);
      });

      it('sets the id of the host to the id given by the service', function (this: TestContext) {
        setupTest(this, WithWrapperNoId, TestControl);
        expect(this.input.getAttribute('id')).toBe(this.controlIdService.id);
      });

      it('updates the service to the correct id if it exists', function (this: TestContext) {
        setupTest(this, WithWrapperWithId, TestControl);
        expect(this.input.getAttribute('id')).toBe('hello');
        expect(this.controlIdService.id).toBe('hello');
      });
    });

    describe('without an explicit wrapper', function () {
      it('uses HostWrapper to inject the ControlIdService', function (this: TestContext) {
        spyOn(HostWrapper.prototype, 'get').and.callThrough();
        setupTest(this, NoWrapperNoId, TestControl);
        expect(HostWrapper.prototype.get).toHaveBeenCalledWith(ControlIdService);
      });

      it('sets the id of the host to the id given by the service', function (this: TestContext) {
        setupTest(this, NoWrapperNoId, TestControl);
        expect(this.input.getAttribute('id')).toBe(this.controlIdService.id);
      });

      it('updates the service to the correct id if it exists', function (this: TestContext) {
        setupTest(this, NoWrapperWithId, TestControl);
        expect(this.input.getAttribute('id')).toBe('hello');
        expect(this.controlIdService.id).toBe('hello');
      });
    });

    describe('with multiple projection slots', function () {
      it('projects into the second slot when configured', function (this: TestContext) {
        setupTest(this, WithMultipleNgContent, TestControl);
        expect(this.fixture.nativeElement.querySelector('#first').innerHTML).toBe('');
        expect(this.fixture.nativeElement.querySelector('#second').querySelector('input')).toBeTruthy();
      });
    });

    describe('with a real NgControl', function () {
      it('sets the control class', function (this: TestContext) {
        spyOn(ControlClassService.prototype, 'initControlClass').and.callThrough();
        setupTest(this, WithControl, TestControl3);
        expect(ControlClassService.prototype.initControlClass).toHaveBeenCalled();
      });

      it('subscribes to requests to mark as touched', function (this: TestContext) {
        setupTest(this, WithControl, TestControl3);
        expect(this.input.className).not.toContain('ng-touched');
        this.markControlService.markAsTouched();
        this.fixture.detectChanges();
        expect(this.input.className).toContain('ng-touched');
      });

      it('sets the control on ngControlService', function (this: TestContext) {
        spyOn(NgControlService.prototype, 'setControl').and.callThrough();
        setupTest(this, WithControl, TestControl3);
        expect(NgControlService.prototype.setControl).toHaveBeenCalled();
      });

      it('triggers status changes on blur', function (this: TestContext) {
        spyOn(IfControlStateService.prototype, 'triggerStatusChange').and.callThrough();
        setupTest(this, WithControl, TestControl3);
        this.input.focus();
        this.input.blur();
        this.fixture.detectChanges();
        expect(IfControlStateService.prototype.triggerStatusChange).toHaveBeenCalled();
      });

      it('blur marks the control as touched', function (this: TestContext) {
        setupTest(this, WithNumberControl, TestControl3);
        this.input.focus();
        this.input.blur();
        this.fixture.detectChanges();
        expect(this.input.className).toContain('ng-touched');
        expect(this.fixture.nativeElement.querySelector('#control2').className).toContain('ng-untouched');
      });

      it('implements ngOnDestroy', function (this: TestContext) {
        setupTest(this, WithControl, TestControl3);
        expect(this.control.ngOnDestroy).toBeDefined();
      });
    });

    describe('with dynamic controls', function () {
      it('with form-control directive', function (this: TestContext) {
        setupTest(this, WithDynamicFormControl, TestControl3);
        const cb = jasmine.createSpy('cb');
        const sub = this.ifControlStateService.statusChanges.subscribe((control: CONTROL_STATE) => cb(control));
        expect(cb).toHaveBeenCalledWith(CONTROL_STATE.NONE);
        this.fixture.componentInstance.addControl();
        this.fixture.detectChanges();
        expect(cb).toHaveBeenCalledWith(CONTROL_STATE.VALID);
        sub.unsubscribe();
      });

      it('with ng-control directive', function (this: TestContext) {
        setupTest(this, WithDynamicNgControl, TestControl3);
        const cb = jasmine.createSpy('cb');
        const sub = this.ifControlStateService.statusChanges.subscribe((control: CONTROL_STATE) => cb(control));
        expect(cb).toHaveBeenCalledWith(CONTROL_STATE.NONE);
        this.fixture.componentInstance.addControl();
        this.fixture.detectChanges();
        expect(cb).toHaveBeenCalledWith(CONTROL_STATE.VALID);
        sub.unsubscribe();
      });
    });

    describe('aria roles', function () {
      it('adds the aria-describedby for helper', function () {
        setupTest(this, WithControlAndHelper, TestControl3);
        this.ifControlStateService.triggerStatusChange(); // Manually trigger ngModel to sync which doesn't want to do because internal async
        expect(this.input.getAttribute('aria-describedby')).toContain('-helper');
      });

      it('does not set aria-describedby unless helper is present', function () {
        setupTest(this, WithControl, TestControl3);
        this.ifControlStateService.triggerStatusChange(); // Manually trigger ngModel to sync which doesn't want to do because internal async
        expect(this.input.getAttribute('aria-describedby')).toBe(null);
      });

      it('adds the aria-describedby with helper and error ids', fakeAsync(function (this: TestContext) {
        setupTest(this, WithControlAndError, TestControl3);
        this.input.focus();
        this.input.blur();
        this.fixture.detectChanges();
        tick();
        expect(this.input.getAttribute('aria-describedby')).toEqual(`${this.input.id}-helper ${this.input.id}-error`);
      }));

      it('adds the aria-describedby for error messages', fakeAsync(function (this: TestContext) {
        setupTest(this, WithControlAndError, TestControl3);
        this.input.focus();
        this.input.blur();
        this.fixture.detectChanges();
        tick();
        expect(this.input.getAttribute('aria-describedby')).toContain('-error');
      }));

      it('does not set aria-describedby unless error helper is present', function () {
        setupTest(this, WithControl, TestControl3);
        this.input.focus();
        this.input.blur();
        this.fixture.detectChanges();

        expect(this.input.getAttribute('aria-describedby')).toBe(null);
      });

      it('adds the aria-describedby for success messages', fakeAsync(function (this: TestContext) {
        setupTest(this, WithControlAndSuccess, TestControl3);
        this.input.focus();
        this.fixture.componentInstance.model = 'test';
        this.input.blur();
        this.fixture.detectChanges();
        tick();

        expect(this.input.getAttribute('aria-describedby')).toContain('-success');
      }));

      it('adds the aria-describedby with helper and success ids', fakeAsync(function (this: TestContext) {
        setupTest(this, WithControlAndSuccess, TestControl3);
        this.input.focus();
        this.fixture.componentInstance.model = 'test';
        this.input.blur();
        this.fixture.detectChanges();
        tick();

        expect(this.input.getAttribute('aria-describedby')).toEqual(`${this.input.id}-helper ${this.input.id}-success`);
      }));

      it('does not set aria-describedby unless success helper is present', fakeAsync(function () {
        setupTest(this, WithControl, TestControl3);
        this.input.focus();
        this.fixture.componentInstance.model = 'test';
        this.input.blur();
        this.fixture.detectChanges();
        tick();

        expect(this.input.getAttribute('aria-describedby')).toBe(null);
      }));
    });
  });
}
