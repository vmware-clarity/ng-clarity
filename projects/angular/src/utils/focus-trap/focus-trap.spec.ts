/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  ElementRef,
  Inject,
  Injector,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CDS_FOCUS_TRAP_DOCUMENT_ATTR, FocusTrapTrackerService, sleep } from '@cds/core/internal';

import {
  addReboundElementsToFocusTrapElement,
  createFocusTrapReboundElement,
  elementIsOutsideFocusTrapElement,
  FocusTrap,
  FocusTrapElement,
  refocusIfOutsideFocusTrapElement,
  removeReboundElementsFromFocusTrapElement,
} from './focus-trap';

@Component({
  selector: 'focus-trap',
  template: `<ng-content></ng-content>`,
})
class FocusTrapComponent extends FocusTrap {
  constructor(renderer2: Renderer2, injector: Injector, @Inject(PLATFORM_ID) platformId: any, hostElement: ElementRef) {
    super(renderer2, injector, platformId, hostElement.nativeElement);
  }
}

@Component({
  selector: 'test-focus-trap-ng',
  template: `
    <button class="outside-focus">nope</button>
    <focus-trap>
      <a href="#" class="inside-focus">Link 1</a>
    </focus-trap>
  `,
})
class TestFocusTrapComponent {
  @ViewChild(FocusTrapComponent)
  focusTrapComponent: FocusTrapComponent;
}

describe('Focus Trap Utilities: ', () => {
  let focusedElement: HTMLElement;
  let noFocusElement: HTMLElement;
  let testElement: FocusTrapElement;
  let focusTrapElement: FocusTrapElement;
  let fixture: ComponentFixture<TestFocusTrapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [FocusTrapComponent, TestFocusTrapComponent],
    });

    fixture = TestBed.createComponent(TestFocusTrapComponent);
    fixture.detectChanges();

    testElement = fixture.elementRef.nativeElement;
    focusTrapElement = testElement.querySelector('focus-trap');
    focusedElement = testElement.querySelector('.inside-focus');
    noFocusElement = testElement.querySelector('.outside-focus');
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Functional Helper: ', () => {
    describe('addReboundElementsToFocusTrapElement()', () => {
      beforeEach(() => {
        fixture.componentInstance.focusTrapComponent.enableFocusTrap();
      });

      it('adds rebound elements correctly when there are no siblings', () => {
        addReboundElementsToFocusTrapElement(document, focusTrapElement);
        const reboundElements = document.body.querySelectorAll('.offscreen-focus-rebounder');
        expect(reboundElements.length).toBe(2);
        expect(reboundElements[0].nextSibling).toEqual(focusTrapElement);
        expect(focusTrapElement.nextSibling).toEqual(reboundElements[1]);
      });

      it('does not double-add rebound elements if called twice by accident', () => {
        addReboundElementsToFocusTrapElement(document, focusTrapElement);
        addReboundElementsToFocusTrapElement(document, focusTrapElement);
        const reboundElements = testElement.querySelectorAll('.offscreen-focus-rebounder');
        expect(reboundElements.length).toBe(2);
      });

      it('adds rebound elements correctly when there are siblings ', () => {
        // this creates a sibling element to focusTrapElement
        const siblingEl = document.createElement('div');
        focusTrapElement.parentElement.appendChild(siblingEl);

        addReboundElementsToFocusTrapElement(document, focusTrapElement);

        const reboundElements = document.querySelectorAll('.offscreen-focus-rebounder');
        expect(reboundElements.length).toBe(2);

        expect(reboundElements[0].nextSibling).toEqual(focusTrapElement);
        expect(focusTrapElement.nextSibling).toEqual(reboundElements[1]);
      });
    });

    describe('removeReboundElementsFromFocusTrapElement()', () => {
      it('removes rebound elements correctly', () => {
        addReboundElementsToFocusTrapElement(document, focusTrapElement);
        removeReboundElementsFromFocusTrapElement(focusTrapElement);
        expect(document.querySelectorAll('.offscreen-focus-rebounder').length).toBe(0);
      });

      it('does not blow up if no rebound elements', () => {
        removeReboundElementsFromFocusTrapElement(focusTrapElement);
        expect(removeReboundElementsFromFocusTrapElement).not.toThrow();
        expect(document.querySelectorAll('.offscreen-focus-rebounder').length).toBe(0);
      });
    });

    describe('createFocusTrapReboundElement())', () => {
      let testElement: HTMLElement;

      beforeEach(() => {
        testElement = createFocusTrapReboundElement(document);
      });

      it('creates a focusable offscreen element', () => {
        expect(testElement.getAttribute('tabindex')).toBe('0');
        expect(testElement.classList).toContain('offscreen-focus-rebounder');
      });
    });

    describe('refocusIfOutsideFocusTrapElement()', () => {
      beforeEach(() => {
        fixture.componentInstance.focusTrapComponent.enableFocusTrap();
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('calls focus() if in current focus trap element', () => {
        spyOn(focusedElement, 'focus');
        FocusTrapTrackerService.setCurrent(focusTrapElement);
        refocusIfOutsideFocusTrapElement(focusedElement, focusTrapElement);
        expect(focusedElement.focus).toHaveBeenCalled();
      });

      it('redirects focus() if focused element not in current focus trap element', () => {
        spyOn(noFocusElement, 'focus');

        refocusIfOutsideFocusTrapElement(noFocusElement, focusTrapElement);
        expect(noFocusElement.focus).not.toHaveBeenCalled();
      });

      it('redirects focus() if it tries to focus a rebounder', async () => {
        const topReboundElement = focusTrapElement.topReboundElement;
        const bottomReboundElement = focusTrapElement.bottomReboundElement;
        spyOn(topReboundElement, 'focus');
        spyOn(bottomReboundElement, 'focus');
        refocusIfOutsideFocusTrapElement(topReboundElement, focusTrapElement);
        expect(topReboundElement.focus).not.toHaveBeenCalled();
        refocusIfOutsideFocusTrapElement(bottomReboundElement, focusTrapElement);
        expect(bottomReboundElement.focus).not.toHaveBeenCalled();
      });
    });

    describe('elementIsOutsideFocusTrapElement()', () => {
      it('returns true if element is outside focus trap element', async () => {
        expect(elementIsOutsideFocusTrapElement(noFocusElement, focusTrapElement)).toBeTruthy();
      });

      it('returns true if focused element is top rebound element', async () => {
        focusTrapElement.topReboundElement = focusedElement;
        expect(elementIsOutsideFocusTrapElement(focusedElement, focusTrapElement)).toBeTruthy();
      });

      it('returns true if focused element is bottom rebound element', async () => {
        focusTrapElement.bottomReboundElement = focusedElement;
        expect(elementIsOutsideFocusTrapElement(focusedElement, focusTrapElement)).toBeTruthy();
      });

      it('returns false if element is inside focus trap element', () => {
        const focusedElement = document.createElement('div') as HTMLElement;
        focusTrapElement.appendChild(focusedElement);
        expect(elementIsOutsideFocusTrapElement(focusedElement, focusTrapElement)).toBeFalsy();
      });
    });
  });
});

describe('FocusTrap Class: ', () => {
  describe('enableFocusTrap()', () => {
    let focusTrap: FocusTrapComponent;
    let fixture: ComponentFixture<TestFocusTrapComponent>;
    let wrapperComponent: ComponentRef<TestFocusTrapComponent>;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [CommonModule],
        declarations: [TestFocusTrapComponent, FocusTrapComponent],
      });

      fixture = TestBed.createComponent(TestFocusTrapComponent);
      wrapperComponent = fixture.componentRef;
      fixture.detectChanges();
      focusTrap = wrapperComponent.instance.focusTrapComponent;
      focusTrap.enableFocusTrap();
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('set focus trap id', () => {
      expect(focusTrap.focusTrapElement.focusTrapId).toBeTruthy('needs to set focus trap id on plain html elements');
    });

    it('should add rebound elements', () => {
      expect(document.querySelectorAll('.offscreen-focus-rebounder').length).toBe(2);
    });

    it('should have a tabindex of -1 to be able to programatically focus', () => {
      expect(focusTrap.focusTrapElement.getAttribute('tabindex')).toBe('-1');
    });

    it('should not override tabindex if focus trap element already has a tabindex set', () => {
      focusTrap.removeFocusTrap();
      focusTrap.focusTrapElement.setAttribute('tabindex', '1');
      focusTrap.enableFocusTrap();
      expect(focusTrap.focusTrapElement.getAttribute('tabindex')).toBe('1');
      expect(focusTrap.focusTrapElement.getAttribute('tabindex')).not.toBe('-1');
    });

    it('should add to focus trap attr on root element (html) to prevent scrolling', () => {
      expect(document.documentElement.getAttribute(CDS_FOCUS_TRAP_DOCUMENT_ATTR)).toBe('');
    });

    it('should set itself to current on FocusTrapTracker service', () => {
      expect(FocusTrapTrackerService.getCurrent()).toEqual(focusTrap.focusTrapElement as any);
    });

    it('should be focused', async () => {
      // focus is not immediately set due to safari issue
      await sleep(23);
      expect(document.activeElement).toEqual(focusTrap.focusTrapElement, 'focus is set asynchronously after creation');
    });

    it('should be set to active', () => {
      expect(focusTrap.active).toBe(true);
    });

    it('should throw an error if enabledFocusTrap is called again', () => {
      const secondCall = () => focusTrap.enableFocusTrap();
      expect(secondCall).toThrow();
    });
  });

  describe('removeFocusTrap()', () => {
    let focusTrap: FocusTrapComponent;
    let fixture: ComponentFixture<TestFocusTrapComponent>;
    let wrapperComponent: ComponentRef<TestFocusTrapComponent>;
    let previousFocusedElement: HTMLElement;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [CommonModule],
        declarations: [TestFocusTrapComponent, FocusTrapComponent],
      });

      fixture = TestBed.createComponent(TestFocusTrapComponent);
      wrapperComponent = fixture.componentRef;
      fixture.detectChanges();
      focusTrap = wrapperComponent.instance.focusTrapComponent;
      fixture.nativeElement.querySelector('button').focus();
      previousFocusedElement = document.activeElement as HTMLElement;
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should remove rebound elements', () => {
      focusTrap.removeFocusTrap();
      expect(document.querySelectorAll('.offscreen-focus-rebounder').length).toBe(0);
    });

    it('should remove layout attribute to prevent scrolling on body', () => {
      expect(document.body.getAttribute('cds-layout')).toBeNull();
    });

    it('should not be set as current on FocusTrapTracker', () => {
      expect(FocusTrapTrackerService.getCurrent()).not.toEqual(previousFocusedElement as any);
    });

    it('should not be set to active', () => {
      expect(focusTrap.active).toBe(false);
    });

    it('should restore previous focus', () => {
      focusTrap.removeFocusTrap();
      expect(document.activeElement).toEqual(previousFocusedElement);
    });
  });
});
