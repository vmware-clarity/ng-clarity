/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarityIcons, ClrIcon, windowCloseIcon } from '@clr/angular/icon';

import { DismissableDirective } from './dismissable.directive';

@Component({
  template: `
    @if (show) {
      <span class="badge" dismissable [dismissAriaLabel]="ariaLabel" (dismiss)="dismissed = dismissed + 1">
        badge text
      </span>
    }
  `,
  standalone: false,
})
class TestComponent {
  ariaLabel = 'Remove filter';
  dismissed = 0;
  show = true;
}

describe('Directive: DismissableDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let badge: HTMLElement;
  let icon: HTMLElement;

  beforeEach(() => {
    ClarityIcons.addIcons(windowCloseIcon);
    TestBed.configureTestingModule({
      imports: [ClrIcon],
      declarations: [DismissableDirective, TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    badge = fixture.nativeElement.querySelector('.badge');
    icon = badge.querySelector('cds-icon.remove-filter');
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('renders a window-close icon inside the badge', () => {
    expect(icon).toBeTruthy();
    expect(icon.getAttribute('shape')).toEqual('window-close');
    expect(icon.getAttribute('role')).toEqual('button');
    expect(icon.getAttribute('tabindex')).toEqual('0');
    expect(icon.getAttribute('aria-label')).toEqual('Remove filter');
    expect(icon.style.cursor).toEqual('pointer');
  });

  it('renders the icon SVG (the icon is an Angular component, not an empty element)', () => {
    const svg = icon.shadowRoot ? icon.shadowRoot.querySelector('svg') : icon.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.innerHTML).toContain('path');
  });

  it('emits dismiss on click', () => {
    icon.click();
    expect(component.dismissed).toEqual(1);
  });

  it('emits dismiss on Enter and Space keys only', () => {
    icon.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(component.dismissed).toEqual(1);
    icon.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space' }));
    expect(component.dismissed).toEqual(2);
    icon.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(component.dismissed).toEqual(2);
  });

  it('removes the icon together with the badge', () => {
    component.show = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('cds-icon')).toBeNull();
    expect(document.body.contains(icon)).toBeFalse();
  });
});
