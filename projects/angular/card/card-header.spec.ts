/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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
  template: `
    <clr-card clrCardCollapsible>
      <clr-card-header clrHeadingLevel="2">Header text</clr-card-header>
    </clr-card>
  `,
  standalone: false,
})
class TestHeadingLevelComponent {}

@Component({
  template: `<clr-card-header>Standalone header</clr-card-header>`,
  standalone: false,
})
class StandaloneHeaderComponent {}

describe('ClrCardHeader', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, TestCollapsibleComponent, TestHeadingLevelComponent, StandaloneHeaderComponent],
      imports: [ClrCardModule],
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
    expect(standaloneFixture.nativeElement.querySelector('.clr-card-header-content').hasAttribute('id')).toBe(false);
  });

  it('gives clr-card-body-title-style heading semantics via clrHeadingLevel', () => {
    const fixture = TestBed.createComponent(TestHeadingLevelComponent);
    fixture.detectChanges();

    const content = fixture.debugElement
      .query(By.directive(ClrCardHeader))
      .nativeElement.querySelector('.clr-card-header-content');

    expect(content.getAttribute('role')).toBe('heading');
    expect(content.getAttribute('aria-level')).toBe('2');
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

    it('wraps the projected content in an element carrying the header content id', () => {
      const content = headerElement.querySelector('.clr-card-header-content');
      expect(content.getAttribute('id')).toBe(cardInstance.headerContentId);
      expect(content.textContent.trim()).toBe('Header text');
      expect(button.hasAttribute('id')).toBe(false);
    });

    it('renders a toggle button with the appropriate aria attributes', () => {
      expect(button).not.toBeNull();
      expect(button.getAttribute('aria-controls')).toBe(cardInstance.contentId);
      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(button.getAttribute('aria-label')).toBeTruthy();
      expect(button.getAttribute('aria-describedby')).toBe(cardInstance.headerContentId);
    });

    it('renders the header content outside of the toggle button', () => {
      expect(button.textContent.trim()).toBe('');
      expect(headerElement.textContent.trim()).toBe('Header text');
    });

    it('swaps aria-expanded and aria-label based on the expanded state', () => {
      const icon = headerElement.querySelector('cds-icon');
      expect(icon.getAttribute('shape')).toBe('angle');
      const collapseLabel = button.getAttribute('aria-label');

      button.click();
      fixture.detectChanges();

      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(button.getAttribute('aria-label')).not.toBe(collapseLabel);
    });

    it('toggles the card expanded state when the toggle button is clicked', () => {
      expect(cardInstance.expanded).toBe(true);

      button.click();
      fixture.detectChanges();
      expect(cardInstance.expanded).toBe(false);

      button.click();
      fixture.detectChanges();
      expect(cardInstance.expanded).toBe(true);
    });

    it('reflects a programmatic expanded change without a manual change detection subscription', () => {
      cardInstance.expanded = false;
      fixture.detectChanges();
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('does not toggle when clicking the header outside of the toggle button', () => {
      headerElement.click();
      fixture.detectChanges();
      expect(cardInstance.expanded).toBe(true);
    });
  });
});
