/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { delay, enableCssAnimations, expectActiveElementToBe, finishAnimations } from '@clr/angular/testing';
import { CdkTrapFocusModule, CdkTrapFocusModule_CdkTrapFocus } from '@clr/angular/utils';

import { ClrModal } from './modal';
import { ModalStackService } from './modal-stack.service';
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
      imports: [CdkTrapFocusModule, ClrModalModule],
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
    await fixture.whenStable(); // Angular removes the modal once its (disabled) leave animation is done
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

  it('emits clrModalOpenChange only once when the two-way binding propagates the closing', async () => {
    // Mimics an application: close() runs from an event handler, the notification microtask updates the
    // two-way bound property and only then does change detection see the input flip to false.
    spyOn(modal._openChanged, 'emit').and.callThrough();
    modal.close();
    await delay();
    expect(fixture.componentInstance.opened).toBe(false);

    fixture.detectChanges();
    await delay();
    expect(modal._openChanged.emit).toHaveBeenCalledOnceWith(false);
  });

  it('stops tracking the modal in the modal stack when destroyed while open', () => {
    const modalStackService = TestBed.inject(ModalStackService);
    spyOn(modalStackService, 'trackModalClose');
    fixture.destroy();
    expect(modalStackService.trackModalClose).toHaveBeenCalledWith(modal);
  });

  it('emits clrModalOpenChange once the modal has been removed after closing', async () => {
    spyOn(modal._openChanged, 'emit');
    modal.close();
    expect(modal._openChanged.emit).not.toHaveBeenCalled();

    fixture.detectChanges();
    await delay();
    expect(modal._openChanged.emit).toHaveBeenCalledOnceWith(false);
    expect(fixture.nativeElement.querySelector('.modal-dialog')).toBeNull();
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

  it('static backdrop has pointer-events none and focus trap remains active', async () => {
    fixture.componentInstance.staticBackdrop = true;
    fixture.detectChanges();

    const backdrop: HTMLElement = compiled.querySelector('div.modal-backdrop');
    const modalDialog: HTMLElement = compiled.querySelector('.modal-dialog');

    expect(backdrop.classList.contains('static')).toBeTrue();

    backdrop.click();
    fixture.detectChanges();
    await fixture.whenStable();

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(modalDialog.contains(document.activeElement)).toBeTrue();
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

describe('Modal with animations', () => {
  let fixture: ComponentFixture<TestComponent>;
  let modal: ClrModal;
  let openChanges: boolean[];
  let restoreAnimations: () => void;

  beforeEach(() => {
    restoreAnimations = enableCssAnimations();
    TestBed.configureTestingModule({
      imports: [CdkTrapFocusModule, ClrModalModule],
      declarations: [TestComponent],
      animationsEnabled: true,
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    modal = fixture.componentInstance.modalInstance;
    openChanges = [];
    modal._openChanged.subscribe((open: boolean) => openChanges.push(open));
  });

  afterEach(() => {
    fixture.destroy();
    restoreAnimations();
  });

  function modalElement(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.modal');
  }

  async function finishClosing() {
    finishAnimations(fixture.nativeElement);
    // The `animationend` events of the finished animations, which complete the leave animation, are dispatched with
    // the next frame.
    await new Promise(resolve => requestAnimationFrame(resolve));
    await delay();
  }

  it('stays rendered while it animates out, and notifies the closing right away', async () => {
    modal.close();
    fixture.detectChanges();

    expect(modalElement()).not.toBeNull();
    expect(modalElement().classList).toContain('clr-modal-leave');
    expect(modalElement().classList).toContain('clr-modal-leave-down');
    await delay();
    expect(openChanges).toEqual([false]);

    await finishClosing();

    expect(modalElement()).toBeNull();
    expect(fixture.componentInstance.opened).toBeFalse();
  });

  it('can be opened again while it animates out', async () => {
    modal.close();
    fixture.detectChanges();
    modal.open();
    fixture.detectChanges();

    // The leaving modal stays until its animation is done; the reopened one is a new modal.
    const reopened = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.modal')).filter(
      element => !element.classList.contains('clr-modal-leave')
    );
    expect(reopened.length).toBe(1);

    await finishClosing();

    expect(fixture.nativeElement.querySelectorAll('.modal').length).toBe(1);
    expect(openChanges).toEqual([true]);
  });

  it('notifies the closing once when closed, opened and closed again while it animates out', async () => {
    modal.close();
    fixture.detectChanges();
    modal.open();
    fixture.detectChanges();
    modal.close();
    fixture.detectChanges();

    await finishClosing();

    expect(modalElement()).toBeNull();
    expect(openChanges).toEqual([true, false]);
  });

  it('gives the focus back as soon as it starts closing', async () => {
    modal.close();
    fixture.detectChanges();
    await finishClosing();

    const opener: HTMLButtonElement = fixture.nativeElement.querySelector('.to-focus');
    opener.focus();
    modal.open();
    fixture.detectChanges();
    await finishClosing();
    expect(document.activeElement).not.toBe(opener);

    modal.close();
    fixture.detectChanges();

    expect(modalElement()).not.toBeNull();
    expect(document.activeElement).toBe(opener);
    await finishClosing();
  });

  it('gives the focus back once, when it starts closing', async () => {
    modal.close();
    fixture.detectChanges();
    await finishClosing();

    const opener: HTMLButtonElement = fixture.nativeElement.querySelector('.to-focus');
    opener.focus();
    modal.open();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.modal-dialog').contains(document.activeElement)).toBeTrue();

    modal.close();
    fixture.detectChanges();
    const elsewhere = document.createElement('button');
    document.body.appendChild(elsewhere);
    elsewhere.focus();
    await finishClosing();

    expect(modalElement()).toBeNull();
    expect(document.activeElement).toBe(elsewhere);
    elsewhere.remove();
  });

  it('gives the focus back when destroyed while open', async () => {
    modal.close();
    fixture.detectChanges();
    await finishClosing();

    const outside = document.createElement('button');
    document.body.appendChild(outside);
    outside.focus();
    modal.open();
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.destroy();

    expect(document.activeElement).toBe(outside);
    outside.remove();
  });

  it('does not notify the closing from its destruction', () => {
    fixture.destroy();

    expect(openChanges).toEqual([]);
  });

  it('does not notify the closing from its destruction while it animates out', () => {
    modal.close();
    fixture.detectChanges();
    fixture.destroy();

    expect(openChanges).toEqual([]);
  });
});

@Component({
  template: `
    <clr-modal [(clrModalOpen)]="firstOpened">
      <h4 class="modal-title">First</h4>
      <div class="modal-body"></div>
    </clr-modal>
    <clr-modal [(clrModalOpen)]="secondOpened">
      <h4 class="modal-title">Second</h4>
      <div class="modal-body"></div>
    </clr-modal>
  `,
  standalone: false,
})
class TwoModalsTestComponent {
  firstOpened = true;
  secondOpened = false;
}

describe('Modal closing while another modal opens', () => {
  let restoreAnimations: () => void;

  beforeEach(() => {
    restoreAnimations = enableCssAnimations();
    TestBed.configureTestingModule({
      imports: [CdkTrapFocusModule, ClrModalModule],
      declarations: [TwoModalsTestComponent],
      animationsEnabled: true,
    });
  });

  afterEach(() => {
    restoreAnimations();
  });

  // Angular 21 cuts the leave animation of the first modal short, as the second one renders the same template node;
  // Angular 22 lets it play.
  it('notifies the closing whether or not Angular cuts its leave animation short', async () => {
    const fixture = TestBed.createComponent(TwoModalsTestComponent);
    fixture.detectChanges();
    const [first] = fixture.debugElement.queryAll(By.directive(ClrModal)).map(debug => debug.componentInstance);
    const openChanges: boolean[] = [];
    first._openChanged.subscribe((open: boolean) => openChanges.push(open));

    first.close();
    fixture.detectChanges();
    fixture.componentInstance.secondOpened = true;
    fixture.detectChanges();
    await delay();
    finishAnimations(fixture.nativeElement);
    await new Promise(resolve => requestAnimationFrame(resolve));
    await delay();

    expect(fixture.nativeElement.querySelectorAll('.modal').length).toBe(1);
    expect(openChanges).toEqual([false]);
    fixture.destroy();
  });
});
