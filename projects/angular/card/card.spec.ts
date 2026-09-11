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
import { ClrCardModule } from './card.module';

@Component({
  template: `
    <clr-card
      [clrCardCollapsible]="collapsible"
      [(clrCardCollapsed)]="collapsed"
      (clrCardCollapsedChange)="change($event)"
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
  collapsed = false;
  change = (state: boolean) => state;
}

@Component({
  template: `
    <clr-card clrCardCollapsible (clrCardCollapsedChange)="change($event)">
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
    <clr-card clrCardCollapsible [clrCardFooterCollapsible]="footerCollapsible" [(clrCardCollapsed)]="collapsed">
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
  collapsed = false;
  footerCollapsible = true;
}

describe('ClrCard', () => {
  describe('TypeScript API', () => {
    let fixture: ComponentFixture<ClrCard>;
    let card: ClrCard;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrCardModule, NoopAnimationsModule],
      });

      fixture = TestBed.createComponent(ClrCard);
      fixture.detectChanges();
      card = fixture.componentInstance;
    });

    it('defaults to expanded (not collapsed)', () => {
      expect(card.collapsed).toBe(false);
      expect(card.expandService.expanded).toBe(true);
    });

    it('setting collapsed proxies the underlying expand service', () => {
      card.collapsed = true;
      expect(card.expandService.expanded).toBe(false);

      card.collapsed = false;
      expect(card.expandService.expanded).toBe(true);
    });
  });

  describe('Template API', () => {
    let fixture: ComponentFixture<TestComponent>;
    let testComponent: TestComponent;
    let cardInstance: ClrCard;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, TestNoBindingComponent],
        imports: [ClrCardModule, NoopAnimationsModule],
      });

      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      cardInstance = fixture.debugElement.query(By.directive(ClrCard)).componentInstance;
    });

    it('offers a [(clrCardCollapsed)] two-way binding', () => {
      testComponent.collapsed = true;
      fixture.detectChanges();
      expect(cardInstance.collapsed).toBe(true);

      cardInstance.expandService.toggle();
      fixture.detectChanges();
      expect(testComponent.collapsed).toBe(false);
    });

    describe('Output (clrCardCollapsedChange)', () => {
      it('emits a value without a [clrCardCollapsed] binding present', () => {
        const noBindingFixture = TestBed.createComponent(TestNoBindingComponent);
        const component = noBindingFixture.componentInstance;
        spyOn(component, 'change');

        noBindingFixture.detectChanges();
        const card = noBindingFixture.debugElement.query(By.directive(ClrCard)).componentInstance as ClrCard;

        card.expandService.toggle();
        expect(component.change).toHaveBeenCalledWith(true);

        card.expandService.toggle();
        expect(component.change).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('View', () => {
    let fixture: ComponentFixture<TestComponent>;
    let cardElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, TestNoBindingComponent],
        imports: [ClrCardModule, NoopAnimationsModule],
      });

      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      cardElement = fixture.debugElement.query(By.directive(ClrCard)).nativeElement;
    });

    it('adds .card and .clr-card classes on the host element', () => {
      expect(cardElement.classList.contains('card')).toBe(true);
      expect(cardElement.classList.contains('clr-card')).toBe(true);
    });

    it('projects the header before the rest of the content', () => {
      const text = fixture.nativeElement.textContent;
      expect(text.indexOf('Header')).toBeLessThan(text.indexOf('Body text'));
    });

    it('does not render a region when not collapsible', () => {
      expect(cardElement.querySelector('[role="region"]')).toBeNull();
    });
  });

  describe('View (collapsible)', () => {
    let fixture: ComponentFixture<TestCollapsibleComponent>;
    let cardElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestCollapsibleComponent],
        imports: [ClrCardModule, NoopAnimationsModule],
      });

      fixture = TestBed.createComponent(TestCollapsibleComponent);
      fixture.detectChanges();
      cardElement = fixture.debugElement.query(By.directive(ClrCard)).nativeElement;
    });

    it('renders an aria-labelled region', () => {
      const region = cardElement.querySelector('[role="region"]');
      const header = cardElement.querySelector('clr-card-header');

      expect(region).not.toBeNull();
      expect(region.getAttribute('aria-hidden')).toBe('false');
      expect(region.getAttribute('aria-labelledby')).toBe(header.getAttribute('id'));
    });

    it('projects the body content while expanded', () => {
      expect(cardElement.textContent).toContain('Body text');
    });

    it('hides the region from assistive tech once collapsed', () => {
      fixture.componentInstance.collapsed = true;
      fixture.detectChanges();

      const region = cardElement.querySelector('[role="region"]');
      expect(region.getAttribute('aria-hidden')).toBe('true');
    });

    it('re-hides the region once collapsed via the header toggle button', () => {
      const headerButton = cardElement.querySelector('button');
      headerButton.click();
      fixture.detectChanges();

      const region = cardElement.querySelector('[role="region"]');
      expect(region.getAttribute('aria-hidden')).toBe('true');
    });

    it('collapses the footer along with the body by default', async () => {
      fixture.componentInstance.collapsed = true;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(cardElement.textContent).not.toContain('Footer text');
    });

    it('keeps the footer visible while collapsed when clrCardFooterCollapsible is false', async () => {
      fixture.componentInstance.footerCollapsible = false;
      fixture.componentInstance.collapsed = true;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(cardElement.textContent).not.toContain('Body text');
      expect(cardElement.textContent).toContain('Footer text');
    });

    it('still renders the footer inside the collapsible region when expanded and clrCardFooterCollapsible is false', () => {
      fixture.componentInstance.footerCollapsible = false;
      fixture.detectChanges();

      expect(cardElement.textContent).toContain('Body text');
      expect(cardElement.textContent).toContain('Footer text');
    });
  });
});
