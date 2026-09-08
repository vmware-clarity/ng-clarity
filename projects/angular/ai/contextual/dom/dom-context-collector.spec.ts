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

import { collectClrDomActions, collectClrDomContexts } from './dom-context-collector';

@Component({
  template: `
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
  modalOpen = false;
}

describe('DOM context collector - Clarity Angular components', () => {
  let fixture: ComponentFixture<TestComponent>;
  let root: HTMLElement;

  function contextOfType(type: string): ClrComponentContext | undefined {
    return collectClrDomContexts(root).find(context => context.type === type);
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

  it('describes tabs and which one is active', () => {
    expect(contextOfType('tablist')?.state).toEqual({ tabs: ['Details', 'Settings'], activeTab: 'Details' });
  });

  it('describes a form field by its label, type and validation constraints', () => {
    const field = contextOfType('form')?.children?.[0];

    expect(field?.type).toBe('textbox');
    expect(field?.label).toBe('Username');
    expect(field?.state?.required).toBe(true);
  });

  it('does not report form values by default', () => {
    expect(JSON.stringify(collectClrDomContexts(root))).not.toContain('top-secret-value');
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
    const grid = collectClrDomContexts(root).find(context => context.type === 'grid');
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
    const gridOf = (root: ParentNode) => collectClrDomContexts(root).find(context => context.type === 'grid');

    expect(gridOf(fixture.nativeElement)?.element).toBe('clr-datagrid');
    expect(gridOf(cssOnly)?.element).toBeUndefined();
    expect(gridOf(plainHtml)?.element).toBeUndefined();
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

    expect(field?.state).toEqual({ invalid: true, disabled: true, required: true });
  });

  it('collects control values only on explicit opt-in', () => {
    root.innerHTML = '<label for="h">Host name</label><input id="h" name="hostName" value="esx-prod-04" />';

    expect(JSON.stringify(collectClrDomContexts(root))).not.toContain('esx-prod-04');
    expect(JSON.stringify(collectClrDomContexts(root, { includeFormValues: true }))).toContain('esx-prod-04');
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

    expect(contexts.map(context => context.label)).toEqual(['Page grid']);
    expect(collectClrDomActions(contexts).map(action => action.label)).not.toContain('Panel action');
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
    publishElementContext(root.querySelector('fake-combobox') as Element, options => ({
      state: { options: ['Apple', 'Pear'], value: options.includeFormValues ? 'Apple' : undefined },
    }));

    const combobox = collectClrDomContexts(root, { includeFormValues: true }).find(c => c.type === 'combobox');

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

describe('DOM context collector - actions', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => root.remove());

  function actionsOf(html: string) {
    root.innerHTML = html;
    return collectClrDomActions(collectClrDomContexts(root));
  }

  it('reports what a user can currently invoke, with link targets and disabled state', () => {
    expect(actionsOf('<button>Add user</button><button disabled>Retry</button><a href="/help">Help</a>')).toEqual([
      { label: 'Add user', kind: 'button' },
      { label: 'Retry', kind: 'button', disabled: true },
      { label: 'Help', kind: 'link', href: '/help' },
    ]);
  });

  it('leaves the actions inside a dialog to the dialog, which reports them itself', () => {
    const actions = actionsOf('<button>Page action</button><div role="dialog"><button>Dialog action</button></div>');

    expect(actions.map(action => action.label)).toEqual(['Page action']);
  });

  it('leaves navigation links to the navigation', () => {
    const actions = actionsOf('<nav><a href="/a">Dashboard</a></nav><a href="/b">Docs</a>');

    expect(actions.map(action => action.label)).toEqual(['Docs']);
  });

  it('drops an action that has neither a label nor a target', () => {
    expect(actionsOf('<button></button>')).toEqual([]);
  });
});
