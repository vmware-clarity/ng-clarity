/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrIcon } from './icon.component';
import { ClrIconModule } from './icon.module';
import { renderIcon } from './icon.renderer';
import { ClarityIcons } from './icon.service'; // Static import
import { GlobalStateService } from './services/global.service'; // Static import

const testIcon = renderIcon('test');

@Component({
  template: ` <cds-icon></cds-icon> `,
  standalone: false,
})
class TestComponent {
  @ViewChild(ClrIcon) icon: ClrIcon;
}

describe('icon element', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: ClrIcon;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ClrIconModule],
      declarations: [TestComponent],
      // No providers needed for the static services
    });

    // Reset global state
    GlobalStateService.setValue('iconRegistry', {});

    // Add icons using the static class
    ClarityIcons.addIcons(['testing', testIcon]);

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    component = fixture.componentInstance.icon;
  });

  describe('shape: ', () => {
    it('shape should default to unknown if one is not given', async () => {
      expect(component.shape).toBe('unknown');
    });

    it('shape should get shape if it is in the registry', async () => {
      component.shape = 'testing';
      fixture.detectChanges();
      expect(component.shape).toBe('testing');
    });

    it('shape should render when a matching shape is updated in the registry', async () => {
      const shape = 'jabberwocky';
      const svg = '<svg>jabberwocky</svg>';

      component.shape = shape;
      fixture.detectChanges();
      expect(component.shape).toBe(shape);
      // The component should fall back to the "unknown" icon
      expect(component.isStringIcon).toBe(false); // "unknown" is an SVG, not a string

      // Use the static service to add the new icon
      ClarityIcons.addIcons([shape, svg]);
      fixture.detectChanges();

      // The subscription in ngOnInit should pick up the change and update the icon
      expect(component.isStringIcon).toBe(true); // as it's a raw string
      expect(component.iconSVG).toContain(svg);
    });

    it('shape should not run an update if the shape is assigned the value it already has', async () => {
      component.shape = 'testing';
      fixture.detectChanges();
      spyOn(component, 'updateIcon').and.callThrough();
      component.shape = 'testing';
      fixture.detectChanges();
      expect(component.updateIcon).not.toHaveBeenCalled();
    });

    it('shape should not run an update if the shape is assigned a nil or empty value', async () => {
      const testShape = 'testing';
      component.shape = testShape;
      fixture.detectChanges();
      spyOn(component, 'updateIcon').and.callThrough();

      component.shape = '';
      fixture.detectChanges();
      expect(component.updateIcon).not.toHaveBeenCalled();

      component.shape = null;
      fixture.detectChanges();
      expect(component.updateIcon).not.toHaveBeenCalled();

      component.shape = void 0;
      fixture.detectChanges();
      expect(component.updateIcon).not.toHaveBeenCalled();
    });

    it('does not subscribe to the global state handler after the element is disconnected', async () => {
      const spy = spyOn(GlobalStateService.stateUpdates, 'subscribe').and.callThrough();

      // Create a component, which subscribes in ngOnInit
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges(); // This calls ngOnInit
      expect(spy).toHaveBeenCalledTimes(1);

      // Destroy the component, which unsubscribes in ngOnDestroy
      fixture.destroy();

      // Create a new component
      spy.calls.reset();
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('size: ', () => {
    it('should update if assigned a new value', async () => {
      component.size = 'xl';
      fixture.detectChanges();
      spyOn(component, 'updateIconSize').and.callThrough();
      component.size = 'md';
      fixture.detectChanges();
      expect(component.updateIconSize).toHaveBeenCalled();
    });

    it('should not run an update if assigned the value it already has', async () => {
      component.size = 'md';
      fixture.detectChanges();
      spyOn(component, 'updateIconSize').and.callThrough();
      component.size = 'md';
      fixture.detectChanges();
      expect(component.updateIconSize).not.toHaveBeenCalled();
    });

    it('should add width/height styles if passed numerical value', async () => {
      expect(component.el.nativeElement.style.width).toBe('');
      expect(component.el.nativeElement.style.height).toBe('');
      component.size = '43';
      fixture.detectChanges();
      expect(component.el.nativeElement.style.width).toBe('calc((43 / var(--cds-global-base)) * 1rem)');
      expect(component.el.nativeElement.style.height).toBe('calc((43 / var(--cds-global-base)) * 1rem)');
    });

    it('should remove the size attribute if set to undefined', async () => {
      component.size = 'md'; // Set a value first
      fixture.detectChanges();
      expect(component.el.nativeElement.hasAttribute('size')).toBe(true);

      component.size = void 0;
      fixture.detectChanges();
      expect(component.el.nativeElement.hasAttribute('size')).toBe(false);
    });

    it('should remove the size attribute if set to null', async () => {
      component.size = 'md'; // Set a value first
      fixture.detectChanges();
      expect(component.el.nativeElement.hasAttribute('size')).toBe(true);

      component.size = null;
      fixture.detectChanges();
      expect(component.el.nativeElement.hasAttribute('size')).toBe(false);
    });
  });

  describe('solid: ', () => {
    it('should default to false', async () => {
      expect(component.el.nativeElement.hasAttribute('solid')).toBe(false);
    });
    it('should update if assigned a new value', async () => {
      component.solid = true;
      fixture.detectChanges();
      expect(component.el.nativeElement.hasAttribute('solid')).toBe(true);
    });
  });

  describe('status: ', () => {
    it('should default to empty string', async () => {
      expect(component.status).toEqual(undefined);
    });
    it('should update if assigned a new value', async () => {
      component.status = 'info';
      fixture.detectChanges();
      expect(component.status).toEqual('info');
    });
  });

  describe('inverse: ', () => {
    it('should default to false', async () => {
      expect(component.el.nativeElement.hasAttribute('inverse')).toBe(false);
    });
    it('should update if assigned a new value', async () => {
      component.inverse = true;
      fixture.detectChanges();
      expect(component.el.nativeElement.hasAttribute('inverse')).toBe(true);
    });
  });

  describe('badge: ', () => {
    it('should default to false', async () => {
      expect(component.badge).toBe(undefined);
      expect(component.el.nativeElement.hasAttribute('badge')).toBe(false);
    });
    it('should update if assigned a new value', async () => {
      component.badge = 'warning';
      fixture.detectChanges();
      expect(component.el.nativeElement.hasAttribute('badge')).toBe(true);
    });
    it('should update if assigned a new value', async () => {
      component.badge = 'info';
      fixture.detectChanges();
      expect(component.el.nativeElement.hasAttribute('badge')).toBe(true);
      fixture.detectChanges();
      expect(component.badge).toEqual('info');
    });
    it('should be removed if set to null', async () => {
      component.badge = 'danger';
      fixture.detectChanges();
      expect(component.el.nativeElement.hasAttribute('badge')).toBe(true);
      component.badge = null;
      fixture.detectChanges();
      expect(component.el.nativeElement.hasAttribute('badge')).toBe(false);
    });
  });
});
