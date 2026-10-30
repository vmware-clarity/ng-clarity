/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrModal, ClrModalModule } from '@clr/angular/modal';
import { Keys } from '@clr/angular/utils';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrPopoverService } from './providers/popover.service';
import { ClrStopEscapePropagationDirective } from './stop-escape-propagation.directive';

describe('ClrPopover', () => {
  describe('Directive', () => {
    describe('ClrStopEscapePropagationDirective', function () {
      let fixture: ComponentFixture<TestComponent>;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrModalModule],
          declarations: [TestComponent, TestPopoverHostComponent],
        });

        fixture = TestBed.createComponent(TestComponent);
        renderFixture(fixture);
      });

      it('should allow a modal to be closed via the escape key', async () => {
        fixture.componentRef.setInput('modalOpen', true);
        renderFixture(fixture);

        await pressEscapeKey(fixture, fixture.nativeElement);

        expect(fixture.componentInstance.modalOpen).toBe(false);
      });

      it('should allow a nested popover to be closed via the escape key', async () => {
        fixture.componentRef.setInput('modalOpen', true);
        fixture.componentInstance.popoverHostComponent.popoverService.open = true;
        renderFixture(fixture);

        await pressEscapeKey(fixture, fixture.componentInstance.popoverHostComponent.elementRef.nativeElement);

        expect(fixture.componentInstance.popoverHostComponent.popoverService.open).toBe(false);
      });

      it('should prevent a modal from being closed when escape is pressed on a nested popover', async () => {
        fixture.componentRef.setInput('modalOpen', true);
        fixture.componentInstance.popoverHostComponent.popoverService.open = true;
        renderFixture(fixture);

        await pressEscapeKey(fixture, fixture.componentInstance.popoverHostComponent.elementRef.nativeElement);

        expect(fixture.componentInstance.modalOpen).toBe(true);
      });
    });
  });
});

async function pressEscapeKey(fixture: ComponentFixture<TestComponent>, element: HTMLElement) {
  element.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Escape, bubbles: true }));
  element.dispatchEvent(new KeyboardEvent('keyup', { key: Keys.Escape, bubbles: true }));

  await fixture.whenStable();
  renderFixture(fixture);
}

@Component({
  selector: 'app-test-popover-host',
  template: '',
  providers: [ClrPopoverService],
  hostDirectives: [ClrStopEscapePropagationDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestComponent {
  @Input() modalOpen = false;

  @ViewChild(ClrModal) readonly modal: ClrModal;
  @ViewChild(TestPopoverHostComponent) readonly popoverHostComponent: TestPopoverHostComponent;
}
