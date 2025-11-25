/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AnimationEvent } from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CdkTrapFocusModule, CdkTrapFocusModule_CdkTrapFocus } from '@clr/angular/src/utils';
import { delay, expectActiveElementToBe } from '@clr/angular/testing';

import { ClrModal } from './modal';
import { ClrModalModule } from './modal.module';

@Component({
  template: `
    <button class="btn to-focus"></button>
    <clr-modal
      [(clrModalOpen)]="opened"
      [clrModalClosable]="closable"
      [clrModalCloseButtonAriaLabel]="closeButtonAriaLabel"
      [clrModalSize]="size"
      [clrModalStaticBackdrop]="staticBackdrop"
    >
      <h4 class="modal-title">Title</h4>
      <div class="modal-body">
        <p>Body</p>
      </div>
      <div class="modal-footer">
        <button class="btn" (click)="opened = false">Footer</button>
      </div>
    </clr-modal>
  `,
  standalone: false,
})
class TestComponent {
  @ViewChild(ClrModal) modalInstance: ClrModal;

  opened = true;
  closable = true;
  closeButtonAriaLabel: string = undefined;
  size = '';
  staticBackdrop = false;
}

@Component({
  template: `
    <clr-modal [(clrModalOpen)]="opened">
      <h4 class="modal-title">Title</h4>
      <div class="modal-body">
        <p>Body</p>
      </div>
      <div class="modal-footer">
        <button (click)="opened = false">Footer</button>
      </div>
    </clr-modal>
  `,
  standalone: false,
})
class TestDefaultsComponent {
  opened = true;
}

describe('Modal', () => {
  let fixture: ComponentFixture<TestComponent>;
  let compiled: HTMLElement;
  let modal: ClrModal;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CdkTrapFocusModule, ClrModalModule, NoopAnimationsModule],
      declarations: [TestComponent, TestDefaultsComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    modal = fixture.componentInstance.modalInstance;

    await fixture.whenStable();
  });

  async function flushAndExpectOpen(componentFixture: ComponentFixture<any>, open: boolean) {
    componentFixture.detectChanges();
    await delay();

    const text: string = componentFixture.nativeElement.textContent.trim();
    if (open) {
      expect(text).not.toBe('');
    } else {
      expect(text).toBe('');
    }
  }

  it('projects content', async () => {
    expect(compiled.textContent).toMatch(/Title/);
    expect(compiled.textContent).toMatch(/Body/);
    expect(compiled.textContent).toMatch(/Footer/);
  });

  it('should set aria-hidden attribute to false if opened', async () => {
    fixture.componentInstance.opened = false;
    fixture.detectChanges();
    expect(compiled.querySelector('.modal-dialog')).toBeNull();
    // open modal
    modal.open();
    fixture.detectChanges();
    expect(compiled.querySelector('.modal-dialog').getAttribute('aria-hidden')).toBe('false');
  });

  it('shows and hides the modal based on the clrModalOpen input', async () => {
    fixture.componentInstance.opened = false;
    await flushAndExpectOpen(fixture, false);

    fixture.componentInstance.opened = true;
    await flushAndExpectOpen(fixture, true);
  });

  it('exposes open() and close() methods', async () => {
    modal.close();
    await flushAndExpectOpen(fixture, false);

    modal.open();
    await flushAndExpectOpen(fixture, true);
  });

  it('should not open if already opened', async () => {
    spyOn(modal._openChanged, 'emit');
    modal.open();
    expect(modal._openChanged.emit).not.toHaveBeenCalled();
  });

  it('should not emit clrModalOpenChange - animation will do that for us', async () => {
    /**
     * Needed just to mock the event so I could enter the `if` statement.
     */
    const fakeAnimationEvent: AnimationEvent = {
      fromState: '',
      toState: 'void',
      totalTime: 0,
      phaseName: '',
      element: {},
      triggerName: '',
      disabled: false,
    };

    spyOn(modal._openChanged, 'emit');
    modal.close();
    modal.fadeDone(fakeAnimationEvent);
    expect(modal._openChanged.emit).toHaveBeenCalledTimes(1);
  });

  it('should not close when already closed', async () => {
    fixture.componentInstance.opened = false;
    spyOn(modal, 'close');
    expect(modal.close).not.toHaveBeenCalled();
  });

  it('should not throw an error when close is called on an already closed modal', async () => {
    // Close the test modal
    fixture.componentInstance.modalInstance.close();
    fixture.detectChanges();
    // App should not throw an error when already closed.
    expect(() => {
      fixture.componentInstance.modalInstance.close();
      fixture.detectChanges();
    }).not.toThrow();
  });

  it('offers two-way binding on clrModalOpen', async () => {
    expect(fixture.componentInstance.opened).toBe(true);
    modal.close();
    fixture.detectChanges();

    // We make sure to wait for the animation to be over before emitting the output

    // todo: uncomment this after animation bug is fixed https://github.com/angular/angular/issues/15798
    // expect(fixture.componentInstance.opened).toBe(true);
    await delay();
    expect(fixture.componentInstance.opened).toBe(false);
  });

  it('focuses on the title when opened', async () => {
    expectActiveElementToBe(fixture.nativeElement.querySelector('.modal-title-wrapper'));
  });

  it('supports a clrModalSize option', async () => {
    expect(compiled.querySelector('.modal-sm')).toBeNull();
    expect(compiled.querySelector('.modal-lg')).toBeNull();

    fixture.componentInstance.size = 'sm';
    fixture.detectChanges();

    expect(compiled.querySelector('.modal-sm')).not.toBeNull();
    expect(compiled.querySelector('.modal-lg')).toBeNull();

    fixture.componentInstance.size = 'lg';
    fixture.detectChanges();

    expect(compiled.querySelector('.modal-sm')).toBeNull();
    expect(compiled.querySelector('.modal-lg')).not.toBeNull();

    fixture.componentInstance.size = 'full-screen';
    fixture.detectChanges();

    expect(compiled.querySelector('.modal-lg')).toBeNull();
    expect(compiled.querySelector('.modal-full-screen')).not.toBeNull();
  });

  it('supports a clrModalClosable option', async () => {
    fixture.componentInstance.closable = false;
    fixture.detectChanges();

    expect(compiled.querySelector('.close')).toBeNull();

    modal.close();
    await flushAndExpectOpen(fixture, true);

    fixture.componentInstance.closable = true;
    fixture.detectChanges();

    expect(compiled.querySelector('.close')).not.toBeNull();
    modal.close();
    fixture.detectChanges();

    await flushAndExpectOpen(fixture, false);
  });

  it('should not be closed on backdrop click by default', async () => {
    const defaultsFixture = TestBed.createComponent(TestDefaultsComponent);
    defaultsFixture.detectChanges();
    compiled = defaultsFixture.nativeElement;

    const backdrop: HTMLElement = compiled.querySelector('.modal-backdrop');

    backdrop.click();
    await flushAndExpectOpen(defaultsFixture, true);
    defaultsFixture.destroy();
  });

  it('supports a clrModalStaticBackdrop option', async () => {
    const backdrop: HTMLElement = compiled.querySelector('.modal-backdrop');

    fixture.componentInstance.staticBackdrop = true;
    fixture.detectChanges();

    // Just make sure we have the "x" to close the modal,
    // because this is different from the clrModalClosable option.
    expect(compiled.querySelector('.close')).not.toBeNull();

    backdrop.click();
    await flushAndExpectOpen(fixture, true);

    fixture.componentInstance.staticBackdrop = false;
    fixture.detectChanges();

    backdrop.click();
    await flushAndExpectOpen(fixture, false);
  });

  it('focus trap remain active after clicking on backdrop', async () => {
    const backdrop: HTMLElement = compiled.querySelector('div.modal-backdrop');
    const titleWrapperElement: HTMLElement = compiled.querySelector('div.modal-title-wrapper');
    const focusStealButton: HTMLElement = compiled.querySelector('button.btn.to-focus');

    fixture.componentInstance.staticBackdrop = true;
    fixture.detectChanges();

    // Just make sure we have the "x" to close the modal,
    // because this is different from the clrModalClosable option.
    expect(compiled.querySelector('.close')).not.toBeNull();
    expectActiveElementToBe(titleWrapperElement);

    focusStealButton.focus();
    expectActiveElementToBe(focusStealButton);

    backdrop.click();
    await flushAndExpectOpen(fixture, true);
    expectActiveElementToBe(titleWrapperElement);
  });

  it('traps user focus', () => {
    fixture.detectChanges();
    const focusTrap = fixture.debugElement.query(By.directive(CdkTrapFocusModule_CdkTrapFocus));

    expect(focusTrap).toBeTruthy();
  });

  it('close button should have default aria-label', () => {
    expect(compiled.querySelector('.close').getAttribute('aria-label')).toBe('Close');
  });

  it('close button should have customizable aria-label', () => {
    fixture.componentInstance.closeButtonAriaLabel = 'custom close label';
    fixture.detectChanges();

    expect(compiled.querySelector('.close').getAttribute('aria-label')).toBe('custom close label');
  });

  it('should use modal id for aria-labelledby by default', () => {
    modal.open();
    fixture.detectChanges();

    expect(compiled.querySelector('.modal-dialog').getAttribute('aria-labelledby')).toBe(modal.modalId);
  });

  it('should allow a custom aria-labelledby attribute value', () => {
    modal.labelledBy = 'custom-id';

    modal.open();
    fixture.detectChanges();

    expect(compiled.querySelector('.modal-dialog').getAttribute('aria-labelledby')).toBe('custom-id');
  });

  it('should fall back to the modal id for the aria-labelledby attribute value', () => {
    // set to a falsy value
    modal.labelledBy = '';

    modal.open();
    fixture.detectChanges();

    expect(compiled.querySelector('.modal-dialog').getAttribute('aria-labelledby')).toBe(modal.modalId);
  });

  it('should have text based boundaries for screen readers', async () => {
    // MacOS + Voice Over does not properly isolate modal content so
    // we must give screen reader users text based warnings when they
    // are entering and leaving modal content.
    modal.open();
    fixture.detectChanges();
    const messages = compiled.querySelectorAll<HTMLElement>('.clr-sr-only');
    expect(messages[0].innerText).toBe('Beginning of Modal Content');
    expect(messages[1].innerText).toBe('End of Modal Content');
  });

  it('renders the title before the close button', async () => {
    const modalHeader = compiled.querySelector('.modal-header--accessible');
    expect(modalHeader.children.length).toBeGreaterThanOrEqual(2);

    const maybeTitleWrapper = modalHeader.children[0];
    const maybleCloseButton = modalHeader.children[1];
    expect(maybeTitleWrapper.classList.contains('modal-title-wrapper')).toBeTrue();
    expect(maybleCloseButton.classList.contains('close')).toBeTrue();
  });
});
