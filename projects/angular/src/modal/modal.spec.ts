/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AnimationEvent } from '@angular/animations';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { FocusTrapDirective } from '../utils/focus-trap/focus-trap.directive';
import { ClrFocusTrapModule } from '../utils/focus-trap/focus-trap.module';
import { ClrCommonStringsService } from '../utils/i18n/common-strings.service';
import { ClrModal } from './modal';
import { ClrModalModule } from './modal.module';

@Component({
  template: `
    <button #button></button>

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
        <button (click)="opened = false">Footer</button>
      </div>
    </clr-modal>
  `,
})
class TestComponent {
  @ViewChild('button') button: ElementRef<HTMLButtonElement>;
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
})
class TestDefaultsComponent {
  opened = true;
}

describe('Modal', () => {
  let fixture: ComponentFixture<TestComponent>;
  let compiled: HTMLElement;
  let modal: ClrModal;
  const commonStrings = new ClrCommonStringsService();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrModalModule, NoopAnimationsModule, ClrFocusTrapModule],
      declarations: [TestComponent, TestDefaultsComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    modal = fixture.componentInstance.modalInstance;
  });

  function flushAndExpectOpen(componentFixture: ComponentFixture<any>, open: boolean): void {
    componentFixture.detectChanges();
    tick();

    const text: string = componentFixture.nativeElement.textContent.trim();
    if (open) {
      expect(text).not.toBe('');
    } else {
      expect(text).toBe('');
    }
  }

  it('projects content', fakeAsync(() => {
    expect(compiled.textContent).toMatch(/Title/);
    expect(compiled.textContent).toMatch(/Body/);
    expect(compiled.textContent).toMatch(/Footer/);
  }));

  it('should set aria-hidden attribute to false if opened', fakeAsync(() => {
    fixture.componentInstance.opened = false;
    fixture.detectChanges();
    expect(compiled.querySelector('.modal-dialog')).toBeNull();
    // open modal
    modal.open();
    fixture.detectChanges();
    expect(compiled.querySelector('.modal-dialog').getAttribute('aria-hidden')).toBe('false');
  }));

  it('shows and hides the modal based on the clrModalOpen input', fakeAsync(() => {
    fixture.componentInstance.opened = false;
    flushAndExpectOpen(fixture, false);

    fixture.componentInstance.opened = true;
    flushAndExpectOpen(fixture, true);
  }));

  it('exposes open() and close() methods', fakeAsync(() => {
    modal.close();
    flushAndExpectOpen(fixture, false);

    modal.open();
    flushAndExpectOpen(fixture, true);
  }));

  it('should not open if already opened', fakeAsync(() => {
    spyOn(modal._openChanged, 'emit');
    modal.open();
    expect(modal._openChanged.emit).not.toHaveBeenCalled();
  }));

  it('should not emit clrModalOpenChange - animation will do that for us', fakeAsync(() => {
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
  }));

  it('should not close when already closed', fakeAsync(() => {
    fixture.componentInstance.opened = false;
    spyOn(modal, 'close');
    expect(modal.close).not.toHaveBeenCalled();
  }));

  it('should not throw an error when close is called on an already closed modal', fakeAsync(() => {
    // Close the test modal
    fixture.componentInstance.modalInstance.close();
    fixture.detectChanges();
    // App should not throw an error when already closed.
    expect(() => {
      fixture.componentInstance.modalInstance.close();
      fixture.detectChanges();
    }).not.toThrow();
  }));

  it('offers two-way binding on clrModalOpen', fakeAsync(() => {
    expect(fixture.componentInstance.opened).toBe(true);
    modal.close();
    fixture.detectChanges();

    // We make sure to wait for the animation to be over before emitting the output

    // todo: uncomment this after animation bug is fixed https://github.com/angular/angular/issues/15798
    // expect(fixture.componentInstance.opened).toBe(true);
    tick();
    expect(fixture.componentInstance.opened).toBe(false);
  }));

  it('focuses on the title when opened', fakeAsync(() => {
    expect(document.activeElement).toEqual(fixture.nativeElement.querySelector('.modal-title-wrapper'));
  }));

  it('restores focus the previously-focused element when closed', () => {
    fixture.componentInstance.opened = false;
    fixture.detectChanges();

    fixture.componentInstance.button.nativeElement.focus();
    fixture.detectChanges();

    fixture.componentInstance.opened = true;
    fixture.detectChanges();

    fixture.componentInstance.opened = false;
    fixture.detectChanges();

    expect(document.activeElement).toEqual(fixture.componentInstance.button.nativeElement);
  });

  it('supports a clrModalSize option', fakeAsync(() => {
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
  }));

  it('supports a clrModalClosable option', fakeAsync(() => {
    fixture.componentInstance.closable = false;
    fixture.detectChanges();

    expect(compiled.querySelector('.close')).toBeNull();

    modal.close();
    flushAndExpectOpen(fixture, true);

    fixture.componentInstance.closable = true;
    fixture.detectChanges();

    expect(compiled.querySelector('.close')).not.toBeNull();
    modal.close();
    fixture.detectChanges();

    flushAndExpectOpen(fixture, false);
  }));

  it('should not be closed on backdrop click by default', fakeAsync(() => {
    const defaultsFixture = TestBed.createComponent(TestDefaultsComponent);
    defaultsFixture.detectChanges();
    compiled = defaultsFixture.nativeElement;

    const backdrop: HTMLElement = compiled.querySelector('.modal-backdrop');

    backdrop.click();
    flushAndExpectOpen(defaultsFixture, true);
    defaultsFixture.destroy();
  }));

  it('supports a clrModalStaticBackdrop option', fakeAsync(() => {
    const backdrop: HTMLElement = compiled.querySelector('.modal-backdrop');

    fixture.componentInstance.staticBackdrop = true;
    fixture.detectChanges();

    // Just make sure we have the "x" to close the modal,
    // because this is different from the clrModalClosable option.
    expect(compiled.querySelector('.close')).not.toBeNull();

    backdrop.click();
    flushAndExpectOpen(fixture, true);

    fixture.componentInstance.staticBackdrop = false;
    fixture.detectChanges();

    backdrop.click();
    flushAndExpectOpen(fixture, false);
  }));

  it('traps user focus', () => {
    fixture.detectChanges();
    const focusable = fixture.debugElement.query(By.directive(FocusTrapDirective));

    expect(focusable).toBeDefined();
  });

  it('close button should have default aria-label', () => {
    expect(compiled.querySelector('.close').getAttribute('aria-label')).toBe(commonStrings.keys.close);
  });

  it('close button should have customizable aria-label', () => {
    fixture.componentInstance.closeButtonAriaLabel = 'custom close label';
    fixture.detectChanges();

    expect(compiled.querySelector('.close').getAttribute('aria-label')).toBe('custom close label');
  });

  it('should add expected aria-labelledby', () => {
    // open modal
    modal.open();
    fixture.detectChanges();
    expect(compiled.querySelector('.modal-dialog').getAttribute('aria-labelledby')).toBe(modal.modalId);
  });

  it('should have text based boundaries for screen readers', fakeAsync(() => {
    // MacOS + Voice Over does not properly isolate modal content so
    // we must give screen reader users text based warnings when they
    // are entering and leaving modal content.
    modal.open();
    fixture.detectChanges();
    const messages = compiled.querySelectorAll<HTMLElement>('.clr-sr-only');
    expect(messages[0].innerText).toBe('Beginning of Modal Content');
    expect(messages[1].innerText).toBe('End of Modal Content');
  }));

  it('renders the title before the close button', fakeAsync(() => {
    const modalHeader = compiled.querySelector('.modal-header--accessible');
    expect(modalHeader.children.length).toBeGreaterThanOrEqual(2);

    const maybeTitleWrapper = modalHeader.children[0];
    const maybleCloseButton = modalHeader.children[1];
    expect(maybeTitleWrapper.classList.contains('modal-title-wrapper')).toBeTrue();
    expect(maybleCloseButton.classList.contains('close')).toBeTrue();
  }));
});
