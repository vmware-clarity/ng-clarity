/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClrLayout } from './layout';
import { ClrFormLayout, LayoutService } from './providers/layout.service';

function customTestComponentFactory(
  layout: ClrFormLayout = ClrFormLayout.VERTICAL,
  hasLabelSize = false,
  labelSize: any = 2
) {
  @Component({
    template: `<div clrForm clrLayout="${layout}" ${hasLabelSize ? `clrLabelSize="${labelSize}"` : ''}></div>`,
    providers: [LayoutService],
  })
  class TestComponent {}
  return TestComponent;
}

export default function (): void {
  describe('ClrLayout', () => {
    it('sets the layout selection in LayoutService on init if provided', function () {
      const testClass = customTestComponentFactory();
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(service.layout).toEqual(ClrFormLayout.VERTICAL);
    });

    it('accepts layout option through layout input binding', function () {
      const testClass = customTestComponentFactory();
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const component = fixture.debugElement.query(By.directive(ClrLayout));
      const directive = component.injector.get(ClrLayout);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(directive.layout).toEqual(ClrFormLayout.VERTICAL);
      expect(service.layout).toEqual(ClrFormLayout.VERTICAL);
    });

    it('ignores invalid layout types', function () {
      const testClass = customTestComponentFactory('invalid' as ClrFormLayout);
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(service.layout).toEqual(ClrFormLayout.HORIZONTAL);
    });

    it('label should have a default size of 2', () => {
      const testClass = customTestComponentFactory(ClrFormLayout.HORIZONTAL);
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(service.labelSize).toEqual(2);
    });

    it('layout service should properly validate label sizes', () => {
      const testClass = customTestComponentFactory(ClrFormLayout.HORIZONTAL);
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(service.labelSizeIsValid(service.minLabelSize)).toBeTrue();
      expect(service.labelSizeIsValid(Math.ceil((service.minLabelSize + service.maxLabelSize) / 2))).toBeTrue();
      expect(service.labelSizeIsValid(service.maxLabelSize)).toBeTrue();

      // out of range integer
      expect(service.labelSizeIsValid(0)).toBeFalse();
      expect(service.labelSizeIsValid(13)).toBeFalse();

      // out of range float number
      expect(service.labelSizeIsValid(0.5)).toBeFalse();

      // out of range float number
      expect(service.labelSizeIsValid(1.5)).toBeFalse();
    });

    it('horizontal layout label that are out of (1, 12) range should default to size of 2', () => {
      const testClass = customTestComponentFactory(ClrFormLayout.HORIZONTAL, true, -1);
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(service.labelSize).toEqual(2);
    });

    it('compact layout label that are out of (1, 12) range should default to size of 2', () => {
      const testClass = customTestComponentFactory(ClrFormLayout.COMPACT, true, -1);
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(service.labelSize).toEqual(2);
    });

    it("vertical layout label shouldn't be able to set label size", () => {
      const testClass = customTestComponentFactory(ClrFormLayout.VERTICAL, true, 3);
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(service.labelSize).toEqual(2);
    });

    it('ignores string label sizes for horizontal layout and defaults to 2', () => {
      const testClass = customTestComponentFactory(ClrFormLayout.HORIZONTAL, true, '2');
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(service.layout).toEqual(ClrFormLayout.HORIZONTAL);
      expect(service.labelSize).toEqual(2);
    });

    it('ignores boolean label sizes for horizontal layout and defaults to 2', () => {
      const testClass = customTestComponentFactory(ClrFormLayout.HORIZONTAL, true, true);
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(service.layout).toEqual(ClrFormLayout.HORIZONTAL);
      expect(service.labelSize).toEqual(2);
    });

    it('ignores object label sizes for horizontal layout and defaults to 2', () => {
      const testClass = customTestComponentFactory(ClrFormLayout.HORIZONTAL, true, new Object());
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(service.layout).toEqual(ClrFormLayout.HORIZONTAL);
      expect(service.labelSize).toEqual(2);
    });

    it('ignores null label sizes for horizontal layout and defaults to 2', () => {
      const testClass = customTestComponentFactory(ClrFormLayout.HORIZONTAL, true, null);
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(service.layout).toEqual(ClrFormLayout.HORIZONTAL);
      expect(service.labelSize).toEqual(2);
    });

    it('ignores undefined label sizes for horizontal layout and defaults to 2', () => {
      const testClass = customTestComponentFactory(ClrFormLayout.HORIZONTAL, true);
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(service.layout).toEqual(ClrFormLayout.HORIZONTAL);
      expect(service.labelSize).toEqual(2);
    });
    //

    it('ignores string label sizes for compact layout and defaults to 2', () => {
      const testClass = customTestComponentFactory(ClrFormLayout.COMPACT, true, '2');
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(service.layout).toEqual(ClrFormLayout.COMPACT);
      expect(service.labelSize).toEqual(2);
    });

    it('ignores boolean label sizes for compact layout and defaults to 2', () => {
      const testClass = customTestComponentFactory(ClrFormLayout.COMPACT, true, true);
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(service.layout).toEqual(ClrFormLayout.COMPACT);
      expect(service.labelSize).toEqual(2);
    });

    it('ignores object label sizes for compact layout and defaults to 2', () => {
      const testClass = customTestComponentFactory(ClrFormLayout.COMPACT, true, new Object());
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(service.layout).toEqual(ClrFormLayout.COMPACT);
      expect(service.labelSize).toEqual(2);
    });

    it('ignores null label sizes for compact layout and defaults to 2', () => {
      const testClass = customTestComponentFactory(ClrFormLayout.COMPACT, true, null);
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(service.layout).toEqual(ClrFormLayout.COMPACT);
      expect(service.labelSize).toEqual(2);
    });

    it('ignores undefined label sizes for compact layout and defaults to 2', () => {
      const testClass = customTestComponentFactory(ClrFormLayout.COMPACT, true, undefined);
      TestBed.configureTestingModule({ declarations: [ClrLayout, testClass] });
      const fixture = TestBed.createComponent(testClass);
      const service = fixture.debugElement.injector.get(LayoutService);
      fixture.detectChanges();

      expect(service.layout).toEqual(ClrFormLayout.COMPACT);
      expect(service.labelSize).toEqual(2);
    });
  });
}
