/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrCommonStringsService, HeadingLevel } from '@clr/angular/utils';

import { ClrWizard } from './wizard';
import { ClrWizardModule } from './wizard.module';

/**
 * The hosts are OnPush and never call `markForCheck()`. Every change below reaches the view only because the
 * wizard state is held in signals. The exhaustive `checkNoChanges` of the spec setup fails any view left stale.
 */
@Component({
  template: `
    <clr-wizard
      [clrWizardInPage]="true"
      [clrWizardPreventNavigation]="stopNavigation()"
      (clrWizardCurrentPageChange)="pageChanges.set(pageChanges() + 1)"
    >
      <clr-wizard-title [clrHeadingLevel]="titleLevel()">Zoneless wizard</clr-wizard-title>
      @if (showHeaderAction()) {
        <clr-wizard-header-action>Help</clr-wizard-header-action>
      }
      <clr-wizard-button type="cancel">Cancel</clr-wizard-button>
      <clr-wizard-button type="previous">Back</clr-wizard-button>
      <clr-wizard-button type="next">Next</clr-wizard-button>
      <clr-wizard-button type="finish">Finish</clr-wizard-button>

      @for (page of pages(); track page) {
        <clr-wizard-page
          #wizardPage
          [id]="page"
          [clrWizardPageNextDisabled]="page === invalidPage()"
          [clrWizardPageHasError]="page === errorPage()"
          (clrWizardPageOnLoad)="loaded.set(page)"
        >
          <ng-template clrPageTitle [clrHeadingLevel]="pageTitleLevel()">{{ page }} title</ng-template>
          <ng-template clrPageNavTitle>{{ page }}{{ wizardPage.completed ? ' done' : '' }}</ng-template>
          <p class="content">{{ page }} {{ note() }}</p>
        </clr-wizard-page>
      }
    </clr-wizard>
    <p class="loaded">{{ loaded() }} {{ pageChanges() }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class InPageWizardHost {
  @ViewChild(ClrWizard, { static: true }) wizard: ClrWizard;

  readonly pages = signal(['one', 'two', 'three']);
  readonly invalidPage = signal('');
  readonly errorPage = signal('');
  readonly stopNavigation = signal(false);
  readonly showHeaderAction = signal(false);
  readonly titleLevel = signal<HeadingLevel>(undefined);
  readonly pageTitleLevel = signal<HeadingLevel>(undefined);
  readonly note = signal('note');
  readonly loaded = signal('');
  readonly pageChanges = signal(0);
}

@Component({
  template: `
    <clr-wizard [(clrWizardOpen)]="open" [clrWizardPreventModalAnimation]="true">
      <clr-wizard-title>Modal wizard</clr-wizard-title>
      @if (showButtons()) {
        <clr-wizard-button type="next">Next</clr-wizard-button>
      }
      <clr-wizard-page>
        <ng-template clrPageTitle>First</ng-template>
        <ng-template clrPageButtons>
          <clr-wizard-button type="custom-next" class="custom">{{ customLabel() }}</clr-wizard-button>
        </ng-template>
      </clr-wizard-page>
      <clr-wizard-page>
        <ng-template clrPageTitle>Second</ng-template>
      </clr-wizard-page>
    </clr-wizard>
    <p class="open-state">{{ open }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class ModalWizardHost {
  @ViewChild(ClrWizard, { static: true }) wizard: ClrWizard;

  open = false;
  readonly showButtons = signal(false);
  readonly customLabel = signal('Custom');
}

describe('ClrWizard (zoneless, OnPush host)', () => {
  describe('in page', () => {
    let fixture: ComponentFixture<InPageWizardHost>;
    let host: InPageWizardHost;
    let wizard: ClrWizard;

    function element(): HTMLElement {
      return fixture.nativeElement;
    }

    function stepnavItems(): HTMLElement[] {
      return Array.from(element().querySelectorAll<HTMLElement>('.clr-wizard-stepnav-item'));
    }

    function stepClasses(name: string): boolean[] {
      return stepnavItems().map(item => item.classList.contains(name));
    }

    function stepTitles(): string[] {
      return stepnavItems().map(item => item.querySelector('.clr-wizard-stepnav-link-title').textContent.trim());
    }

    function activePage(): string {
      return element().querySelector('clr-wizard-page.active .content').textContent.trim();
    }

    function hiddenPages(): string[] {
      return Array.from(element().querySelectorAll('clr-wizard-page')).map(page => page.getAttribute('aria-hidden'));
    }

    function button(type: string): HTMLButtonElement {
      return element().querySelector(`clr-wizard-button[type="${type}"] button`);
    }

    function buttonHidden(type: string): string {
      return element().querySelector(`clr-wizard-button[type="${type}"]`).getAttribute('aria-hidden');
    }

    function pageTitle(): HTMLElement {
      return element().querySelector('.clr-wizard-page-title');
    }

    beforeEach(async () => {
      TestBed.configureTestingModule({ imports: [ClrWizardModule], declarations: [InPageWizardHost] });
      fixture = TestBed.createComponent(InPageWizardHost);
      host = fixture.componentInstance;
      wizard = host.wizard;
      await fixture.whenStable();
    });

    afterEach(() => fixture.destroy());

    it('renders the first page as current', () => {
      expect(stepClasses('active')).toEqual([true, false, false]);
      expect(activePage()).toBe('one note');
      expect(hiddenPages()).toEqual(['false', 'true', 'true']);
      expect(pageTitle().textContent.trim()).toBe('one title');
      expect(buttonHidden('previous')).toBe('true');
      expect(buttonHidden('next')).toBe('false');
      expect(buttonHidden('finish')).toBe('true');
      expect(element().querySelector('.loaded').textContent.trim()).toBe('one 1');
    });

    it('moves to the next page when the next button is clicked', async () => {
      button('next').click();
      await fixture.whenStable();

      expect(stepClasses('active')).toEqual([false, true, false]);
      expect(stepClasses('complete')).toEqual([true, false, false]);
      expect(stepTitles()).toEqual(['one done', 'two', 'three']);
      expect(activePage()).toBe('two note');
      expect(pageTitle().textContent.trim()).toBe('two title');
      expect(buttonHidden('previous')).toBe('false');
      expect(element().querySelector('.loaded').textContent.trim()).toBe('two 2');
    });

    it('follows the public API called outside a template event', async () => {
      wizard.next();
      await fixture.whenStable();
      expect(stepClasses('active')).toEqual([false, true, false]);

      wizard.navService.currentPage = wizard.pages.last;
      await fixture.whenStable();
      expect(stepClasses('active')).toEqual([false, false, true]);
      expect(buttonHidden('next')).toBe('true');
      expect(buttonHidden('finish')).toBe('false');
      expect(activePage()).toBe('three note');

      wizard.previous();
      await fixture.whenStable();
      expect(stepClasses('active')).toEqual([false, true, false]);

      wizard.goTo('clr-wizard-page-one');
      await fixture.whenStable();
      expect(stepClasses('active')).toEqual([true, false, false]);

      wizard.pages.get(1).completed = true;
      await fixture.whenStable();
      expect(stepClasses('complete')).toEqual([true, true, false]);
      expect(stepTitles()).toEqual(['one done', 'two done', 'three']);

      wizard.reset();
      await fixture.whenStable();
      expect(stepClasses('complete')).toEqual([false, false, false]);
      expect(stepClasses('active')).toEqual([true, false, false]);
    });

    it('disables the next button while the page is not ready', async () => {
      host.invalidPage.set('one');
      await fixture.whenStable();
      expect(button('next').disabled).toBe(true);

      host.invalidPage.set('');
      await fixture.whenStable();
      expect(button('next').disabled).toBe(false);
    });

    it('shows a page error on its step', async () => {
      wizard.next();
      host.errorPage.set('one');
      await fixture.whenStable();

      expect(stepClasses('error')).toEqual([true, false, false]);
    });

    it('disables every button and step while navigation is stopped', async () => {
      wizard.next();
      host.stopNavigation.set(true);
      await fixture.whenStable();

      expect(['cancel', 'previous', 'next'].map(type => button(type).disabled)).toEqual([true, true, true]);
      expect(stepClasses('disabled')).toEqual([true, true, true]);

      host.stopNavigation.set(false);
      await fixture.whenStable();
      expect(button('next').disabled).toBe(false);
      expect(stepClasses('disabled')).toEqual([false, false, true]);
    });

    it('lists pages added and removed after the first render', async () => {
      wizard.navService.currentPage = wizard.pages.last;
      await fixture.whenStable();
      expect(buttonHidden('finish')).toBe('false');

      host.pages.set(['one', 'two', 'three', 'four']);
      await fixture.whenStable();
      expect(stepTitles()).toEqual(['one', 'two', 'three', 'four']);
      expect(buttonHidden('next')).toBe('false');
      expect(buttonHidden('finish')).toBe('true');

      host.pages.set(['one', 'three', 'four']);
      await fixture.whenStable();
      expect(stepTitles()).toEqual(['one', 'three', 'four']);
      expect(stepClasses('active')).toEqual([false, true, false]);
    });

    it('shows header actions added after the first render', async () => {
      expect(element().querySelector('clr-wizard-header-action')).toBeNull();

      host.showHeaderAction.set(true);
      await fixture.whenStable();
      expect(element().querySelector('.clr-wizard-header-actions-wrapper clr-wizard-header-action')).not.toBeNull();

      host.showHeaderAction.set(false);
      await fixture.whenStable();
      expect(element().querySelector('.clr-wizard-header-actions-wrapper')).toBeNull();
    });

    it('follows the heading levels of the titles', async () => {
      const wizardTitle = () => element().querySelector('.clr-wizard-title').getAttribute('aria-level');
      expect(wizardTitle()).toBe('1');
      expect(pageTitle().getAttribute('aria-level')).toBe('2');

      host.titleLevel.set(3);
      host.pageTitleLevel.set(4);
      await fixture.whenStable();
      expect(wizardTitle()).toBe('3');
      expect(pageTitle().getAttribute('aria-level')).toBe('4');
    });

    it('refreshes projected content and templates that read consumer state', async () => {
      host.note.set('changed');
      await fixture.whenStable();

      expect(activePage()).toBe('one changed');
    });

    it('follows strings localized after the first render', async () => {
      TestBed.inject(ClrCommonStringsService).localize({ wizardStep: 'Etape', close: 'Fermer' });
      await fixture.whenStable();

      expect(stepnavItems()[0].querySelector('.clr-sr-only').textContent).toBe('Etape');
    });

    it('releases its subscriptions on destroy', () => {
      const navService = wizard.navService;
      const subscriptions = wizard['subscriptions'];

      fixture.destroy();

      expect(navService.nextButtonSubscription.closed).toBe(true);
      expect(navService.pagesResetSubscription.closed).toBe(true);
      expect(subscriptions.every(subscription => subscription.closed)).toBe(true);
    });
  });

  describe('modal', () => {
    let fixture: ComponentFixture<ModalWizardHost>;
    let host: ModalWizardHost;

    function element(): HTMLElement {
      return fixture.nativeElement;
    }

    beforeEach(async () => {
      TestBed.configureTestingModule({ imports: [ClrWizardModule], declarations: [ModalWizardHost] });
      fixture = TestBed.createComponent(ModalWizardHost);
      host = fixture.componentInstance;
      await fixture.whenStable();
    });

    afterEach(() => fixture.destroy());

    it('opens and closes from the public API', async () => {
      expect(element().querySelector('.modal')).toBeNull();

      host.wizard.open();
      await fixture.whenStable();
      expect(element().querySelector('.modal')).not.toBeNull();
      expect(element().querySelector('.open-state').textContent).toBe('true');
      expect(element().querySelector('.clr-wizard-page-title').textContent.trim()).toBe('First');

      host.wizard.close();
      await fixture.whenStable();
      expect(element().querySelector('.modal')).toBeNull();
      expect(element().querySelector('.open-state').textContent).toBe('false');
    });

    it('renders the page buttons template with consumer state', async () => {
      host.wizard.open();
      await fixture.whenStable();
      const custom = () => element().querySelector('.clr-wizard-footer clr-wizard-button.custom');
      expect(custom().textContent.trim()).toBe('Custom');

      host.customLabel.set('Changed');
      await fixture.whenStable();
      expect(custom().textContent.trim()).toBe('Changed');

      host.wizard.next();
      await fixture.whenStable();
      expect(custom()).toBeNull();
      expect(element().querySelector('.clr-wizard-footer')).toBeNull();
    });

    it('shows the footer for wizard buttons added after the first render', async () => {
      host.wizard.open();
      host.wizard.next();
      await fixture.whenStable();
      expect(element().querySelector('.clr-wizard-footer')).toBeNull();

      host.showButtons.set(true);
      await fixture.whenStable();
      expect(element().querySelector('.clr-wizard-footer clr-wizard-button')).not.toBeNull();
    });
  });
});
