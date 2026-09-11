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
import { ClarityModule } from '@clr/angular';
import { ClrComponentContext, publishElementContext } from '@clr/angular/utils';

import { collectClrDomContexts } from './dom-context-collector';

/**
 * A component that renders more than one reportable part (e.g. a datagrid's grid and its
 * footer, tabs' tablist and its active panel) nests them under one wrapper node instead of
 * listing them as flat siblings, so tests that look for "is there a context of type X
 * anywhere on the page" must search the whole tree, not just its top level.
 */
function findContext(
  contexts: ClrComponentContext[],
  predicate: (context: ClrComponentContext) => boolean
): ClrComponentContext | undefined {
  for (const context of contexts) {
    if (predicate(context)) {
      return context;
    }
    const found = context.children && findContext(context.children, predicate);
    if (found) {
      return found;
    }
  }
  return undefined;
}

@Component({
  template: `
    <clr-alert clrAlertType="danger" [clrAlertClosable]="false">
      <clr-alert-item>
        <span class="alert-text">Disk almost full</span>
      </clr-alert-item>
    </clr-alert>

    <clr-tabs>
      <clr-tab>
        <button clrTabLink>Details</button>
        <clr-tab-content *clrIfActive>Details content</clr-tab-content>
      </clr-tab>
      <clr-tab>
        <button clrTabLink>Settings</button>
        <clr-tab-content *clrIfActive>Settings content</clr-tab-content>
      </clr-tab>
    </clr-tabs>

    <clr-datagrid>
      <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>
      <clr-dg-column>Status</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        <clr-dg-cell>{{ item.status }}</clr-dg-cell>
      </clr-dg-row>
      <clr-dg-footer>{{ items.length }} items</clr-dg-footer>
    </clr-datagrid>

    <form clrForm>
      <clr-input-container>
        <label>Username</label>
        <input clrInput required name="username" [(ngModel)]="username" />
      </clr-input-container>
      <clr-select-container>
        <label>Basic select</label>
        <select clrSelect name="options" [(ngModel)]="selectedOption">
          <option value="one">One</option>
          <option value="two">Two</option>
          <option value="three">Three</option>
        </select>
        <clr-control-helper>Helper Subtext</clr-control-helper>
      </clr-select-container>
    </form>

    <button type="button" class="btn btn-primary">Add user</button>
    <button type="button" class="btn" disabled>Retry sync</button>
    <a class="btn" href="/help">Help</a>

    <div hidden>
      <button type="button" class="btn">Hidden action</button>
    </div>

    <clr-modal [(clrModalOpen)]="modalOpen">
      <h3 class="modal-title">Confirm delete</h3>
      <div class="modal-body">Are you sure?</div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger">Delete</button>
      </div>
    </clr-modal>
  `,
  standalone: false,
})
class TestComponent {
  items = [
    { name: 'node-1', status: 'ok' },
    { name: 'node-2', status: 'down' },
  ];
  username = 'top-secret-value';
  selectedOption = 'two';
  modalOpen = false;
}

describe('DOM context collector - Clarity Angular components', () => {
  let fixture: ComponentFixture<TestComponent>;
  let root: HTMLElement;

  function contextOfType(type: string): ClrComponentContext | undefined {
    return findContext(collectClrDomContexts(root), context => context.type === type);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClarityModule, FormsModule, NoopAnimationsModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  afterEach(() => fixture.destroy());

  it('describes a datagrid as a grid, attributed to the component that renders it', () => {
    const grid = contextOfType('grid');

    expect(grid?.element).toBe('clr-datagrid');
    expect(grid?.state?.columns).toEqual(['Name', 'Status']);
    expect(grid?.state?.rowCount).toBe(2);
  });

  it('leaves screen-reader guidance out of the column names', () => {
    // Clarity's resize hint lives in the accessibility tree on purpose; it is not a column name.
    expect(JSON.stringify(contextOfType('grid'))).not.toContain('left or right key');
  });

  it('describes an alert and its message', () => {
    // Regression guard for the engine benefit of giving clr-alert a role: before it had
    // one, an alert contributed nothing but a stray icon node and its message was absent.
    const alert = contextOfType('alert');

    expect(alert?.element).toBe('clr-alert');
    expect(alert?.label).toBe('Disk almost full');
  });

  it("reports an alert's exact severity, which no ARIA attribute can express", () => {
    // role="alert" only distinguishes important from informational; danger from warning
    // is something only the component knows, so it publishes it.
    expect(contextOfType('alert')?.state?.severity).toBe('danger');
  });

  it('describes tabs and which one is active', () => {
    expect(contextOfType('tablist')?.state).toEqual({
      tabCount: 2,
      tabs: ['Details', 'Settings'],
      activeTab: 'Details',
    });
  });

  it('describes a form field by its label, type and validation constraints', () => {
    const field = contextOfType('form')?.children?.[0];

    expect(field?.type).toBe('textbox');
    expect(field?.label).toBe('Username');
    expect(field?.state?.required).toBe(true);
  });

  it('reports the choices a dropdown offers, which a collapsed dropdown cannot show', () => {
    const select = contextOfType('form')?.children?.find(child => child.element === 'clr-select-container');

    expect(select?.type).toBe('combobox');
    expect(select?.label).toBe('Basic select');
    expect(select?.state?.options).toEqual(['One', 'Two', 'Three']);
  });

  it('attaches the helper text to the field it describes', () => {
    const select = contextOfType('form')?.children?.find(child => child.element === 'clr-select-container');

    expect(select?.state?.description).toBe('Helper Subtext');
  });

  it('reports which choice is currently selected', async () => {
    // ngModel applies its value asynchronously, so wait for the select to settle.
    await fixture.whenStable();
    fixture.detectChanges();

    const select = collectClrDomContexts(root)
      .find(context => context.type === 'form')
      ?.children?.find(child => child.element === 'clr-select-container');

    // The option's text, as the user sees it, rather than its value attribute.
    expect(select?.state?.value).toBe('Two');
  });

  it('reports what the user typed, which is part of what the page is showing', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    expect(JSON.stringify(collectClrDomContexts(root))).toContain('top-secret-value');
  });

  it('does not describe a closed modal', () => {
    expect(contextOfType('dialog')).toBeUndefined();
  });

  it('describes an open modal as a dialog, with its title and its buttons', () => {
    fixture.componentInstance.modalOpen = true;
    fixture.detectChanges();

    const dialog = contextOfType('dialog');

    expect(dialog?.element).toBe('clr-modal');
    expect(dialog?.label).toBe('Confirm delete');
    expect(dialog?.state?.modal).toBe(true);
    expect(dialog?.children?.map(child => child.label)).toContain('Delete');
  });

  it('describes the sorted column once the user sorts', () => {
    (root.querySelector('.datagrid-column-title') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(contextOfType('grid')?.state?.sort).toEqual({ column: 'Name', direction: 'ascending' });
  });

  it('carries the text of an element that has nothing but its content to offer', () => {
    expect(contextOfType('clr-dg-footer')?.label).toBe('2 items');
  });
});

describe('DOM context collector - equivalence across rendering surfaces', () => {
  let fixture: ComponentFixture<TestComponent>;
  let cssOnly: HTMLElement;
  let plainHtml: HTMLElement;

  /** The claim under test is about what is described, not which element rendered it. */
  function shapeOf(root: ParentNode): unknown {
    const grid = findContext(collectClrDomContexts(root), context => context.type === 'grid');
    return { type: grid?.type, columns: grid?.state?.columns, rowCount: grid?.state?.rowCount };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClarityModule, FormsModule, NoopAnimationsModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    // The same grid as @clr/ui CSS-only markup: no components, just classes and roles.
    cssOnly = document.createElement('div');
    cssOnly.innerHTML = `
      <div role="grid" class="datagrid">
        <div role="rowgroup" class="datagrid-header">
          <div role="row"><div role="columnheader">Name</div><div role="columnheader">Status</div></div>
        </div>
        <div role="rowgroup">
          <div role="row"><div role="gridcell">node-1</div><div role="gridcell">ok</div></div>
          <div role="row"><div role="gridcell">node-2</div><div role="gridcell">down</div></div>
        </div>
      </div>
    `;
    document.body.appendChild(cssOnly);

    // And as plain semantic HTML, with no Clarity anywhere.
    plainHtml = document.createElement('div');
    plainHtml.innerHTML = `
      <table role="grid">
        <thead>
          <tr><th>Name</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr><td>node-1</td><td>ok</td></tr>
          <tr><td>node-2</td><td>down</td></tr>
        </tbody>
      </table>
    `;
    document.body.appendChild(plainHtml);
  });

  afterEach(() => {
    fixture.destroy();
    cssOnly.remove();
    plainHtml.remove();
  });

  it('describes a Clarity component, CSS-only markup and plain HTML identically', () => {
    const expected = { type: 'grid', columns: ['Name', 'Status'], rowCount: 2 };

    expect(shapeOf(fixture.nativeElement)).toEqual(expected);
    expect(shapeOf(cssOnly)).toEqual(expected);
    expect(shapeOf(plainHtml)).toEqual(expected);
  });

  it('distinguishes the surfaces only by which element rendered them', () => {
    const gridOf = (root: ParentNode) => findContext(collectClrDomContexts(root), context => context.type === 'grid');

    expect(gridOf(fixture.nativeElement)?.element).toBe('clr-datagrid');
    expect(gridOf(cssOnly)?.element).toBeUndefined();
    expect(gridOf(plainHtml)?.element).toBeUndefined();
  });
});

describe('DOM context collector - controls nested inside content leaves', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => root.remove());

  it('reports a button nested inside a heading, the exact shape of the combobox demo page', () => {
    // <h2>Combobox <button (click)="disabled = !disabled">Toggle Disabled</button></h2>:
    // ordinary markup pairing a section title with an unrelated action. Before this fix,
    // "heading" being a leaf role meant the button was invisible to every consumer, not
    // merely folded into the heading's label.
    root.innerHTML = '<h2>Combobox <button class="btn btn-sm btn-primary">Toggle Disabled</button></h2>';

    const heading = collectClrDomContexts(root).find(c => c.type === 'heading');
    const button = heading?.children?.find(c => c.type === 'button');

    expect(heading?.label).toBe('Combobox Toggle Disabled');
    expect(button?.label).toBe('Toggle Disabled');
  });
});

describe('DOM context collector - hand-authored markup', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => root.remove());

  it('reports nothing for elements that currently render no content', () => {
    root.innerHTML = '<div class="card"></div><span></span>';

    expect(collectClrDomContexts(root)).toEqual([]);
  });

  it('describes a native dialog and a details element from their own semantics', () => {
    root.innerHTML = `
      <dialog open aria-label="Native dialog"></dialog>
      <details open><summary>More</summary>body</details>
    `;
    const contexts = collectClrDomContexts(root);

    expect(contexts.find(c => c.type === 'dialog')?.state?.open).toBe(true);
    expect(contexts.find(c => c.type === 'group')?.state?.open).toBe(true);
  });

  it('reports a field as invalid when the markup says so', () => {
    root.innerHTML = '<label for="h">Host</label><input id="h" aria-invalid="true" required disabled />';
    const field = collectClrDomContexts(root).find(c => c.type === 'textbox');

    expect(field?.state).toEqual({ invalid: true, disabled: true, required: true, value: '' });
  });

  it('attaches a validation message to the field, so an agent learns why it is invalid', () => {
    root.innerHTML = `
      <label for="h">Host</label>
      <input id="h" aria-invalid="true" aria-describedby="h-err" />
      <span id="h-err">Name is already taken</span>
    `;
    const field = collectClrDomContexts(root).find(c => c.type === 'textbox');

    expect(field?.state?.invalid).toBe(true);
    expect(field?.state?.description).toBe('Name is already taken');
  });

  it('never puts a password or a marked field into a snapshot, however values were asked for', () => {
    root.innerHTML = `
      <label for="p">Password</label><input id="p" type="password" value="hunter2" />
      <label for="t">API token</label><input id="t" data-clr-context-redact value="tok_live_abc123" />
      <label for="h">Host</label><input id="h" value="esx-prod-04" />
    `;
    const json = JSON.stringify(collectClrDomContexts(root));

    expect(json).not.toContain('hunter2');
    expect(json).not.toContain('tok_live_abc123');
    expect(json).toContain('esx-prod-04');
  });

  it('collects control values', () => {
    root.innerHTML = '<label for="h">Host name</label><input id="h" name="hostName" value="esx-prod-04" />';

    expect(JSON.stringify(collectClrDomContexts(root))).toContain('esx-prod-04');
  });

  it('falls back to element geometry when checkVisibility is unavailable', () => {
    root.innerHTML = '<div role="grid" style="display:none"></div>';
    const element = root.firstElementChild as HTMLElement & { checkVisibility?: unknown };
    const original = element.checkVisibility;
    element.checkVisibility = undefined;

    try {
      // An element that is not rendered has no client rects, which is the only signal
      // available without checkVisibility.
      expect(collectClrDomContexts(root)).toEqual([]);
    } finally {
      element.checkVisibility = original;
    }
  });

  it('never describes elements inside ignore-marked regions', () => {
    root.innerHTML = `
      <div data-clr-context-ignore>
        <div role="dialog" aria-label="Chat panel"></div>
        <button type="button">Panel action</button>
      </div>
      <div role="grid" aria-label="Page grid"></div>
    `;
    const contexts = collectClrDomContexts(root);

    // Ignored means ignored end to end: neither the dialog nor its button contributes
    // anything, at the top level or nested inside anything else.
    expect(contexts.map(context => context.label)).toEqual(['Page grid']);
  });

  it('applies the component budget', () => {
    root.innerHTML = '<div role="grid"></div><div role="grid"></div><div role="grid"></div>';

    expect(collectClrDomContexts(root, { maxComponents: 2 }).length).toBe(2);
  });

  it('truncates long text to the configured budget', () => {
    root.innerHTML = `<button>${'x'.repeat(200)}</button>`;

    expect(collectClrDomContexts(root, { maxTextLength: 10 })[0].label?.length).toBe(10);
  });
});

describe('DOM context collector - component-published context', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => root.remove());

  it('merges what a component publishes over what the DOM shows', () => {
    root.innerHTML = '<clr-fake-widget aria-label="DOM label">content</clr-fake-widget>';
    publishElementContext(root.querySelector('clr-fake-widget') as Element, () => ({
      label: 'Component label',
      state: { options: ['a', 'b', 'c'], loaded: true },
    }));

    const widget = collectClrDomContexts(root, { maxItemsPerCollection: 2 })[0];

    expect(widget.label).toBe('Component label');
    expect(widget.state?.loaded).toBe(true);
    expect(widget.state?.options).toEqual(['a', 'b']);
  });

  it('lets a publisher supply the options a closed popover does not render', () => {
    root.innerHTML = '<label for="f">Fruit</label><fake-combobox><input id="f" role="combobox" /></fake-combobox>';
    publishElementContext(root.querySelector('fake-combobox') as Element, () => ({
      state: { options: ['Apple', 'Pear'], value: 'Apple' },
    }));

    const combobox = collectClrDomContexts(root).find(c => c.type === 'combobox');

    expect(combobox?.label).toBe('Fruit');
    expect(combobox?.state?.options).toEqual(['Apple', 'Pear']);
    expect(combobox?.state?.value).toBe('Apple');
  });

  it('treats a publisher that throws as having nothing to add', () => {
    root.innerHTML = '<clr-fake-widget aria-label="DOM label">content</clr-fake-widget>';
    publishElementContext(root.querySelector('clr-fake-widget') as Element, () => {
      throw new Error('broken publisher');
    });

    expect(collectClrDomContexts(root)).toEqual([
      { type: 'clr-fake-widget', element: 'clr-fake-widget', label: 'DOM label' },
    ]);
  });
});
