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
import { ClrComponentContext } from '@clr/angular/utils';

import { ClrComboboxModule } from './combobox.module';

type ElementContextCallback = (options: { maxItemsPerCollection?: number }) => {
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
    <clr-combobox name="person" [(ngModel)]="selection" [clrEditable]="true">
      <clr-options>
        <clr-option *clrOptionItems="let person of people" [clrValue]="person">{{ person }}</clr-option>
      </clr-options>
    </clr-combobox>
  `,
  standalone: false,
})
class FilteredOptionsTestComponent {
  people = ['Alice Smith', 'Bob Jones', 'Carol Smith', 'Dan Brown'];
  selection: string | null = null;
}

describe('ClrCombobox element context, options narrowed to what the user typed', () => {
  const accessorName = 'testComboboxClrContext';
  let fixture: ComponentFixture<FilteredOptionsTestComponent>;
  let engine: ClrContextEngineService;

  function published() {
    const host = fixture.nativeElement.querySelector('clr-combobox') as HTMLElement & {
      clrElementContext?: ElementContextCallback;
    };
    if (!host.clrElementContext) {
      throw new Error('expected the combobox to publish a clrElementContext callback');
    }
    return host.clrElementContext({ maxItemsPerCollection: 25 });
  }

  function shared(): string {
    engine.enableGlobalAccess(accessorName);
    return JSON.stringify((window as unknown as Record<string, () => unknown>)[accessorName]());
  }

  function type(text: string) {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = text;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ClrComboboxModule, FormsModule, NoopAnimationsModule],
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
    expect(shared()).toContain('Carol Smith');
  });

  it('tells the application which options match the text typed, and untrusted consumers nothing', () => {
    fixture.nativeElement.querySelector('button.clr-combobox-trigger').click();
    fixture.detectChanges();
    type('Smi');

    expect(published().state['matchingOptions']).toEqual(['Alice Smith', 'Carol Smith']);
    expect(published().state['options']).toBeUndefined();
    expect(shared()).not.toMatch(/Smi/);
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
