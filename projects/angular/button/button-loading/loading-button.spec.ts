/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { delay, enableCssAnimations, finishAnimations } from '@clr/angular/testing';
import { ClrLoadingModule, ClrLoadingState } from '@clr/angular/utils';

import { ClrLoadingButton } from './loading-button';
import { ClrLoadingButtonModule } from './loading-button.module';

describe('Loading Buttons', () => {
  let fixture: ComponentFixture<TestLoadingButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrLoadingModule, ClrLoadingButtonModule],
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

  it('returns to the DEFAULT state inside an OnPush host without any external change detection', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ClrLoadingModule, ClrLoadingButtonModule],
      declarations: [OnPushTestLoadingButtonComponent],
    });
    const onPushFixture = TestBed.createComponent(OnPushTestLoadingButtonComponent);
    onPushFixture.detectChanges();

    onPushFixture.componentInstance.buttonState = ClrLoadingState.SUCCESS;
    onPushFixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
    onPushFixture.detectChanges();
    expect(onPushFixture.nativeElement.querySelector('.spinner-check')).toBeTruthy();

    await delay();
    onPushFixture.detectChanges();
    expect(onPushFixture.nativeElement.querySelector('.spinner-check')).toBeNull();
    expect(onPushFixture.nativeElement.querySelector('.clr-loading-btn-content')).toBeTruthy();
    onPushFixture.destroy();
  });

  it('has minimum width of 42px when loading', () => {
    fixture.componentInstance.buttonContent = '';
    fixture.detectChanges();
    fixture.componentInstance.buttonState = ClrLoadingState.LOADING;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button').offsetWidth).toBe(42);
  });
});

describe('Loading Buttons with animations', () => {
  let fixture: ComponentFixture<TestLoadingButtonComponent>;
  let restoreAnimations: () => void;

  beforeEach(async () => {
    restoreAnimations = enableCssAnimations();
    TestBed.configureTestingModule({
      imports: [ClrLoadingModule, ClrLoadingButtonModule],
      declarations: [TestLoadingButtonComponent],
      animationsEnabled: true,
    });
    fixture = TestBed.createComponent(TestLoadingButtonComponent);
    fixture.detectChanges();
    await delay(); // the initial render is not animated
  });

  afterEach(() => {
    fixture.destroy();
    restoreAnimations();
  });

  function animationNames(element: Element): string[] {
    return element.getAnimations().map(animation => (animation as CSSAnimation).animationName);
  }

  it('keeps the spinner rotating while it fades in', async () => {
    fixture.componentInstance.buttonState = ClrLoadingState.LOADING;
    fixture.detectChanges();
    await delay();

    const spinner = fixture.nativeElement.querySelector('.spinner');
    expect(spinner.classList).toContain('clr-loading-btn-enter');
    expect(animationNames(spinner)).toEqual(['clr-fade-in', 'spin']);
  });

  it('goes back to its default state once the check mark animation is done', async () => {
    fixture.componentInstance.buttonState = ClrLoadingState.SUCCESS;
    fixture.detectChanges();

    const check = fixture.nativeElement.querySelector('.spinner-check');
    expect(animationNames(check)).toEqual(['clr-loading-btn-check']);
    await delay();
    expect(fixture.componentInstance.buttonState).toBe(ClrLoadingState.SUCCESS);

    finishAnimations(check);
    await delay();
    fixture.detectChanges();
    expect(fixture.componentInstance.buttonState as ClrLoadingState).toBe(ClrLoadingState.DEFAULT);
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

@Component({
  template: `<button [clrLoading]="buttonState">Test</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class OnPushTestLoadingButtonComponent {
  buttonState: ClrLoadingState = ClrLoadingState.DEFAULT;
}
