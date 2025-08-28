/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CdkTrapFocusModule, CdkTrapFocusModule_CdkTrapFocus } from '../utils/cdk/cdk-trap-focus.module';
import { expectActiveElementToBe } from '../utils/testing/helpers.spec';
import { ClrSidePanel } from './side-panel';
import { ClrSidePanelModule } from './side-panel.module';

@Component({
  template: `
    <clr-side-panel
      [(clrSidePanelOpen)]="opened"
      [clrSidePanelClosable]="closable"
      [clrSidePanelCloseButtonAriaLabel]="closeButtonAriaLabel"
      [clrSidePanelSize]="size"
    >
      <h4 class="side-panel-title">Title</h4>
      <div class="side-panel-body">
        <p>Body</p>
      </div>
      <div class="side-panel-footer">
        <button (click)="opened = false">Footer</button>
      </div>
    </clr-side-panel>
  `,
  standalone: false,
})
class TestComponent {
  @ViewChild(ClrSidePanel) sidePanelInstance: ClrSidePanel;

  opened = true;
  closable = true;
  closeButtonAriaLabel: string = undefined;
  size = '';
}

@Component({
  template: `
    <clr-side-panel [(clrSidePanelOpen)]="opened">
      <h4 class="side-panel-title">Title</h4>
      <div class="side-panel-body">
        <p>Body</p>
      </div>
      <div class="side-panel-footer">
        <button (click)="opened = false">Footer</button>
      </div>
    </clr-side-panel>
  `,
  standalone: false,
})
class TestDefaultsComponent {
  opened = true;
}

describe('Side Panel', () => {
  let fixture: ComponentFixture<TestComponent>;
  let compiled: HTMLElement;
  let sidePanel: ClrSidePanel;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CdkTrapFocusModule, ClrSidePanelModule, NoopAnimationsModule],
      declarations: [TestComponent, TestDefaultsComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    sidePanel = fixture.componentInstance.sidePanelInstance;

    await fixture.whenStable();
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
    sidePanel.open();
    fixture.detectChanges();
    expect(compiled.querySelector('.modal-dialog').getAttribute('aria-hidden')).toBe('false');
  }));

  it('shows and hides the side panel based on the clrSidePanelOpen input', fakeAsync(() => {
    fixture.componentInstance.opened = false;
    flushAndExpectOpen(fixture, false);

    fixture.componentInstance.opened = true;
    flushAndExpectOpen(fixture, true);
  }));

  it('exposes open() and close() methods', fakeAsync(() => {
    sidePanel.close();
    flushAndExpectOpen(fixture, false);

    sidePanel.open();
    flushAndExpectOpen(fixture, true);
  }));

  it('should not open if already opened', fakeAsync(() => {
    spyOn(sidePanel.openChange, 'emit');
    sidePanel.open();
    expect(sidePanel.openChange.emit).not.toHaveBeenCalled();
  }));

  it('should not close when already closed', fakeAsync(() => {
    fixture.componentInstance.opened = false;
    spyOn(sidePanel, 'close');
    expect(sidePanel.close).not.toHaveBeenCalled();
  }));

  it('should not throw an error when close is called on an already closed side panel', fakeAsync(() => {
    // Close the test side panel
    fixture.componentInstance.sidePanelInstance.close();
    fixture.detectChanges();
    // App should not throw an error when already closed.
    expect(() => {
      fixture.componentInstance.sidePanelInstance.close();
      fixture.detectChanges();
    }).not.toThrow();
  }));

  it('offers two-way binding on clrSidePanelOpen', fakeAsync(() => {
    expect(fixture.componentInstance.opened).toBe(true);
    sidePanel.close();
    fixture.detectChanges();

    // We make sure to wait for the animation to be over before emitting the output

    // todo: uncomment this after animation bug is fixed https://github.com/angular/angular/issues/15798
    // expect(fixture.componentInstance.opened).toBe(true);
    tick();
    expect(fixture.componentInstance.opened).toBe(false);
  }));

  it('focuses on the title when opened', fakeAsync(() => {
    expectActiveElementToBe(fixture.nativeElement.querySelector('.modal-title-wrapper'));
  }));

  it('supports a clrSidePanelSize option', fakeAsync(() => {
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
  }));

  it('should be closed on backdrop click by default', fakeAsync(() => {
    const defaultsFixture = TestBed.createComponent(TestDefaultsComponent);
    defaultsFixture.detectChanges();
    compiled = defaultsFixture.nativeElement;

    const backdrop: HTMLElement = compiled.querySelector('.modal-backdrop');

    backdrop.click();
    flushAndExpectOpen(defaultsFixture, false);
    defaultsFixture.destroy();
  }));

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

  it('should add expected aria-labelledby', () => {
    // open side panel
    sidePanel.open();
    fixture.detectChanges();
    expect(compiled.querySelector('.modal-dialog').getAttribute('aria-labelledby')).toBeTruthy();
  });

  it('should have text based boundaries for screen readers', fakeAsync(() => {
    // MacOS + Voice Over does not properly isolate side panel content so
    // we must give screen reader users text based warnings when they
    // are entering and leaving side panel content.
    sidePanel.open();
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
