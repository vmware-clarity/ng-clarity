/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrCard } from './card';
import { ClrCardHeader } from './card-header';
import { ClrCardModule } from './card.module';

@Component({
  template: `
    <clr-card>
      <clr-card-header>Header text</clr-card-header>
    </clr-card>
  `,
  standalone: false,
})
class TestComponent {}

@Component({
  template: `
    <clr-card clrCardCollapsible>
      <clr-card-header>Header text</clr-card-header>
    </clr-card>
  `,
  standalone: false,
})
class TestCollapsibleComponent {}

@Component({
  template: `<clr-card-header>Standalone header</clr-card-header>`,
  standalone: false,
})
class StandaloneHeaderComponent {}

describe('ClrCardHeader', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, TestCollapsibleComponent, StandaloneHeaderComponent],
      imports: [ClrCardModule, NoopAnimationsModule],
    });
  });

  describe('when the parent card is not collapsible', () => {
    let fixture: ComponentFixture<TestComponent>;
    let headerElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      headerElement = fixture.debugElement.query(By.directive(ClrCardHeader)).nativeElement;
    });

    it('adds .card-header and .clr-card-header classes on the host element', () => {
      expect(headerElement.classList.contains('card-header')).toBe(true);
      expect(headerElement.classList.contains('clr-card-header')).toBe(true);
    });

    it('renders plain content with no toggle button', () => {
      expect(headerElement.querySelector('button')).toBeNull();
      expect(headerElement.textContent.trim()).toBe('Header text');
    });
  });

  it('works outside of a clr-card without throwing', () => {
    const standaloneFixture = TestBed.createComponent(StandaloneHeaderComponent);
    expect(() => standaloneFixture.detectChanges()).not.toThrow();
    expect(standaloneFixture.nativeElement.textContent.trim()).toBe('Standalone header');
  });

  describe('when the parent card is collapsible', () => {
    let fixture: ComponentFixture<TestCollapsibleComponent>;
    let headerElement: HTMLElement;
    let cardInstance: ClrCard;
    let button: HTMLButtonElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestCollapsibleComponent);
      fixture.detectChanges();
      headerElement = fixture.debugElement.query(By.directive(ClrCardHeader)).nativeElement;
      cardInstance = fixture.debugElement.query(By.directive(ClrCard)).componentInstance;
      button = headerElement.querySelector('button');
    });

    it('gives the header element (not the toggle button) the header id', () => {
      expect(headerElement.getAttribute('id')).toBe(cardInstance.headerId);
      expect(button.hasAttribute('id')).toBe(false);
    });

    it('renders a toggle button with the appropriate aria attributes', () => {
      expect(button).not.toBeNull();
      expect(button.getAttribute('aria-controls')).toBe(cardInstance.contentId);
      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(button.getAttribute('aria-label')).toBeTruthy();
    });

    it('renders the header content outside of the toggle button', () => {
      expect(button.textContent.trim()).toBe('');
      expect(headerElement.textContent.trim()).toBe('Header text');
    });

    it('swaps the icon rotation class and aria-label based on expand state', () => {
      const icon = headerElement.querySelector('cds-icon');
      expect(icon.getAttribute('shape')).toBe('angle');
      expect(icon.classList.contains('expanded')).toBe(true);
      const collapseLabel = button.getAttribute('aria-label');

      button.click();
      fixture.detectChanges();

      expect(icon.classList.contains('expanded')).toBe(false);
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(button.getAttribute('aria-label')).not.toBe(collapseLabel);
    });

    it('toggles the card expand state when the toggle button is clicked', () => {
      expect(cardInstance.expandService.expanded).toBe(true);

      button.click();
      fixture.detectChanges();
      expect(cardInstance.expandService.expanded).toBe(false);

      button.click();
      fixture.detectChanges();
      expect(cardInstance.expandService.expanded).toBe(true);
    });

    it('does not toggle when clicking the header outside of the toggle button', () => {
      headerElement.click();
      fixture.detectChanges();
      expect(cardInstance.expandService.expanded).toBe(true);
    });
  });
});
