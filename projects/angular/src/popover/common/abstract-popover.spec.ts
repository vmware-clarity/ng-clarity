/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, ElementRef, Injector, Optional, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AbstractPopover } from './abstract-popover';
import { POPOVER_HOST_ANCHOR } from './popover-host-anchor.token';
import { ClrPopoverService } from './providers/popover.service';
import { ClrConditionalModule } from '../../utils';

@Component({
  selector: 'test-popover',
  template: `<div class="test-popover">Popover</div>`,
  standalone: false,
})
class TestPopover extends AbstractPopover {
  closeOnOutsideClick = true;

  constructor(injector: Injector, @Optional() parent: ElementRef<HTMLElement>) {
    super(injector, parent);
  }
}

@Component({
  template: `<test-popover *clrIfOpen></test-popover>`,
  standalone: false,
})
class TestPopoverWithIfOpenDirective {
  @ViewChild(TestPopover) testPopover: TestPopover;
}

@Component({
  template: `
    <input type="text" #ignoreInput (focus)="onFocus($event)" />
    <test-popover-ignore #ignoreElement *clrIfOpen></test-popover-ignore>
  `,
  providers: [ClrPopoverService, { provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef }],
  standalone: false,
})
class InputFocusPopover {
  @ViewChild('ignoreInput') ignore: ElementRef<HTMLInputElement>;
  @ViewChild('ignoreElement') popover: any; // cant use TestPopoverIgnoreElement as type since it will refer to class before declaration in es2015+

  constructor(private popoverService: ClrPopoverService) {}

  onFocus(event: FocusEvent) {
    this.popoverService.toggleWithEvent(event);
  }
}

@Component({
  selector: 'test-popover-ignore',
  template: `<div class="test-popover">Popover</div>`,
  standalone: false,
})
class TestPopoverIgnoreElement extends AbstractPopover {
  constructor(injector: Injector, @Optional() parent: ElementRef<HTMLElement>, parentHost: InputFocusPopover) {
    super(injector, parent);
    if (parentHost && parentHost.ignore) {
      this.ignoredElement = parentHost.ignore.nativeElement;
    }
  }
}

describe('Abstract Popover', function () {
  let fixture: ComponentFixture<any>;
  let popoverService: ClrPopoverService;
  let cdr: ChangeDetectorRef;

  describe('Keyboard Events', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({ declarations: [TestPopover], providers: [ClrPopoverService] });
      popoverService = TestBed.inject(ClrPopoverService);
      popoverService.open = true;
      fixture = TestBed.createComponent(TestPopover);
      cdr = fixture.componentInstance.ref;
      fixture.detectChanges();
    });

    it('closes the popover when ESC is pressed', () => {
      const event: KeyboardEvent = new KeyboardEvent('keydown', { key: 'Escape' });

      document.dispatchEvent(event);

      expect(popoverService.open).toBe(false);
    });

    it('should not run change detection when any button is pressed except ESC', async () => {
      spyOn(cdr, 'markForCheck').and.callThrough();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
      expect(cdr.markForCheck).not.toHaveBeenCalled();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
      expect(cdr.markForCheck).not.toHaveBeenCalled();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(cdr.markForCheck).toHaveBeenCalled();
    });
  });

  describe('Popover with clrIfOpen Directive', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestPopover, TestPopoverWithIfOpenDirective],
        imports: [ClrConditionalModule],
        providers: [ClrPopoverService],
      });
      popoverService = TestBed.inject(ClrPopoverService);
      fixture = TestBed.createComponent(TestPopoverWithIfOpenDirective);
      fixture.detectChanges();
    });

    it('opens the abstract popover only after ClrPopoverService is in open state', () => {
      expect(popoverService.open).toBe(false);
      expect(fixture.componentInstance.testPopover).toBeUndefined();

      popoverService.open = true;
      fixture.detectChanges();

      expect(fixture.componentInstance.testPopover).not.toBeUndefined();
    });
  });

  describe('Open popover on focus', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestPopoverIgnoreElement, InputFocusPopover],
        imports: [ClrConditionalModule],
      });
      fixture = TestBed.createComponent(InputFocusPopover);
      fixture.detectChanges();
    });

    it('keeps the popover open when the input is focused', () => {
      const input = fixture.debugElement.query(By.css('input'));

      input.triggerEventHandler('focus', {});
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.test-popover'))).not.toBeNull();
    });

    // Cannot test a protected property
    // it("initializes the ignored element", () => {
    //     const input = fixture.debugElement.query(By.css("input"));

    //     input.triggerEventHandler("focus", {});
    //     fixture.detectChanges();

    //     const popover: TestPopoverIgnoreElement = fixture.componentInstance.popover;

    //     expect(popover.ignoredElement).toBeDefined();
    // });
  });

  describe('Open behavior', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({ declarations: [TestPopover], providers: [ClrPopoverService] });
      popoverService = TestBed.inject(ClrPopoverService);
      popoverService.open = true;
      fixture = TestBed.createComponent(TestPopover);
      fixture.detectChanges();
    });

    it('should close on outside click', () => {
      popoverService.open = true;
      document.dispatchEvent(new Event('click'));
      expect(popoverService.open).toBe(false);
    });

    it('should not close if outside click opens popover', () => {
      const btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      document.body.appendChild(btn);

      btn.addEventListener('click', () => {
        popoverService.open = true;
      });

      btn.dispatchEvent(new Event('click'));
      expect(popoverService.open).toBe(true);

      // popover should stay open if button is clicked again
      btn.dispatchEvent(new Event('click'));
      expect(popoverService.open).toBe(true);

      // must cleanup elements that are manually added to document body
      document.body.removeChild(btn);
    });
  });
});
