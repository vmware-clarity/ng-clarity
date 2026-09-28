/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrPopoverContent } from './popover-content';
import { ClrPopoverModuleNext } from './popover.module';
import { ClrPopoverService } from './providers/popover.service';

@Component({
  selector: 'test-popover',
  template: `
    <button #origin class="origin" type="button">{{ name }}</button>
    <div *clrPopoverContent="service.open; at: 'bottom-left'; outsideClickToClose: false; scrollToClose: false">
      <button #inside class="inside" type="button">inside {{ name }}</button>
    </div>
  `,
  providers: [ClrPopoverService],
  standalone: false,
})
class TestPopover {
  @Input() name = '';

  @ViewChild('origin', { static: true }) origin: ElementRef<HTMLButtonElement>;
  @ViewChild(ClrPopoverContent, { static: true }) content: ClrPopoverContent;

  constructor(readonly service: ClrPopoverService) {
    service.origin = null;
  }

  // The button inside this popover's content, which is rendered in the overlay.
  get inside(): ElementRef<HTMLElement> {
    return new ElementRef(
      Array.from(document.querySelectorAll<HTMLElement>('.inside')).find(
        button => button.textContent.trim() === `inside ${this.name}`
      )
    );
  }

  open() {
    this.service.origin = this.origin;
    this.service.open = true;
  }

  // Opens this popover from inside another one it is not declared in.
  openFrom(parent: TestPopover) {
    this.service.parent = parent.content;
    this.service.origin = parent.inside;
    this.service.open = true;
  }
}

// Same as TestPopover, with another popover declared inside its content - nested where it is declared.
@Component({
  selector: 'test-root-popover',
  template: `
    <button #origin class="origin" type="button">root</button>
    <div *clrPopoverContent="service.open; at: 'bottom-left'; outsideClickToClose: false; scrollToClose: false">
      <button class="inside" type="button">inside root</button>
      <test-popover name="declared"></test-popover>
    </div>
  `,
  providers: [ClrPopoverService],
  standalone: false,
})
class TestRootPopover extends TestPopover {
  override name = 'root';

  @ViewChild(TestPopover) declared: TestPopover;
}

@Component({
  template: `
    <div class="scroller" style="height: 100px; width: 200px; overflow: auto">
      <div style="height: 1000px; padding-top: 20px">
        @if (showRoot) {
          <test-root-popover></test-root-popover>
        }
      </div>
    </div>
    <test-popover name="first"></test-popover>
    <test-popover name="second"></test-popover>
  `,
  standalone: false,
})
class NestingHost {
  showRoot = true;

  @ViewChild(TestRootPopover) root: TestRootPopover;
}

export default function (): void {
  describe('ClrPopoverContent opened from inside another popover', function () {
    let fixture: ComponentFixture<NestingHost>;
    let host: NestingHost;
    let first: TestPopover;
    let second: TestPopover;

    // The scroll listeners are attached from a timeout once the overlay is shown.
    const settle = async () => {
      fixture.detectChanges();
      await new Promise(resolve => setTimeout(resolve));
      fixture.detectChanges();
    };

    const scroller = () => fixture.nativeElement.querySelector('.scroller') as HTMLElement;

    const updatePositionSpy = (popover: TestPopover) =>
      spyOn((popover.content as any).overlayRef, 'updatePosition').and.callThrough();

    beforeEach(function () {
      TestBed.configureTestingModule({
        imports: [ClrPopoverModuleNext],
        declarations: [NestingHost, TestPopover, TestRootPopover],
      });
      fixture = TestBed.createComponent(NestingHost);
      fixture.detectChanges();
      host = fixture.componentInstance;

      const popovers = fixture.debugElement
        .queryAll(debugElement => debugElement.name === 'test-popover')
        .map(debugElement => debugElement.componentInstance as TestPopover);
      first = popovers.find(popover => popover.name === 'first');
      second = popovers.find(popover => popover.name === 'second');
    });

    afterEach(function () {
      fixture.destroy();
    });

    it('does not follow the scroll containers of the other popover without the link', async function () {
      host.root.open();
      await settle();
      first.service.origin = host.root.inside;
      first.service.open = true;
      await settle();

      const updatePosition = updatePositionSpy(first);
      scroller().dispatchEvent(new Event('scroll'));

      expect(updatePosition).not.toHaveBeenCalled();
    });

    it('follows the scroll containers of the popover it was opened from', async function () {
      host.root.open();
      await settle();
      first.openFrom(host.root);
      await settle();

      const updatePosition = updatePositionSpy(first);
      scroller().dispatchEvent(new Event('scroll'));

      expect(updatePosition).toHaveBeenCalled();
    });

    it('carries on to the root through a popover that is nested where it is declared', async function () {
      host.root.open();
      await settle();
      host.root.declared.open();
      await settle();
      first.openFrom(host.root.declared);
      await settle();

      const updatePosition = updatePositionSpy(first);
      scroller().dispatchEvent(new Event('scroll'));

      expect(updatePosition).toHaveBeenCalled();
    });

    it('moves over to the origin of the popover it was opened from when that one closes first', async function () {
      host.root.open();
      await settle();
      first.openFrom(host.root);
      await settle();

      host.root.service.open = false;
      await settle();

      expect(first.service.open).toBeTrue();
      expect(first.service.originElement.nativeElement).toBe(host.root.origin.nativeElement);
      expect(first.service.parent).toBeNull();

      // It keeps following the scroll containers from its new origin.
      const updatePosition = updatePositionSpy(first);
      scroller().dispatchEvent(new Event('scroll'));
      expect(updatePosition).toHaveBeenCalled();
    });

    it('nests in the parent of the popover it was opened from when moving over', async function () {
      host.root.open();
      await settle();
      host.root.declared.open();
      await settle();
      first.openFrom(host.root.declared);
      await settle();

      host.root.declared.service.open = false;
      await settle();

      expect(first.service.open).toBeTrue();
      expect(first.service.originElement.nativeElement).toBe(host.root.declared.origin.nativeElement);
      expect(first.service.parent).toBe(host.root.content);
    });

    it('nests in the popover that the one it was opened from was itself opened from', async function () {
      host.root.open();
      await settle();
      first.openFrom(host.root);
      await settle();
      second.openFrom(first);
      await settle();

      first.service.open = false;
      await settle();

      expect(second.service.open).toBeTrue();
      expect(second.service.originElement.nativeElement).toBe(host.root.inside.nativeElement);
      expect(second.service.parent).toBe(host.root.content);
    });

    it('closes when the popover it was opened from goes away together with its origin', async function () {
      host.root.open();
      await settle();
      first.openFrom(host.root);
      await settle();

      host.showRoot = false;
      fixture.detectChanges();

      // Right away, rather than once the intersection observer notices that the origin is gone.
      expect(first.service.open).toBeFalse();
      expect(first.service.parent).toBeNull();
    });

    it('drops the link once it closes, and leaves its origin for focus to go back to', async function () {
      host.root.open();
      await settle();
      first.openFrom(host.root);
      await settle();
      const inside = first.service.originElement.nativeElement;

      first.service.open = false;
      await settle();

      expect(first.service.parent).toBeNull();
      expect(first.service.originElement.nativeElement).toBe(inside);
    });

    it('falls back on the parent origin when opened again after its own origin went away', async function () {
      host.root.open();
      await settle();
      first.openFrom(host.root);
      await settle();
      first.service.open = false;
      await settle();
      host.root.service.open = false;
      await settle();

      first.service.open = true;
      await settle();

      expect(first.service.originElement.nativeElement).toBe(host.root.origin.nativeElement);
    });

    it('keeps an origin set for the next opening over the fallback', async function () {
      host.root.open();
      await settle();
      first.openFrom(host.root);
      await settle();
      first.service.open = false;
      await settle();

      first.openFrom(host.root);
      await settle();

      expect(first.service.originElement.nativeElement).toBe(host.root.inside.nativeElement);
      expect(first.service.parent).toBe(host.root.content);
    });

    it('does not loop on popovers linked to each other', async function () {
      first.service.parent = second.content;
      second.service.parent = first.content;
      first.open();
      await settle();

      expect(first.service.open).toBeTrue();
    });

    it('leaves a popover without the link as it was', async function () {
      first.open();
      await settle();
      first.service.open = false;
      await settle();

      expect(first.service.parent).toBeNull();
      expect(first.service.originElement.nativeElement).toBe(first.origin.nativeElement);
    });
  });
}
