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
import { ClrCardModule } from './card.module';

@Component({
  template: `
    <clr-card
      [clrCardCollapsible]="collapsible"
      [(clrCardExpanded)]="expanded"
      (clrCardExpandedChange)="change($event)"
    >
      <clr-card-header>Header</clr-card-header>
      <clr-card-body>
        <clr-card-body-text>Body text</clr-card-body-text>
      </clr-card-body>
    </clr-card>
  `,
  standalone: false,
})
class TestComponent {
  collapsible = false;
  expanded = true;
  change = (state: boolean) => state;
}

@Component({
  template: `
    <clr-card clrCardCollapsible (clrCardExpandedChange)="change($event)">
      <clr-card-header>Header</clr-card-header>
      <clr-card-body>Body</clr-card-body>
    </clr-card>
  `,
  standalone: false,
})
class TestNoBindingComponent {
  change = (state: boolean) => state;
}

@Component({
  template: `
    <clr-card clrCardCollapsible clrCardExpanded>
      <clr-card-header>Header</clr-card-header>
      <clr-card-body>Body</clr-card-body>
    </clr-card>
  `,
  standalone: false,
})
class TestBareAttributeComponent {}

@Component({
  template: `
    <clr-card clrCardCollapsible [clrCardFooterCollapsible]="footerCollapsible" [(clrCardExpanded)]="expanded">
      <clr-card-header>Header</clr-card-header>
      <clr-card-body>
        <clr-card-body-text>Body text</clr-card-body-text>
      </clr-card-body>
      <clr-card-footer>Footer text</clr-card-footer>
    </clr-card>
  `,
  standalone: false,
})
class TestCollapsibleComponent {
  expanded = true;
  footerCollapsible = true;
}

@Component({
  template: `
    <clr-card clrCardCollapsible [clrCardExpanded]="false">
      <clr-card-header>Header</clr-card-header>
      <clr-card-body>
        <clr-card-body-text>Body text</clr-card-body-text>
      </clr-card-body>
    </clr-card>
  `,
  standalone: false,
})
class TestInitiallyCollapsedComponent {}

@Component({
  template: `
    <clr-card clrCardCollapsible>
      <clr-card-header>First header</clr-card-header>
      <clr-card-body>First body</clr-card-body>
    </clr-card>
    <clr-card clrCardCollapsible>
      <clr-card-header>Second header</clr-card-header>
      <clr-card-body>Second body</clr-card-body>
    </clr-card>
  `,
  standalone: false,
})
class TestTwoCardsComponent {}

describe('ClrCard', () => {
  describe('TypeScript API', () => {
    let fixture: ComponentFixture<ClrCard>;
    let card: ClrCard;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrCardModule],
      });

      fixture = TestBed.createComponent(ClrCard);
      fixture.detectChanges();
      card = fixture.componentInstance;
    });

    it('defaults to expanded and not collapsible', () => {
      expect(card.expanded).toBe(true);
      expect(card.collapsible).toBe(false);
    });

    it('toggle() flips the expanded state and emits, only when collapsible', () => {
      const emitted: boolean[] = [];
      card.expandedChange.subscribe((value: boolean) => emitted.push(value));

      card.toggle();
      expect(card.expanded).toBe(true);
      expect(emitted).toEqual([]);

      card.collapsible = true;
      card.toggle();
      expect(card.expanded).toBe(false);
      card.toggle();
      expect(card.expanded).toBe(true);
      expect(emitted).toEqual([false, true]);
    });

    it('setting expanded programmatically does not emit', () => {
      const emitted: boolean[] = [];
      card.expandedChange.subscribe((value: boolean) => emitted.push(value));

      card.collapsible = true;
      card.expanded = false;
      expect(card.expanded).toBe(false);
      expect(emitted).toEqual([]);
    });
  });

  describe('Template API', () => {
    let fixture: ComponentFixture<TestComponent>;
    let testComponent: TestComponent;
    let cardInstance: ClrCard;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, TestNoBindingComponent, TestBareAttributeComponent],
        imports: [ClrCardModule],
      });

      fixture = TestBed.createComponent(TestComponent);
      fixture.componentInstance.collapsible = true;
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      cardInstance = fixture.debugElement.query(By.directive(ClrCard)).componentInstance;
    });

    it('offers a [(clrCardExpanded)] two-way binding', () => {
      testComponent.expanded = false;
      fixture.detectChanges();
      expect(cardInstance.expanded).toBe(false);

      cardInstance.toggle();
      fixture.detectChanges();
      expect(testComponent.expanded).toBe(true);
    });

    it('accepts clrCardExpanded as a bare attribute', () => {
      const bareFixture = TestBed.createComponent(TestBareAttributeComponent);
      bareFixture.detectChanges();
      const card = bareFixture.debugElement.query(By.directive(ClrCard)).componentInstance as ClrCard;
      expect(card.expanded).toBe(true);
    });

    describe('Output (clrCardExpandedChange)', () => {
      it('emits a value without a [clrCardExpanded] binding present', () => {
        const noBindingFixture = TestBed.createComponent(TestNoBindingComponent);
        const component = noBindingFixture.componentInstance;
        spyOn(component, 'change');

        noBindingFixture.detectChanges();
        const card = noBindingFixture.debugElement.query(By.directive(ClrCard)).componentInstance as ClrCard;

        card.toggle();
        expect(component.change).toHaveBeenCalledWith(false);

        card.toggle();
        expect(component.change).toHaveBeenCalledWith(true);
      });

      it('does not emit when the input is changed programmatically', () => {
        spyOn(testComponent, 'change');
        testComponent.expanded = false;
        fixture.detectChanges();
        expect(testComponent.change).not.toHaveBeenCalled();
      });
    });
  });

  describe('View', () => {
    let fixture: ComponentFixture<TestComponent>;
    let cardElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [ClrCardModule],
      });

      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      cardElement = fixture.debugElement.query(By.directive(ClrCard)).nativeElement;
    });

    it('adds .card and .clr-card classes on the host element', () => {
      expect(cardElement.classList.contains('card')).toBe(true);
      expect(cardElement.classList.contains('clr-card')).toBe(true);
      expect(cardElement.classList.contains('card-collapsible')).toBe(false);
    });

    it('projects the header before the rest of the content', () => {
      const text = fixture.nativeElement.textContent;
      expect(text.indexOf('Header')).toBeLessThan(text.indexOf('Body text'));
    });

    it('does not render a region when not collapsible', () => {
      expect(cardElement.querySelector('[role="region"]')).toBeNull();
    });

    it('renders the region and the header toggle once made collapsible at runtime', () => {
      fixture.componentInstance.collapsible = true;
      fixture.detectChanges();

      expect(cardElement.classList.contains('card-collapsible')).toBe(true);
      expect(cardElement.querySelector('[role="region"]')).not.toBeNull();
      expect(cardElement.querySelector('clr-card-header button')).not.toBeNull();
    });
  });

  describe('View (collapsible)', () => {
    let fixture: ComponentFixture<TestCollapsibleComponent>;
    let cardElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestCollapsibleComponent],
        imports: [ClrCardModule],
      });

      fixture = TestBed.createComponent(TestCollapsibleComponent);
      fixture.detectChanges();
      cardElement = fixture.debugElement.query(By.directive(ClrCard)).nativeElement;
    });

    it('renders a region labelled by the header content, not the header toggle', () => {
      const region = cardElement.querySelector('[role="region"]');
      const headerContent = cardElement.querySelector('.clr-card-header-content');

      expect(region).not.toBeNull();
      expect(region.getAttribute('aria-hidden')).toBe('false');
      expect(region.hasAttribute('inert')).toBe(false);
      expect(region.getAttribute('aria-labelledby')).toBe(headerContent.getAttribute('id'));
      expect(headerContent.querySelector('button')).toBeNull();
    });

    it('applies the CSS state classes used by the CSS-only card', () => {
      expect(cardElement.classList.contains('card-collapsible')).toBe(true);
      expect(cardElement.classList.contains('card-collapsed')).toBe(false);
      expect(cardElement.querySelector('.card-collapsible-content > .card-collapsible-inner')).not.toBeNull();

      fixture.componentInstance.expanded = false;
      fixture.detectChanges();
      expect(cardElement.classList.contains('card-collapsed')).toBe(true);
    });

    it('keeps the body in the DOM but hides it from assistive tech and focus once collapsed', () => {
      fixture.componentInstance.expanded = false;
      fixture.detectChanges();

      const region = cardElement.querySelector('[role="region"]');
      expect(region.getAttribute('aria-hidden')).toBe('true');
      expect(region.hasAttribute('inert')).toBe(true);
      expect(region.textContent).toContain('Body text');
    });

    it('collapses via the header toggle button', () => {
      const headerButton = cardElement.querySelector<HTMLButtonElement>('button');
      headerButton.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.expanded).toBe(false);
      expect(cardElement.querySelector('[role="region"]').getAttribute('aria-hidden')).toBe('true');
    });

    it('collapses the footer along with the body by default', () => {
      const region = cardElement.querySelector('[role="region"]');
      expect(region.textContent).toContain('Footer text');
    });

    it('keeps the footer visible while collapsed when clrCardFooterCollapsible is false', () => {
      fixture.componentInstance.footerCollapsible = false;
      fixture.componentInstance.expanded = false;
      fixture.detectChanges();

      const region = cardElement.querySelector('[role="region"]');
      expect(region.textContent).not.toContain('Footer text');
      expect(cardElement.textContent).toContain('Footer text');
    });

    it('keeps the footer outside the collapsible region while expanded when clrCardFooterCollapsible is false', () => {
      fixture.componentInstance.footerCollapsible = false;
      fixture.detectChanges();

      const region = cardElement.querySelector('[role="region"]');
      expect(region.textContent).toContain('Body text');
      expect(region.textContent).not.toContain('Footer text');
      expect(cardElement.textContent).toContain('Footer text');
    });
  });

  describe('initial render', () => {
    it('starts collapsed when [clrCardExpanded]="false" is set from the start', () => {
      TestBed.configureTestingModule({
        declarations: [TestInitiallyCollapsedComponent],
        imports: [ClrCardModule],
      });

      const fixture = TestBed.createComponent(TestInitiallyCollapsedComponent);
      fixture.detectChanges();

      const cardElement = fixture.debugElement.query(By.directive(ClrCard)).nativeElement as HTMLElement;
      const region = cardElement.querySelector('[role="region"]');

      expect(cardElement.classList.contains('card-collapsed')).toBe(true);
      expect(region.getAttribute('aria-hidden')).toBe('true');
      expect(region.hasAttribute('inert')).toBe(true);
    });
  });

  describe('multiple cards', () => {
    it('generates unique header/content ids across two cards on the same page', () => {
      TestBed.configureTestingModule({
        declarations: [TestTwoCardsComponent],
        imports: [ClrCardModule],
      });

      const fixture = TestBed.createComponent(TestTwoCardsComponent);
      fixture.detectChanges();

      const cards = fixture.debugElement.queryAll(By.directive(ClrCard)).map(el => el.componentInstance as ClrCard);

      expect(cards.length).toBe(2);
      expect(cards[0].headerContentId).not.toBe(cards[1].headerContentId);
      expect(cards[0].contentId).not.toBe(cards[1].contentId);
    });
  });
});
