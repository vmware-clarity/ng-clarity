/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrStopEscapePropagationDirective } from './stop-escape-propagation.directive';
import { ClrModal } from '../../modal';
import { ClrModalModule } from '../../modal';
import { ClrPopoverService } from '../../utils';
import { Keys } from '../../utils/enums/keys.enum';

export default function (): void {
  describe('ClrStopEscapePropagationDirective', function () {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, ClrModalModule],
        declarations: [TestComponent, TestPopoverHostComponent],
      });

      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
    });

    it('should allow a modal to be closed via the escape key', async () => {
      fixture.componentInstance.modalOpen = true;
      fixture.detectChanges();

      await pressEscapeKey(fixture, fixture.nativeElement);

      expect(fixture.componentInstance.modalOpen).toBe(false);
    });

    it('should allow a nested popover to be closed via the escape key', async () => {
      fixture.componentInstance.modalOpen = true;
      fixture.componentInstance.popoverHostComponent.popoverService.open = true;
      fixture.detectChanges();

      await pressEscapeKey(fixture, fixture.componentInstance.popoverHostComponent.elementRef.nativeElement);

      expect(fixture.componentInstance.popoverHostComponent.popoverService.open).toBe(false);
    });

    it('should prevent a modal from being closed when escape is pressed on a nested popover', async () => {
      fixture.componentInstance.modalOpen = true;
      fixture.componentInstance.popoverHostComponent.popoverService.open = true;
      fixture.detectChanges();

      await pressEscapeKey(fixture, fixture.componentInstance.popoverHostComponent.elementRef.nativeElement);

      expect(fixture.componentInstance.modalOpen).toBe(true);
    });
  });
}

async function pressEscapeKey(fixture: ComponentFixture<TestComponent>, element: HTMLElement) {
  element.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Escape, bubbles: true }));
  element.dispatchEvent(new KeyboardEvent('keyup', { key: Keys.Escape, bubbles: true }));

  await fixture.whenStable();
  fixture.detectChanges();
}

@Component({
  selector: 'app-test-popover-host',
  template: '',
  providers: [ClrPopoverService],
  hostDirectives: [ClrStopEscapePropagationDirective],
  standalone: false,
})
class TestPopoverHostComponent {
  constructor(
    readonly elementRef: ElementRef<HTMLElement>,
    readonly popoverService: ClrPopoverService
  ) {}

  @HostListener('keydown.escape', ['$event'])
  onEscapeKey(event) {
    this.popoverService.toggleWithEvent(event);
  }
}

@Component({
  template: `
    <clr-modal [(clrModalOpen)]="modalOpen">
      <div class="modal-body">
        <app-test-popover-host></app-test-popover-host>
      </div>
    </clr-modal>
  `,
  standalone: false,
})
class TestComponent {
  @Input() modalOpen = false;

  @ViewChild(ClrModal) readonly modal: ClrModal;
  @ViewChild(TestPopoverHostComponent) readonly popoverHostComponent: TestPopoverHostComponent;
}
