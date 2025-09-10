/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrLoadingButton } from './loading-button';
import { ClrLoadingButtonModule } from './loading-button.module';
import { ClrLoadingState } from '../../utils/loading/loading';
import { ClrLoadingModule } from '../../utils/loading/loading.module';
import { delay } from '../../utils/testing/helpers.spec';

describe('Loading Buttons', () => {
  let fixture: ComponentFixture<TestLoadingButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrLoadingModule, ClrLoadingButtonModule, NoopAnimationsModule],
      declarations: [TestLoadingButtonComponent],
    });

    fixture = TestBed.createComponent(TestLoadingButtonComponent);

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('displays spinner when [(clrButtonState)] value is LOADING', () => {
    fixture.componentInstance.buttonState = ClrLoadingState.LOADING;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.spinner')).toBeTruthy();
  });

  it('sets the state back to DEFAULT when [(clrButtonState)] value is VALIDATED', async () => {
    fixture.componentInstance.buttonState = ClrLoadingState.SUCCESS;
    fixture.detectChanges();
    expect(fixture.componentInstance.buttonState as ClrLoadingState).toEqual(ClrLoadingState.SUCCESS);

    await delay(1000);
    fixture.detectChanges();
    expect(fixture.componentInstance.buttonState as ClrLoadingState).toEqual(ClrLoadingState.DEFAULT);
  });

  it('sets the disabled state back to value defined in disabled input', async () => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    fixture.componentInstance.buttonState = ClrLoadingState.LOADING;
    fixture.detectChanges();
    expect(fixture.componentInstance.buttonState as ClrLoadingState).toEqual(ClrLoadingState.LOADING);
    expect(fixture.componentInstance.loadingButtonInstance.el.nativeElement.disabled).toBeTruthy();

    fixture.componentInstance.buttonState = ClrLoadingState.SUCCESS;
    fixture.detectChanges();
    expect(fixture.componentInstance.buttonState as ClrLoadingState).toEqual(ClrLoadingState.SUCCESS);
    expect(fixture.componentInstance.loadingButtonInstance.el.nativeElement.disabled).toBeTruthy();

    await delay(1000);
    fixture.detectChanges();
    expect(fixture.componentInstance.buttonState as ClrLoadingState).toEqual(ClrLoadingState.DEFAULT);
    expect(fixture.componentInstance.loadingButtonInstance.el.nativeElement.disabled).toBeTruthy();

    // now the input binding sets the disabled to false
    // it should be disabled while loading, and success, but change back to not disabled when it goes back to DEFAULT
    fixture.componentInstance.disabled = false;
    fixture.detectChanges();

    fixture.componentInstance.buttonState = ClrLoadingState.LOADING;
    fixture.detectChanges();
    expect(fixture.componentInstance.buttonState as ClrLoadingState).toEqual(ClrLoadingState.LOADING);
    expect(fixture.componentInstance.loadingButtonInstance.el.nativeElement.disabled).toBeTruthy();

    fixture.componentInstance.buttonState = ClrLoadingState.SUCCESS;
    fixture.detectChanges();
    expect(fixture.componentInstance.buttonState as ClrLoadingState).toEqual(ClrLoadingState.SUCCESS);
    expect(fixture.componentInstance.loadingButtonInstance.el.nativeElement.disabled).toBeTruthy();

    await delay(1000);
    fixture.detectChanges();
    expect(fixture.componentInstance.buttonState as ClrLoadingState).toEqual(ClrLoadingState.DEFAULT);
    expect(fixture.componentInstance.loadingButtonInstance.el.nativeElement.disabled).toBeFalsy();
  });

  it('sets an explicit width value of the button when [(clrButtonState)] value is set to LOADING or SUCCESS', async () => {
    expect(fixture.componentInstance.loadingButtonInstance.el.nativeElement.style.length).toBe(0);

    fixture.componentInstance.buttonState = ClrLoadingState.LOADING;
    fixture.detectChanges();
    expect(fixture.componentInstance.loadingButtonInstance.el.nativeElement.style.width).toBeDefined();

    fixture.componentInstance.buttonState = ClrLoadingState.SUCCESS;
    fixture.detectChanges();
    expect(fixture.componentInstance.loadingButtonInstance.el.nativeElement.style.width).toBeDefined();

    await delay(1000);
    fixture.detectChanges();
    expect(fixture.componentInstance.buttonState as ClrLoadingState).toEqual(ClrLoadingState.DEFAULT);
    expect(fixture.componentInstance.loadingButtonInstance.el.nativeElement.style.length).toBe(0);
  });

  it('hides spinner when [(clrButtonState)] value is DEFAULT', () => {
    fixture.componentInstance.buttonState = ClrLoadingState.DEFAULT;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.spinner')).toBeFalsy();
  });

  it('has minimum width of 42px when loading', () => {
    fixture.componentInstance.buttonContent = '';
    fixture.detectChanges();
    fixture.componentInstance.buttonState = ClrLoadingState.LOADING;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button').offsetWidth).toBe(42);
  });
});

@Component({
  template: `<button [(clrLoading)]="buttonState" id="testBtn" [disabled]="disabled">{{ buttonContent }}</button>`,
  standalone: false,
})
class TestLoadingButtonComponent {
  @ViewChild(ClrLoadingButton) loadingButtonInstance: ClrLoadingButton;

  buttonState: ClrLoadingState = ClrLoadingState.DEFAULT;
  disabled = false;
  buttonContent = 'Test 1';
}
