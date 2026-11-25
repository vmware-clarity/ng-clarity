/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Directive, signal, Type, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { ClrSelectedState } from './models/selected-state.enum';
import { ClrTree } from './tree';
import { ClrTreeNode } from './tree-node';
import { ClrTreeViewModule } from './tree-view.module';

interface Node {
  name: string;
  children?: Node[];
}

/*
 * The tree view components are OnPush. Everything they render must follow state that changes outside their own
 * inputs and events: another node of the tree, the app's code, the DOM, async children.
 */
const TEMPLATE = `
  <clr-tree id="selection">
    <clr-tree-node
      id="parent"
      [clrDisabled]="parentDisabled()"
      [clrSelected]="parentSelected()"
      (clrSelectedChange)="parentSelected.set($event)"
    >
      {{ parentLabel() }}
      <clr-tree-node id="first" [clrSelected]="firstSelected()" (clrSelectedChange)="firstSelected.set($event)">
        First
      </clr-tree-node>
      @if (showLate()) {
        <clr-tree-node id="late" [clrSelected]="lateSelected()" (clrSelectedChange)="lateSelected.set($event)">
          Late
        </clr-tree-node>
      }
    </clr-tree-node>
  </clr-tree>

  <clr-tree id="one-way">
    <clr-tree-node id="one-way-parent" [clrSelected]="oneWaySelected()">
      One-way parent
      <clr-tree-node id="one-way-child">One-way child</clr-tree-node>
    </clr-tree-node>
  </clr-tree>

  <clr-tree id="links">
    <clr-tree-node id="linked">
      @if (showLink()) {
        <a class="clr-treenode-link" [class.active]="linkActive()">Link</a>
      } @else {
        Text
      }
      @if (showLinkChild()) {
        <clr-tree-node>Link child</clr-tree-node>
      }
    </clr-tree-node>
  </clr-tree>

  @if (showRecursive()) {
    <clr-tree id="recursive" [clrLazy]="true">
      <clr-tree-node *clrRecursiveFor="let node of roots(); getChildren: getChildren" [clrExpandable]="!!node.children">
        {{ node.name }}
      </clr-tree-node>
    </clr-tree>
  }
`;

@Directive()
abstract class TreeHost {
  readonly selectionTree = viewChild.required<ClrTree<void>>(ClrTree);

  readonly parentLabel = signal('Parent');
  readonly parentDisabled = signal(false);
  readonly parentSelected = signal(ClrSelectedState.UNSELECTED);
  readonly firstSelected = signal(ClrSelectedState.UNSELECTED);
  readonly lateSelected = signal(ClrSelectedState.UNSELECTED);
  readonly showLate = signal(false);
  readonly oneWaySelected = signal(ClrSelectedState.UNSELECTED);

  readonly showLink = signal(true);
  readonly linkActive = signal(false);
  readonly showLinkChild = signal(false);

  readonly showRecursive = signal(true);
  readonly roots = signal<Node[]>([{ name: 'Root', children: [{ name: 'Leaf' }] }]);
  resolveChildren: () => void;
  readonly getChildren = (node: Node) =>
    new Promise<Node[]>(resolve => (this.resolveChildren = () => resolve(node.children)));
}

@Component({ template: TEMPLATE, changeDetection: ChangeDetectionStrategy.OnPush, standalone: false })
class OnPushTreeHost extends TreeHost {}

@Component({ template: TEMPLATE, changeDetection: ChangeDetectionStrategy.Eager, standalone: false })
class EagerTreeHost extends TreeHost {}

const HOSTS: { name: string; type: Type<TreeHost>; zoneTicks: boolean }[] = [
  { name: 'an OnPush host in a zoneless app', type: OnPushTreeHost, zoneTicks: false },
  // A Zone.js app refreshes from the root after every task: Eager views are checked, OnPush views only when dirty.
  { name: 'an Eager host refreshed from the root, as in a Zone.js app', type: EagerTreeHost, zoneTicks: true },
];

for (const { name, type, zoneTicks } of HOSTS) {
  describe(`Tree view in ${name}`, () => {
    let fixture: ComponentFixture<TreeHost>;
    let host: TreeHost;

    async function render() {
      await fixture.whenStable();
      if (zoneTicks) {
        fixture.detectChanges();
      }
    }

    function query(selector: string): HTMLElement {
      return fixture.nativeElement.querySelector(selector);
    }

    function content(nodeSelector: string): HTMLElement {
      return query(`${nodeSelector} > .clr-tree-node-content-container`);
    }

    function checkbox(nodeSelector: string): HTMLInputElement {
      return query(`${nodeSelector} > .clr-tree-node-content-container input[type=checkbox]`) as HTMLInputElement;
    }

    function caret(nodeSelector: string) {
      return query(`${nodeSelector} > .clr-tree-node-content-container .clr-treenode-caret`);
    }

    beforeEach(async () => {
      TestBed.configureTestingModule({ declarations: [type], imports: [ClrTreeViewModule] });
      fixture = TestBed.createComponent(type);
      host = fixture.componentInstance;
      if (zoneTicks) {
        fixture.detectChanges();
      } else {
        fixture.autoDetectChanges();
      }
      await render();
    });

    afterEach(() => fixture.destroy());

    describe('declarative nodes', () => {
      it('renders a child added later, and shows and hides the caret of its parent', async () => {
        host.showLate.set(true);
        await render();
        expect(query('#parent').querySelectorAll('clr-tree-node').length).toBe(2);

        host.showLinkChild.set(true);
        await render();
        expect(caret('#linked')).not.toBeNull();
        expect(content('#linked').getAttribute('aria-expanded')).toBe('false');

        host.showLinkChild.set(false);
        await render();
        expect(caret('#linked')).toBeNull();
        expect(content('#linked').hasAttribute('aria-expanded')).toBe(false);
      });

      it('shows the selection of a child on its parent', async () => {
        host.showLate.set(true);
        await render();
        host.firstSelected.set(ClrSelectedState.SELECTED);
        await render();
        expect(checkbox('#parent').indeterminate).toBe(true);
        expect(host.parentSelected()).toBe(ClrSelectedState.INDETERMINATE);

        host.lateSelected.set(ClrSelectedState.SELECTED);
        await render();
        expect(checkbox('#parent').indeterminate).toBe(false);
        expect(checkbox('#parent').checked).toBe(true);
        expect(content('#parent').getAttribute('aria-selected')).toBe('true');
      });

      it('shows the selection of a parent on its children', async () => {
        host.showLate.set(true);
        await render();
        host.parentSelected.set(ClrSelectedState.SELECTED);
        await render();
        expect(checkbox('#first').checked).toBe(true);
        expect(checkbox('#late').checked).toBe(true);
        expect(content('#first').getAttribute('aria-selected')).toBe('true');
        expect(host.lateSelected()).toBe(ClrSelectedState.SELECTED);
      });

      it('shows a selection that goes through nodes without bindings of the app', async () => {
        host.oneWaySelected.set(ClrSelectedState.SELECTED);
        await render();
        expect(checkbox('#one-way-child').checked).toBe(true);

        checkbox('#one-way-child').click();
        await render();
        expect(checkbox('#one-way-child').checked).toBe(false);
        expect(checkbox('#one-way-parent').checked).toBe(false);
        expect(content('#one-way-parent').getAttribute('aria-selected')).toBe('false');
      });

      it('selects a child from a click and shows it on the parent', async () => {
        checkbox('#first').click();
        await render();
        expect(host.firstSelected()).toBe(ClrSelectedState.SELECTED);
        expect(checkbox('#parent').checked).toBe(true);
      });

      it('disables the children of a disabled parent', async () => {
        host.parentDisabled.set(true);
        await render();
        expect(checkbox('#first').disabled).toBe(true);
        expect(content('#first').getAttribute('aria-disabled')).toBe('true');
        expect(query('#first').classList).toContain('disabled');

        host.parentDisabled.set(false);
        await render();
        expect(checkbox('#first').disabled).toBe(false);
        expect(query('#first').classList).not.toContain('disabled');
      });

      it('expands and collapses every node from the tree API called by the app', async () => {
        host.selectionTree().expandAll();
        await render();
        expect(content('#parent').getAttribute('aria-expanded')).toBe('true');
        expect(query('#parent > .clr-treenode-children').classList).toContain('is-expanded');

        host.selectionTree().collapseAll();
        await render();
        expect(content('#parent').getAttribute('aria-expanded')).toBe('false');
        expect(query('#parent > .clr-treenode-children').classList).not.toContain('is-expanded');
      });

      it('expands a node set from the app through the component instance', async () => {
        const parent = fixture.debugElement.query(By.css('#parent')).injector.get(ClrTreeNode);
        parent.expanded = true;
        await render();
        expect(content('#parent').getAttribute('aria-expanded')).toBe('true');
        expect(caret('#parent').querySelector('cds-icon').getAttribute('direction')).toBe('down');
      });

      it('renders strings localized after the tree was rendered', async () => {
        TestBed.inject(ClrCommonStringsService).localize({ unselectedTreeNode: 'Not chosen' });
        await render();
        expect(content('#first').querySelector('.clr-sr-only').textContent.trim()).toBe('Not chosen');
      });

      it('renders the projected content of the app', async () => {
        host.parentLabel.set('Renamed');
        await render();
        expect(content('#parent').textContent).toContain('Renamed');
      });
    });

    describe('link nodes', () => {
      // The link reports a change of its class from a mutation observer, in a microtask after the class changed.
      // Under Zone.js that microtask can come after the zone's own ones, so the test waits for the next task.
      async function renderClassChange() {
        await render();
        await new Promise(resolve => setTimeout(resolve));
        await render();
      }

      it('shows a link as selected when the app marks it active', async () => {
        expect(content('#linked').hasAttribute('aria-selected')).toBe(false);

        host.linkActive.set(true);
        await renderClassChange();
        expect(content('#linked').getAttribute('aria-selected')).toBe('true');

        host.linkActive.set(false);
        await renderClassChange();
        expect(content('#linked').hasAttribute('aria-selected')).toBe(false);
      });

      it('shows a link as selected when its class is set on the element, as routerLinkActive does', async () => {
        query('#linked .clr-treenode-link').classList.add('active');
        await renderClassChange();
        expect(content('#linked').getAttribute('aria-selected')).toBe('true');
      });

      it('follows a link added after the node was rendered', async () => {
        host.showLink.set(false);
        await render();
        host.linkActive.set(true);
        host.showLink.set(true);
        await renderClassChange();
        expect(content('#linked').getAttribute('aria-selected')).toBe('true');
      });

      it('stops observing the link when it is removed', async () => {
        const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect');
        host.showLink.set(false);
        await render();
        expect(disconnect).toHaveBeenCalledTimes(1);
        expect(content('#linked').hasAttribute('aria-selected')).toBe(false);
      });
    });

    describe('recursive nodes', () => {
      async function expandRoot() {
        caret('#recursive clr-tree-node').click();
        await render();
      }

      async function resolveChildren() {
        host.resolveChildren();
        // Let the promise reaction run before the next refresh.
        await Promise.resolve();
        await render();
      }

      it('renders new roots given by the app', async () => {
        host.roots.set([{ name: 'Other root' }]);
        await render();
        expect(query('#recursive').textContent).toContain('Other root');
        expect(query('#recursive').textContent).not.toContain('Root');
      });

      it('shows a spinner while the children load, then the children', async () => {
        await expandRoot();
        expect(query('#recursive .clr-treenode-spinner')).not.toBeNull();
        expect(caret('#recursive clr-tree-node')).toBeNull();

        await resolveChildren();
        expect(query('#recursive .clr-treenode-spinner')).toBeNull();
        expect(query('#recursive').textContent).toContain('Leaf');
        expect(query('#recursive').querySelectorAll('clr-tree-node').length).toBe(2);
      });

      it('removes and destroys the children of a lazy node on collapse, and loads them again on expand', async () => {
        await expandRoot();
        await resolveChildren();
        const root = fixture.debugElement.query(By.css('#recursive clr-tree-node')).injector.get(ClrTreeNode);
        const [leaf] = root._model._loadedChildren;
        const destroy = vi.spyOn(leaf, 'destroy');

        await expandRoot();
        expect(destroy).toHaveBeenCalled();
        expect(query('#recursive').querySelectorAll('clr-tree-node').length).toBe(1);

        await expandRoot();
        expect(query('#recursive .clr-treenode-spinner')).not.toBeNull();
        await resolveChildren();
        expect(query('#recursive').textContent).toContain('Leaf');
      });

      it('ignores children that arrive after the tree is destroyed', async () => {
        await expandRoot();
        host.showRecursive.set(false);
        await render();
        await resolveChildren();
        expect(query('#recursive')).toBeNull();
      });
    });
  });
}
