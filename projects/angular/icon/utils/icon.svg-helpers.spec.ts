/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrIcon } from '../icon.component';
import { ClarityIcons } from '../icon.service';
import { hasAlertBadge } from './icon.svg-helpers';
import { IconShapeCollection } from '../interfaces/icon.interfaces';

const testIcon: IconShapeCollection = {
  outline: '<path d="outline-svg"></path>',
  solid: '<path d="solid-svg"></path>',
  outlineBadged: '<path d-="outline-badged-svg"></path>',
  outlineAlerted: '<path d="outline-alerted-svg"></path>',
  solidBadged: '<path d="solid-badged-svg"></path>',
  solidAlerted: '<path d="solid-alerted-svg"></path>',
};

@Component({
  template: ` <cds-icon shape="test"></cds-icon> `,
  standalone: false,
})
class TestComponent {
  @ViewChild(ClrIcon) icon: ClrIcon;
}

/**
 * Test helper function to get the innerHTML of the <svg> element
 * from the icon's shadowRoot, avoiding the <style> tag.
 */
function getSvgContent(element: HTMLElement): string {
  const svg = element.shadowRoot?.querySelector('svg');
  if (!svg) {
    return '<!-- SVG element not found in shadowRoot -->';
  }
  return svg.innerHTML;
}

describe('icon svg helpers:', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: ClrIcon;
  let nativeElement: HTMLElement;

  beforeAll(() => {
    ClarityIcons.addIcons(['test', testIcon]);
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ClrIcon],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    component = fixture.componentInstance.icon;
    nativeElement = component.el.nativeElement;
  });

  it('should check if icon has a alert style badge', async () => {
    component.badge = 'warning-triangle';
    fixture.detectChanges();
    expect(hasAlertBadge(component)).toBe(true);
  });

  it('should get alert badge svg template', async () => {
    component.badge = 'warning-triangle';
    fixture.detectChanges();
    // Use the helper function here
    expect(getSvgContent(nativeElement)).toContain('alert');
    expect(getSvgContent(nativeElement)).not.toContain('badge');
  });

  it('should get circle badge svg template', async () => {
    component.badge = true;
    fixture.detectChanges();
    // Use the helper function here
    expect(getSvgContent(nativeElement)).toContain('badge');
    expect(getSvgContent(nativeElement)).not.toContain('alert');
  });

  it('should get icon svg template', async () => {
    fixture.detectChanges();
    // Use the helper function here
    expect(getSvgContent(nativeElement)).toContain(testIcon.outline);

    component.badge = 'success';
    fixture.detectChanges();
    expect(getSvgContent(nativeElement)).toContain(testIcon.outlineBadged);

    component.badge = 'warning-triangle';
    fixture.detectChanges();
    expect(getSvgContent(nativeElement)).toContain(testIcon.outlineAlerted);

    component.solid = true;
    component.badge = false;
    fixture.detectChanges();
    expect(getSvgContent(nativeElement)).toContain(testIcon.solid);

    component.solid = true;
    component.badge = 'success';
    fixture.detectChanges();
    expect(getSvgContent(nativeElement)).toContain(testIcon.solidBadged);

    component.solid = true;
    component.badge = 'warning-triangle';
    fixture.detectChanges();
    expect(getSvgContent(nativeElement)).toContain(testIcon.solidAlerted);
  });
});
