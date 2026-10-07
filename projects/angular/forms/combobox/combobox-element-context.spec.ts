/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClrContextEngineService } from '@clr/angular/ai';
import { ClrComponentContext, ClrLoadingModule } from '@clr/angular/utils';

import { ClrComboboxModule } from './combobox.module';

type ElementContextCallback = (options: { maxItemsPerCollection?: number; collectionItems?: string }) => {
  type: string;
  state: Record<string, unknown>;
};

@Component({
  template: `
    <clr-combobox name="fruit" [(ngModel)]="selection">
      <clr-options>
        <clr-option clrValue="apple">Apple</clr-option>
        <clr-option clrValue="pear">Pear</clr-option>
      </clr-options>
    </clr-combobox>
  `,
  standalone: false,
})
class TestComponent {
  selection: string | null = 'apple';
}

describe('ClrCombobox element context', () => {
  let fixture: ComponentFixture<TestComponent>;
  let host: HTMLElement;

  function publishedContext(options: Parameters<ElementContextCallback>[0] = {}) {
    const callback = (host as HTMLElement & { clrElementContext?: ElementContextCallback }).clrElementContext;
    if (!callback) {
      throw new Error('expected the combobox to publish a clrElementContext callback');
    }
    return callback(options);
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ClrComboboxModule, FormsModule, NoopAnimationsModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    host = fixture.nativeElement.querySelector('clr-combobox');
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('publishes a context callback on its host element', () => {
    const context = publishedContext();

    expect(context.type).toBe('combobox');
    expect(context.state.multiSelect).toBe(false);
  });

  it('lists its options even while the popover is closed', () => {
    const context = publishedContext({ maxItemsPerCollection: 25 });

    expect(context.state.options).toEqual(['Apple', 'Pear']);
    expect(context.state.optionsAvailable).toBeUndefined();
  });

  it('exposes the current selection, which a closed popover does not show', () => {
    expect(publishedContext().state.value).toBe('Apple');
  });

  it('lists the same options while the popover is open, without screen reader additions', () => {
    fixture.nativeElement.querySelector('button.clr-combobox-trigger').click();
    fixture.detectChanges();

    const context = publishedContext({ maxItemsPerCollection: 25 });

    expect(context.state.options).toEqual(['Apple', 'Pear']);
  });

  it('is described once while open, not again as the list in its overlay', () => {
    fixture.nativeElement.querySelector('button.clr-combobox-trigger').click();
    fixture.detectChanges();

    const types: string[] = [];
    const visit = (nodes: ClrComponentContext[]) =>
      nodes.forEach(node => {
        types.push(node.type);
        visit(node.children ?? []);
      });
    visit(TestBed.inject(ClrContextEngineService).getSnapshot().components);

    expect(document.querySelector('[role="listbox"]')).not.toBeNull();
    expect(types).toContain('combobox');
    expect(types).not.toContain('listbox');
    expect(types).not.toContain('dialog');
  });

  it('caps the option list to the collection budget', () => {
    expect(publishedContext({ maxItemsPerCollection: 1 }).state.options).toEqual(['Apple']);
  });

  it('removes the callback when the combobox is destroyed', () => {
    fixture.destroy();

    expect((host as HTMLElement & { clrElementContext?: unknown }).clrElementContext).toBeUndefined();
  });
});

@Component({
  template: `
    <clr-combobox name="fruits" [(ngModel)]="selection" clrMulti="true">
      <clr-options>
        <clr-option clrValue="apple">Apple</clr-option>
        <clr-option clrValue="pear">Pear</clr-option>
        <clr-option clrValue="plum">Plum</clr-option>
      </clr-options>
    </clr-combobox>
    <clr-combobox name="async" [(ngModel)]="asyncSelection" class="async"></clr-combobox>
    <clr-combobox name="account" [(ngModel)]="account" class="object"></clr-combobox>
  `,
  standalone: false,
})
class MoreShapesTestComponent {
  selection: string[] = ['apple', 'plum'];
  asyncSelection: string | null = null;
  account: object | null = { id: 42, email: 'hidden@example.com', internalNote: 'do not show' };
}

describe('ClrCombobox element context, other shapes', () => {
  let fixture: ComponentFixture<MoreShapesTestComponent>;

  function publishedOn(selector: string): ReturnType<ElementContextCallback> {
    const host = fixture.nativeElement.querySelector(selector) as HTMLElement & {
      clrElementContext?: ElementContextCallback;
    };
    const callback = host.clrElementContext;
    if (!callback) {
      throw new Error('expected the combobox to publish a clrElementContext callback');
    }
    return callback({});
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ClrComboboxModule, FormsModule, NoopAnimationsModule],
      declarations: [MoreShapesTestComponent],
    });
    fixture = TestBed.createComponent(MoreShapesTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('reports every selected value of a multi-select combobox', () => {
    const context = publishedOn('clr-combobox');
    expect(context.state.multiSelect).toBe(true);
    expect(context.state.value).toEqual(['Apple', 'Plum']);
  });

  it('is not described again through its selection pills, which would count the selection', () => {
    const grids: ClrComponentContext[] = [];
    const visit = (nodes: ClrComponentContext[]) =>
      nodes.forEach(node => {
        if (node.type === 'grid') {
          grids.push(node);
        }
        visit(node.children ?? []);
      });
    visit(TestBed.inject(ClrContextEngineService).getSnapshot().components);

    expect(fixture.nativeElement.querySelector('.clr-combobox-pills[role="grid"]')).not.toBeNull();
    expect(grids).toEqual([]);
  });

  it('says that an async combobox has no options until a search loads them', () => {
    const context = publishedOn('clr-combobox.async');
    expect(context.state.optionsAvailable).toBe(false);
    expect('options' in context.state).toBe(false);
  });

  it('never publishes a model object it has no label for', async () => {
    await fixture.whenStable();
    const context = publishedOn('clr-combobox.object');

    expect(context.state.value).toBeNull();
    expect(JSON.stringify(context)).not.toContain('hidden@example.com');
  });
});

@Component({
  template: `
    <clr-combobox name="card" [(ngModel)]="selection">
      <clr-options>
        <clr-option clrValue="visa">Visa <span data-clr-context-redact>4111 1111</span></clr-option>
        <clr-option clrValue="amex">Amex <span data-clr-context-redact>3782 8224</span></clr-option>
        <clr-option clrValue="6011 0000"><span data-clr-context-redact>6011 0000</span></clr-option>
      </clr-options>
    </clr-combobox>
  `,
  standalone: false,
})
class SecretOptionTestComponent {
  selection: string | null = 'visa';
}

describe('ClrCombobox element context, withheld option text', () => {
  let fixture: ComponentFixture<SecretOptionTestComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ClrComboboxModule, FormsModule, NoopAnimationsModule],
      declarations: [SecretOptionTestComponent],
    });
    fixture = TestBed.createComponent(SecretOptionTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('labels options and the selection without the text of a redacted element inside them', () => {
    const host = fixture.nativeElement.querySelector('clr-combobox') as HTMLElement & {
      clrElementContext?: ElementContextCallback;
    };
    const context = host.clrElementContext?.({});

    expect(context?.state['value']).toBe('Visa');
    expect(JSON.stringify(context)).not.toContain('4111');
    expect(JSON.stringify(context)).not.toContain('3782');
    // Nor by its value when all its text is withheld: the value is often the same secret.
    expect(JSON.stringify(context)).not.toContain('6011');
  });
});

@Component({
  template: `
    <clr-combobox name="account" [(ngModel)]="selection" clrMulti="true">
      <clr-options>
        <clr-option clrValue="checking">Checking</clr-option>
        <clr-option clrValue="acct" data-clr-context-redact>Acct 998877</clr-option>
        <clr-option clrValue="trust" class="secret">Hidden trust fund</clr-option>
      </clr-options>
    </clr-combobox>
  `,
  standalone: false,
})
class MarkedOptionTestComponent {
  selection: string[] = ['acct', 'trust'];
}

describe('ClrCombobox element context, options marked or excluded themselves', () => {
  let fixture: ComponentFixture<MarkedOptionTestComponent>;
  const options = { excludeSelectors: ['.secret'], maxItemsPerCollection: 25 };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ClrComboboxModule, FormsModule, NoopAnimationsModule],
      declarations: [MarkedOptionTestComponent],
    });
    fixture = TestBed.createComponent(MarkedOptionTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  function host() {
    return fixture.nativeElement.querySelector('clr-combobox') as HTMLElement & {
      clrElementContext?: ElementContextCallback;
      clrElementMutator?: {
        coerce: (proposed: unknown, options?: unknown) => { value?: unknown; refused?: string };
        read: (options?: unknown) => unknown;
      };
    };
  }

  it('counts a redacted option without naming it, and leaves an excluded one out', () => {
    const context = host().clrElementContext?.(options);

    expect(context?.state['options']).toEqual(['Checking']);
    expect(context?.state['redactedOptions']).toBe(1);
    expect(context?.state['value']).toEqual([null]);
    expect(JSON.stringify(context)).not.toContain('998877');
    expect(JSON.stringify(context)).not.toContain('trust fund');
  });

  it('neither lists nor takes them in a write, and keeps them selected', () => {
    const mutator = host().clrElementMutator;
    const refused = mutator?.coerce('Nope', options);
    expect(refused?.refused).toContain('"Checking"');
    expect(refused?.refused).not.toContain('998877');
    expect(refused?.refused).not.toContain('trust fund');
    expect(mutator?.coerce('Hidden trust fund', options).refused).toBeDefined();

    expect(mutator?.coerce('Checking', options).value).toEqual(['acct', 'trust', 'checking']);
    expect(mutator?.coerce(null, options).value).toEqual(['acct', 'trust']);
  });
});

interface Account {
  id: number;
  label: string;
}

@Component({
  template: `
    <clr-combobox name="account" [(ngModel)]="selection" [clrComboboxIdentityFn]="byId">
      <ng-container *clrOptionSelected="let selected">{{ selected?.label }}</ng-container>
      <clr-options>
        <clr-option
          *clrOptionItems="let account of accounts; field: 'label'"
          [clrValue]="account"
          [attr.data-clr-context-redact]="account.id === 2 ? '' : null"
        >
          {{ account.label }}
        </clr-option>
      </clr-options>
    </clr-combobox>
  `,
  standalone: false,
})
class IdentityTestComponent {
  accounts: Account[] = [
    { id: 1, label: 'Ops budget' },
    { id: 2, label: 'Acct 998877' },
  ];
  // The same record as the redacted option, loaded apart from the options.
  selection: Account | null = { id: 2, label: 'Acct 998877' };
  byId = (account: Account) => account?.id;
}

describe('ClrCombobox element context, options matched by identity', () => {
  let fixture: ComponentFixture<IdentityTestComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ClrComboboxModule, FormsModule, NoopAnimationsModule],
      declarations: [IdentityTestComponent],
    });
    fixture = TestBed.createComponent(IdentityTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  function host() {
    return fixture.nativeElement.querySelector('clr-combobox') as HTMLElement & {
      clrElementContext?: ElementContextCallback;
      clrElementMutator?: { coerce: (proposed: unknown, options?: unknown) => { value?: unknown; refused?: string } };
    };
  }

  it('withholds a redacted selection matched by clrComboboxIdentityFn rather than by reference', () => {
    const context = host().clrElementContext?.({ maxItemsPerCollection: 25 });

    expect(context?.state['value']).toBeNull();
    expect(context?.state['redactedOptions']).toBe(1);
    expect(JSON.stringify(context)).not.toContain('998877');
  });

  it('refuses to replace that selection', () => {
    expect(host().clrElementMutator?.coerce('Ops budget', {}).refused).toBe(
      'The current choice is kept from agents, and cannot be changed by one.'
    );
  });

  it('names a selection the agent may see when it matches an option by identity', async () => {
    fixture.componentInstance.selection = { id: 1, label: 'Ops budget' };
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host().clrElementContext?.({ maxItemsPerCollection: 25 })?.state['value']).toBe('Ops budget');
    expect(host().clrElementMutator?.coerce({ id: 1 }, {}).value).toBe(fixture.componentInstance.accounts[0]);
  });
});

@Component({
  template: `
    <clr-combobox name="person" [(ngModel)]="selection" [clrEditable]="true" [clrLoading]="loading">
      <clr-options>
        <clr-option
          *clrOptionItems="let person of people"
          [clrValue]="person"
          [attr.data-clr-context-redact]="person === 'Eve Smithers' ? '' : null"
          >{{ person }}</clr-option
        >
      </clr-options>
    </clr-combobox>
    <clr-combobox name="fruit" class="static" [(ngModel)]="fruit">
      <clr-options>
        <clr-option clrValue="apple">Apple</clr-option>
        <clr-option clrValue="pear">Pear</clr-option>
      </clr-options>
    </clr-combobox>
    <clr-combobox name="port" class="options-loading" [(ngModel)]="port">
      <clr-options [clrLoading]="optionsLoading">
        <clr-option *clrOptionItems="let name of ports" [clrValue]="name">{{ name }}</clr-option>
      </clr-options>
    </clr-combobox>
    <clr-combobox
      name="member"
      class="async-search"
      [(ngModel)]="member"
      [clrLoading]="memberLoading"
      (clrInputChange)="search($event)"
    >
      <clr-options>
        @for (name of results; track name) {
          <clr-option [clrValue]="name">{{ name }}</clr-option>
        }
      </clr-options>
    </clr-combobox>
    <clr-combobox name="city" class="mixed" [(ngModel)]="city">
      <clr-options>
        <clr-option clrValue="elsewhere">Somewhere else</clr-option>
        <clr-option *clrOptionItems="let name of cities" [clrValue]="name">{{ name }}</clr-option>
      </clr-options>
    </clr-combobox>
    <clr-combobox name="drink" class="static-listened" [(ngModel)]="drink" (clrInputChange)="typed.push($event)">
      <clr-options>
        <clr-option clrValue="tea">Tea</clr-option>
        <clr-option clrValue="coffee">Coffee</clr-option>
      </clr-options>
    </clr-combobox>
    <clr-combobox
      name="team"
      class="async-multi"
      [(ngModel)]="team"
      clrMulti="true"
      (clrInputChange)="searchTeam($event)"
    >
      <ng-container *clrOptionSelected="let name">{{ name }}</ng-container>
      <clr-options>
        @for (name of teamResults; track name) {
          <clr-option [clrValue]="name">{{ name }}</clr-option>
        }
      </clr-options>
    </clr-combobox>
  `,
  standalone: false,
})
class FilteredOptionsTestComponent {
  fruit: string | null = null;
  city: string | null = null;
  cities = ['Sofia', 'Plovdiv', 'Varna'];
  loading = false;
  optionsLoading = false;
  port: string | null = null;
  member: string | null = null;
  results: string[] = [];
  memberLoading = false;
  ignoreEmptySearch = false;
  drink: string | null = null;
  typed: string[] = [];
  team: string[] = [];
  teamResults: string[] = [];
  ports = ['Burgas', 'Ruse'];
  people = ['Alice Smith', 'Bob Jones', 'Carol Smith', 'Dan Brown', 'Eve Smithers'];
  selection: string | null = null;

  search(text: string) {
    if (!text && this.ignoreEmptySearch) {
      return;
    }
    this.results = this.matches(text);
  }

  searchTeam(text: string) {
    if (!text && this.ignoreEmptySearch) {
      return;
    }
    this.teamResults = this.matches(text);
  }

  private matches(text: string) {
    return this.people.filter(person => person.includes(text) && person !== 'Eve Smithers');
  }
}

describe('ClrCombobox element context, options narrowed to what the user typed', () => {
  const accessorName = 'testComboboxClrContext';
  let fixture: ComponentFixture<FilteredOptionsTestComponent>;
  let engine: ClrContextEngineService;

  function published(selector = 'clr-combobox', options: { collectionItems?: string } = {}) {
    const host = fixture.nativeElement.querySelector(selector) as HTMLElement & {
      clrElementContext?: ElementContextCallback;
    };
    if (!host.clrElementContext) {
      throw new Error('expected the combobox to publish a clrElementContext callback');
    }
    return host.clrElementContext({ maxItemsPerCollection: 25, ...options });
  }

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  /** The state an untrusted consumer is told for the nth combobox of the fixture. */
  function sharedState(index: number, options?: unknown): unknown {
    return JSON.parse(shared(options)).components[index].state;
  }

  function shared(options?: unknown): string {
    engine.enableGlobalAccess(accessorName);
    return JSON.stringify((window as unknown as Record<string, (options?: unknown) => unknown>)[accessorName](options));
  }

  function open(selector = 'clr-combobox') {
    fixture.nativeElement.querySelector(`${selector} button.clr-combobox-trigger`).click();
    fixture.detectChanges();
  }

  function type(text: string, selector = 'clr-combobox') {
    const input = fixture.nativeElement.querySelector(`${selector} input`) as HTMLInputElement;
    input.value = text;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ClrComboboxModule, ClrLoadingModule, FormsModule, NoopAnimationsModule],
      declarations: [FilteredOptionsTestComponent],
    });
    fixture = TestBed.createComponent(FilteredOptionsTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    engine = TestBed.inject(ClrContextEngineService);
  });

  afterEach(() => {
    engine.disableGlobalAccess();
    fixture.destroy();
  });

  it('lists every option to untrusted consumers before anything is typed', () => {
    expect(published().state['options']).toEqual(['Alice Smith', 'Bob Jones', 'Carol Smith', 'Dan Brown']);
    expect(published().state['redactedOptions']).toBe(1);
    expect(shared()).toContain('Carol Smith');
  });

  it('tells the application which options match the text typed, and untrusted consumers nothing', () => {
    fixture.nativeElement.querySelector('button.clr-combobox-trigger').click();
    fixture.detectChanges();
    type('Smi');

    expect(published().state['matchingOptions']).toEqual(['Alice Smith', 'Carol Smith']);
    expect(published().state['redactedMatchingOptions']).toBe(1);
    expect(published().state['options']).toBeUndefined();
    expect(shared()).not.toMatch(/Smi|"redactedMatchingOptions"/);
  });

  it('tells the application that nothing matches, and untrusted consumers nothing', () => {
    open();
    type('Zzq');

    expect(published().state['matchingOptions']).toEqual([]);
    expect(published().state['optionsAvailable']).toBeUndefined();
    expect(shared()).not.toMatch(/Zzq|"matchingOptions"/);
    expect(sharedState(0)).toEqual({ multiSelect: false });
  });

  it('says the matches are still loading while a search runs, rather than that none match', async () => {
    fixture.componentInstance.loading = true;
    await settle();
    open();
    type('Smi');

    // The matches shown so far stay listed: the user sees them, and an agent may pick one.
    expect(published().state['matchingOptionsPending']).toBe(true);
    expect(published().state['matchingOptions']).toEqual(['Alice Smith', 'Carol Smith']);
    expect(shared()).not.toMatch(/Smi|"matchingOptionsPending"/);

    fixture.componentInstance.loading = false;
    await settle();

    expect(published().state['matchingOptionsPending']).toBeUndefined();
    expect(published().state['matchingOptions']).toEqual(['Alice Smith', 'Carol Smith']);
  });

  it('says the matches are pending when the search starts after the user typed', async () => {
    open();
    type('Smi');
    fixture.componentInstance.loading = true;
    await settle();

    expect(published().state['matchingOptionsPending']).toBe(true);
    expect(published().state['matchingOptions']).toEqual(['Alice Smith', 'Carol Smith']);
    expect(shared()).not.toContain('"matchingOptionsPending"');
  });

  it('reads clrLoading on the combobox only, where it drives what the user sees', async () => {
    fixture.componentInstance.optionsLoading = true;
    await settle();
    open('.options-loading');
    type('Bur', '.options-loading');

    expect(published('.options-loading').state['matchingOptionsPending']).toBeUndefined();
    expect(published('.options-loading').state['matchingOptions']).toEqual(['Burgas']);
  });

  it('says a search started before anything was typed is still running, to every consumer', async () => {
    fixture.componentInstance.loading = true;
    await settle();

    expect(published().state['optionsPending']).toBe(true);
    expect(published().state['options']).toBeDefined();
    expect(shared()).toContain('"optionsPending":true');
  });

  it('withholds the results of a search the application runs for the typed text', () => {
    open('.async-search');
    type('Smi', '.async-search');

    expect(published('.async-search').state['matchingOptions']).toEqual(['Alice Smith', 'Carol Smith']);
    expect(published('.async-search').state['options']).toBeUndefined();
    expect(shared()).not.toMatch(/Smi"|"matchingOptions"/);
    expect(sharedState(3)).toEqual({ multiSelect: false });
  });

  it('withholds the previous results after the typed text is cleared, while the application has not replaced them', () => {
    fixture.componentInstance.ignoreEmptySearch = true;
    open('.async-search');
    type('Smi', '.async-search');
    type('', '.async-search');

    expect(published('.async-search').state['matchingOptions']).toEqual(['Alice Smith', 'Carol Smith']);
    expect(published('.async-search').state['options']).toBeUndefined();
    expect(sharedState(3)).toEqual({ multiSelect: false });
  });

  it('does not reveal a pick through the results the application loads for its label', async () => {
    open('.async-search');
    type('Smi', '.async-search');
    const alice = Array.from(document.querySelectorAll<HTMLElement>('clr-option')).find(option =>
      option.textContent?.includes('Alice Smith')
    );
    alice?.click();
    await settle();

    expect(fixture.componentInstance.member).toBe('Alice Smith');
    expect(published('.async-search').state['matchingOptions']).toEqual(['Alice Smith']);
    expect(published('.async-search').state['options']).toBeUndefined();
    expect(sharedState(3)).toEqual({ multiSelect: false });
    expect(sharedState(3, { collectionItems: 'summary' })).toEqual({ multiSelect: false });
  });

  it('tells every consumer an application search has no results yet before anything is typed', () => {
    expect(published('.async-search').state['optionsAvailable']).toBe(false);
    expect(sharedState(3)).toEqual({ multiSelect: false, optionsAvailable: false });
  });

  it('says a search started after the typed text was cleared is running, and withholds the list it replaces', async () => {
    fixture.componentInstance.ignoreEmptySearch = true;
    open('.async-search');
    type('Smi', '.async-search');
    type('', '.async-search');
    fixture.componentInstance.memberLoading = true;
    await settle();

    expect(published('.async-search').state['matchingOptions']).toEqual(['Alice Smith', 'Carol Smith']);
    expect(published('.async-search').state['matchingOptionsPending']).toBeUndefined();
    expect(published('.async-search').state['optionsPending']).toBe(true);
    expect(sharedState(3)).toEqual({ multiSelect: false, optionsPending: true });
  });

  it('keeps listing written-out options to every consumer while nothing was typed, though the application listens', () => {
    expect(published('.static-listened').state['options']).toEqual(['Tea', 'Coffee']);
    expect(sharedState(5)).toEqual({ multiSelect: false, options: ['Tea', 'Coffee'] });
  });

  it('withholds written-out options once the application listening has been given text', () => {
    open('.static-listened');
    type('Te', '.static-listened');
    type('', '.static-listened');

    expect(fixture.componentInstance.typed).toEqual(['Te', '']);
    expect(published('.static-listened').state['matchingOptions']).toEqual(['Tea', 'Coffee']);
    expect(sharedState(5)).toEqual({ multiSelect: false });
  });

  it('withholds the results a multi-select keeps after closing, when the application ignores the empty search', async () => {
    fixture.componentInstance.ignoreEmptySearch = true;
    open('.async-multi');
    type('Smi', '.async-multi');
    const alice = Array.from(document.querySelectorAll<HTMLElement>('clr-option')).find(option =>
      option.textContent?.includes('Alice Smith')
    );
    alice?.click();
    await settle();
    open('.async-multi');
    await settle();

    expect(fixture.componentInstance.team).toEqual(['Alice Smith']);
    expect(published('.async-multi').state['matchingOptions']).toEqual(['Alice Smith', 'Carol Smith']);
    expect(published('.async-multi').state['options']).toBeUndefined();
    expect(sharedState(6)).toEqual({ multiSelect: true });
  });

  it('counts the options rather than listing them in a summary snapshot', () => {
    expect(published('clr-combobox', { collectionItems: 'summary' }).state).toEqual({
      multiSelect: false,
      optionCount: 5,
      value: null,
    });
    const summary = shared({ collectionItems: 'summary' });
    expect(summary).toContain('"optionCount":5');
    expect(summary).not.toContain('Alice');
  });

  it('counts the matches in a summary snapshot, and tells untrusted consumers neither', () => {
    open();
    type('Smi');

    expect(published('clr-combobox', { collectionItems: 'summary' }).state).toEqual({
      multiSelect: false,
      matchingOptionCount: 3,
      value: null,
    });
    expect(shared({ collectionItems: 'summary' })).not.toMatch(/Smi|"matchingOptionCount"/);
    // Not the narrowed count under the other key either.
    expect(sharedState(0, { collectionItems: 'summary' })).toEqual({ multiSelect: false });
  });

  it('withholds every option of a list that mixes written-out options with *clrOptionItems', () => {
    open('.mixed');
    type('Var', '.mixed');

    expect(published('.mixed').state['matchingOptions']).toEqual(['Somewhere else', 'Varna']);
    expect(shared()).not.toMatch(/Var|Somewhere else/);
  });

  it('withholds the picked option when an editable combobox with a value is opened again', async () => {
    fixture.componentInstance.selection = 'Bob Jones';
    await settle();
    open();
    await settle();

    expect(published().state['matchingOptions']).toEqual(['Bob Jones']);
    expect(shared()).not.toContain('Bob');
  });

  it('keeps listing options written out one by one, which typing does not narrow', () => {
    open('.static');
    type('Pe', '.static');

    expect(document.querySelectorAll('[role="listbox"] [role="option"]').length).toBe(2);
    expect(published('.static').state['options']).toEqual(['Apple', 'Pear']);
    expect(published('.static').state['matchingOptions']).toBeUndefined();
  });

  it('does not tell untrusted consumers the one option left after an editable combobox closes on a pick', async () => {
    fixture.nativeElement.querySelector('button.clr-combobox-trigger').click();
    fixture.detectChanges();
    const bob = Array.from(document.querySelectorAll<HTMLElement>('clr-option')).find(option =>
      option.textContent?.includes('Bob Jones')
    );
    bob?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.selection).toBe('Bob Jones');
    expect(published().state['matchingOptions']).toEqual(['Bob Jones']);
    expect(shared()).not.toContain('Bob');
  });
});
