/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, PLATFORM_ID, ViewChild } from '@angular/core';
import { fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClrIcon } from '@clr/angular/icon';
import { expectActiveElementToBe, spec, TestContext } from '@clr/angular/testing';
import { ClrCommonStringsService, IfExpandService, Keys } from '@clr/angular/utils';

import { DeclarativeTreeNodeModel } from './models/declarative-tree-node.model';
import { RecursiveTreeNodeModel } from './models/recursive-tree-node.model';
import { ClrSelectedState } from './models/selected-state.enum';
import { TreeFeaturesService } from './tree-features.service';
import { TreeFocusManagerService } from './tree-focus-manager.service';
import { ClrTreeNode } from './tree-node';
import { ClrTreeViewModule } from './tree-view.module';

@Component({
  template: `
    <clr-tree-node #node [(clrSelected)]="selected" [(clrExpanded)]="expanded" [clrExpandable]="expandable">
      Hello world
      @if (withChild) {
        <clr-tree-node>Child</clr-tree-node>
      }
    </clr-tree-node>
  `,
  standalone: false,
})
class TestComponent {
  @ViewChild('node') tree: ClrTreeNode<void>;

  selected = ClrSelectedState.UNSELECTED;
  expanded = false;
  withChild = true;
  expandable: boolean | undefined;
}

@Component({
  template: `
    <clr-tree-node>
      <a href="href" class="clr-treenode-link" [class.active]="active">Hello world</a>
    </clr-tree-node>
  `,
  standalone: false,
})
class LinkTestComponent {
  active: boolean | undefined;
}

interface TsApiContext {
  node: ClrTreeNode<void>;
  parent: ClrTreeNode<void>;
  featureService: TreeFeaturesService<void>;
  expandService: IfExpandService;
  focusManagerService: TreeFocusManagerService<void>;
}

export default function (): void {
  describe('ClrTreeNode Component', () => {
    let testContext: TsApiContext;
    beforeEach(() => {
      testContext = {} as TsApiContext;
    });

    type Context = TestContext<ClrTreeNode<void>, TestComponent>;

    describe('Providers', () => {
      let testContext: Context;

      const getContext = spec(ClrTreeNode, TestComponent, ClrTreeViewModule, {
        imports: [NoopAnimationsModule, ClrIcon],
        providers: [TreeFocusManagerService],
      });
      beforeEach(() => {
        testContext = getContext() as Context;
      });

      it('declares a TreeFeaturesService provider', () => {
        expect(testContext.getClarityProvider(TreeFeaturesService, null)).not.toBeNull();
      });
    });

    describe('Typescript API', () => {
      beforeEach(() => {
        testContext.featureService = new TreeFeaturesService<void>();
        testContext.expandService = new IfExpandService();
        const stringsService = new ClrCommonStringsService();
        testContext.focusManagerService = new TreeFocusManagerService<void>();
        const platformID = { provide: PLATFORM_ID, useValue: 'browser' };
        testContext.parent = new ClrTreeNode(
          platformID,
          undefined,
          testContext.featureService,
          testContext.expandService,
          stringsService,
          testContext.focusManagerService,
          { nativeElement: document.createElement('div') },
          null
        );
        testContext.node = new ClrTreeNode(
          platformID,
          testContext.parent,
          testContext.featureService,
          testContext.expandService,
          stringsService,
          testContext.focusManagerService,
          { nativeElement: document.createElement('div') },
          null
        );
      });

      it('instantiates a DeclarativeTreeNodeModel', () => {
        expect(testContext.node._model instanceof DeclarativeTreeNodeModel).toBeTrue();
        expect(testContext.node._model.parent).toBe(testContext.parent._model);
      });

      it('is selected if the model is selected', () => {
        expect(testContext.node.selected).toBe(ClrSelectedState.UNSELECTED);
        testContext.node._model.selected.next(ClrSelectedState.SELECTED);
        expect(testContext.node.selected).toBe(ClrSelectedState.SELECTED);
      });

      it('selects the model when selected and propagates selection if the tree is eager', () => {
        testContext.featureService.eager = true;
        const spy = spyOn(testContext.node._model, 'setSelected');
        testContext.node.selected = ClrSelectedState.SELECTED;
        expect(spy).toHaveBeenCalledWith(ClrSelectedState.SELECTED, true, true);
        testContext.node.selected = ClrSelectedState.INDETERMINATE;
        expect(spy).toHaveBeenCalledWith(ClrSelectedState.INDETERMINATE, true, true);
      });

      it('selects the model when selected and does not propagate selection if the tree is lazy', () => {
        testContext.featureService.eager = false;
        const spy = spyOn(testContext.node._model, 'setSelected');
        testContext.node.selected = ClrSelectedState.SELECTED;
        expect(spy).toHaveBeenCalledWith(ClrSelectedState.SELECTED, false, false);
        testContext.node.selected = ClrSelectedState.INDETERMINATE;
        expect(spy).toHaveBeenCalledWith(ClrSelectedState.INDETERMINATE, false, false);
      });

      it('gracefully handles boolean selection', () => {
        testContext.node.selected = true;
        expect(testContext.node._model.selected.value).toBe(ClrSelectedState.SELECTED);
        testContext.node.selected = false;
        expect(testContext.node._model.selected.value).toBe(ClrSelectedState.UNSELECTED);
      });

      it('makes the tree selectable if selection is set', () => {
        expect(testContext.featureService.selectable).toBeFalse();
        testContext.node.selected = ClrSelectedState.UNSELECTED;
        expect(testContext.featureService.selectable).toBeTrue();
      });

      it('is not expandable by default', () => {
        expect(testContext.node.isExpandable()).toBeFalse();
      });

      it('is expandable if the Expand service is expandable', () => {
        testContext.expandService.expandable++;
        expect(testContext.node.isExpandable()).toBeTrue();
      });

      it('is expandable if it has children', () => {
        testContext.node._model.children.push(
          new DeclarativeTreeNodeModel(testContext.node._model as DeclarativeTreeNodeModel<void>)
        );
        expect(testContext.node.isExpandable()).toBeTrue();
      });

      it('is expandable handles no children', () => {
        testContext.node._model.children = undefined;
        expect(() => {
          testContext.node.isExpandable();
        }).not.toThrow();
      });

      it('is expanded if the expand service is', () => {
        expect(testContext.node.expanded).toBeFalse();
        testContext.expandService.toggle();
        expect(testContext.node.expanded).toBeTrue();
      });

      it('is expandable and does not fetch children if overriden to be expandable', () => {
        const recursiveModel = new RecursiveTreeNodeModel(null, null, () => undefined, testContext.featureService);
        const spy = spyOnProperty(recursiveModel, 'children', 'get');
        testContext.node._model = recursiveModel;
        testContext.node.expandable = true;
        expect(testContext.node.isExpandable()).toBeTrue();
        expect(spy).not.toHaveBeenCalled();
      });

      it('is not expandable and does not fetch children if overriden not to be expandable', () => {
        const recursiveModel = new RecursiveTreeNodeModel(null, null, () => undefined, testContext.featureService);
        const spy = spyOnProperty(recursiveModel, 'children', 'get');
        testContext.node._model = recursiveModel;
        testContext.node.expandable = false;
        expect(testContext.node.isExpandable()).toBeFalse();
        expect(spy).not.toHaveBeenCalled();
      });

      it('tells the expand service to expand', () => {
        testContext.node.expanded = true;
        expect(testContext.expandService.expanded).toBeTrue();
      });

      it('re enabled disabled root node can not change child disable status', () => {
        testContext.parent.expanded = true;
        expect(testContext.expandService.expanded).toBeTrue();

        testContext.node.disabled = true;
        expect(testContext.parent.disabled).toBeFalse();
        expect(testContext.node.disabled).toBeTrue();

        testContext.parent.disabled = true;
        expect(testContext.parent.disabled).toBeTrue();
        expect(testContext.node.disabled).toBeTrue();

        testContext.parent.disabled = false;
        expect(testContext.parent.disabled).toBeFalse();
        expect(testContext.node.disabled).toBeTrue();
      });
    });

    describe('Template API', () => {
      let testContext: Context;

      const getContext = spec(ClrTreeNode, TestComponent, ClrTreeViewModule, {
        imports: [NoopAnimationsModule, ClrIcon],
        providers: [TreeFocusManagerService],
      });
      beforeEach(() => {
        testContext = getContext() as Context;
      });

      it('offers a [(clrSelected)] two-way binding, but skips emitting output when setting input', () => {
        testContext.testComponent.selected = ClrSelectedState.SELECTED;
        testContext.detectChanges();
        expect(testContext.clarityDirective.selected).toBe(ClrSelectedState.SELECTED);
        testContext.clarityDirective.selected = ClrSelectedState.UNSELECTED;
        testContext.detectChanges();
        // This may seem unintuitive, but actually is due to the tree flickering issues.
        // We don't want to emit the change in this case, or it can get confused.
        // Here we are expecting that the output has not emitted.
        // See https://github.com/vmware/clarity/issues/3073
        expect<ClrSelectedState>(testContext.testComponent.selected).toBe(ClrSelectedState.SELECTED);
        // By setting the model here, we will emit the binding since it's not through the input
        testContext.clarityDirective._model.setSelected(ClrSelectedState.INDETERMINATE, true, true);
        testContext.detectChanges();
        expect<ClrSelectedState>(testContext.testComponent.selected).toBe(ClrSelectedState.INDETERMINATE);
      });

      it('offers a [(clrExpanded)] two-way binding', () => {
        testContext.testComponent.expanded = true;
        testContext.detectChanges();
        expect(testContext.clarityDirective.expanded).toBeTrue();
        testContext.clarityDirective.expanded = false;
        expect(testContext.testComponent.expanded).toBeFalse();
      });
    });

    describe('View', () => {
      let testContext: Context;

      const getContext = spec(ClrTreeNode, TestComponent, ClrTreeViewModule, {
        imports: [NoopAnimationsModule, ClrIcon],
        providers: [TreeFocusManagerService],
      });
      beforeEach(() => {
        testContext = getContext() as Context;
      });

      it('projects content', () => {
        expect(testContext.clarityElement.textContent).toContain('Hello world');
      });

      it('hides children when not expanded', () => {
        expect(testContext.clarityElement.querySelector('.clr-treenode-children').clientHeight).toBe(0);
        testContext.clarityDirective.expanded = true;
        testContext.detectChanges();
        expect(testContext.clarityElement.querySelector('.clr-treenode-children').clientHeight).not.toBe(0);
        expect(testContext.clarityElement.querySelector('.clr-treenode-children').textContent).toContain('Child');
      });

      it('adds the .clr-tree-node class to the host', () => {
        expect(testContext.clarityElement.classList).toContain('clr-tree-node');
      });

      it('displays a caret when expandable', () => {
        expect(testContext.clarityElement.querySelector('.clr-treenode-caret')).not.toBeNull();
        testContext.testComponent.withChild = false;
        testContext.detectChanges();
        expect(testContext.clarityElement.querySelector('.clr-treenode-caret')).toBeNull();
      });

      it('replaces the caret with a spinner when the expand service is loading', () => {
        testContext.getClarityProvider(IfExpandService).loading = true;
        testContext.detectChanges();
        expect(testContext.clarityElement.querySelector('.clr-treenode-caret')).toBeNull();
        expect(testContext.clarityElement.querySelector('.clr-treenode-spinner')).not.toBeNull();
      });

      it('replaces the caret with a spinner when the model is loading', () => {
        testContext.clarityDirective.isModelLoading = true;
        testContext.detectChanges();
        expect(testContext.clarityElement.querySelector('.clr-treenode-caret')).toBeNull();
        expect(testContext.clarityElement.querySelector('.clr-treenode-spinner')).not.toBeNull();
      });

      it('shows the spinner once the model starts loading, in a microtask', fakeAsync(() => {
        // The loading state can flip in the middle of a change detection pass, so it is not applied synchronously.
        testContext.clarityDirective._model.loading = true;
        expect(testContext.clarityDirective.isModelLoading).toBeFalse();
        // A microtask is enough: no timer per node when a large tree gets created.
        flushMicrotasks();
        expect(testContext.clarityDirective.isModelLoading).toBeTrue();
        testContext.detectChanges();
        expect(testContext.clarityElement.querySelector('.clr-treenode-spinner')).not.toBeNull();
      }));

      it('expands and collapses when the caret is clicked', () => {
        const caret: HTMLElement = testContext.clarityElement.querySelector('.clr-treenode-caret');
        caret.click();
        expect(testContext.clarityDirective.expanded).toBeTrue();
        caret.click();
        expect(testContext.clarityDirective.expanded).toBeFalse();
      });

      it('displays a checkbox when selectable', () => {
        expect(testContext.clarityElement.querySelector('input[type=checkbox]')).not.toBeNull();
        testContext.getClarityProvider(TreeFeaturesService).selectable = false;
        testContext.detectChanges();
        expect(testContext.clarityElement.querySelector('input[type=checkbox]')).toBeNull();
      });

      it('toggles selection when the checkbox is clicked', () => {
        const spy = spyOn(testContext.clarityDirective._model, 'toggleSelection').and.callThrough();
        const checkbox: HTMLElement = testContext.clarityElement.querySelector('input[type=checkbox]');
        checkbox.click();
        // Smart tree propagates selection
        expect(spy).toHaveBeenCalledWith(true);
        testContext.getClarityProvider(TreeFeaturesService).eager = false;
        checkbox.click();
        // Non-smart tree does not propagate selection
        expect(spy).toHaveBeenCalledWith(false);
      });

      it('marks the checkbox as unchecked when unselected', () => {
        const checkbox: HTMLInputElement = testContext.clarityElement.querySelector('input[type=checkbox]');
        testContext.clarityDirective.selected = ClrSelectedState.UNSELECTED;
        testContext.detectChanges();
        expect(checkbox.checked).toBeFalse();
        expect(checkbox.indeterminate).toBeFalse();
      });

      it('marks the checkbox as checked when selected', () => {
        const checkbox: HTMLInputElement = testContext.clarityElement.querySelector('input[type=checkbox]');
        testContext.clarityDirective.selected = ClrSelectedState.SELECTED;
        testContext.detectChanges();
        expect(checkbox.checked).toBeTrue();
        expect(checkbox.indeterminate).toBeFalse();
      });

      it('marks the checkbox as indeterminate when indeterminate', () => {
        const checkbox: HTMLInputElement = testContext.clarityElement.querySelector('input[type=checkbox]');
        testContext.clarityDirective.selected = ClrSelectedState.INDETERMINATE;
        testContext.detectChanges();
        expect(checkbox.checked).toBeFalse();
        expect(checkbox.indeterminate).toBeTrue();
      });

      it('adds the group role on the children container if the node has children', () => {
        testContext.clarityDirective.expanded = true;
        testContext.detectChanges();
        const childrenContainer = testContext.clarityElement.querySelector('.clr-treenode-children');
        expect(childrenContainer.getAttribute('role')).toBe('group');
        testContext.testComponent.withChild = false;
        testContext.detectChanges();
        expect(childrenContainer.getAttribute('role')).toBeNull();
      });
    });

    describe('A11y and Focus Management', () => {
      let testContext: Context;

      const getContext = spec(ClrTreeNode, TestComponent, ClrTreeViewModule, {
        imports: [NoopAnimationsModule, ClrIcon],
        providers: [TreeFocusManagerService],
      });
      beforeEach(() => {
        testContext = getContext() as Context;
      });

      let contentContainer: HTMLElement;
      let focusManager: TreeFocusManagerService<void>;

      beforeEach(() => {
        const untypedContext: any = testContext;

        focusManager = untypedContext.getClarityProvider(TreeFocusManagerService);
        contentContainer = untypedContext.clarityElement.querySelector('.clr-tree-node-content-container');
      });

      it('adds role treeitem to focusable div that contains node content', () => {
        expect(testContext.clarityElement.hasAttribute('role')).toBe(false, 'no duplicate treeitem role on parent');
        expect(contentContainer.getAttribute('role')).toBe('treeitem');
      });

      it('adds the aria-selected attribute and screen reader text to selected tree nodes', () => {
        testContext.clarityDirective.selected = ClrSelectedState.SELECTED;
        testContext.detectChanges();
        expect(contentContainer.getAttribute('aria-selected')).toBe('true');
        expect(contentContainer.textContent.trim().replace(/\s+/g, ' ')).toBe('Hello world selected');
      });

      it('adds the aria-selected attribute and screen reader text to unselected tree nodes', () => {
        testContext.clarityDirective.selected = ClrSelectedState.UNSELECTED;
        testContext.detectChanges();
        expect(contentContainer.getAttribute('aria-selected')).toBe('false');
        expect(contentContainer.textContent.trim().replace(/\s+/g, ' ')).toBe('Hello world unselected');
      });

      it('does not add the aria-selected attribute or screen reader text to non-selectable tree nodes', () => {
        testContext.getClarityProvider(TreeFeaturesService).selectable = false;
        testContext.detectChanges();
        expect(contentContainer.getAttribute('aria-selected')).toBeNull();
        expect(contentContainer.textContent.trim()).toBe('Hello world');
      });

      it('focuses on node content container', () => {
        testContext.clarityDirective.focusTreeNode();
        expectActiveElementToBe(contentContainer);
      });

      it('focuses node content container if caret button is focused', () => {
        const caretButton: HTMLElement = testContext.clarityElement.querySelector('.clr-treenode-caret');
        caretButton.focus();
        expectActiveElementToBe(contentContainer);
      });

      it('focuses node content container if checkbox is focused', () => {
        const checkbox: HTMLElement = testContext.clarityElement.querySelector('.clr-checkbox');
        checkbox.focus();
        expectActiveElementToBe(contentContainer);
      });

      it('assigns tabindex of 0 to content container when focusTreeNode() runs after the browser already focused it directly (e.g. mousedown over non-focusable content)', () => {
        // Regression test: clicking content with no focusable descendant (e.g. plain text) makes the
        // browser focus the container itself on mousedown, since it carries a tabindex attribute.
        // The follow-up mouseup still calls focusTreeNode(), but its "already focused" guard used to
        // skip setTabIndex(0) entirely in that case, leaving tabindex stuck at -1 forever and making
        // the node unreachable by Tab/Shift+Tab afterwards.
        contentContainer.focus();
        testContext.clarityDirective.focusTreeNode();
        expect(testContext.clarityDirective.contentContainerTabindex).toBe(0);
        expect(contentContainer.getAttribute('tabindex')).toBe('0');
      });

      it('assigns tabindex of -1 to content container by default', () => {
        expect(testContext.clarityDirective.contentContainerTabindex).toBe(-1);
        expect(contentContainer.getAttribute('tabindex')).toBe('-1');
      });

      it('focuses node content container if focus is requested', () => {
        testContext
          .getClarityProvider<TreeFocusManagerService<void>>(TreeFocusManagerService)
          .focusNode(testContext.clarityDirective._model);
        expectActiveElementToBe(contentContainer);
      });

      it('assigns tabindex of 0 to content container if focus is requested', () => {
        testContext
          .getClarityProvider<TreeFocusManagerService<void>>(TreeFocusManagerService)
          .focusNode(testContext.clarityDirective._model);
        testContext.detectChanges();
        expect(testContext.clarityDirective.contentContainerTabindex).toBe(0);
        expect(contentContainer.getAttribute('tabindex')).toBe('0');
      });

      it('assigns tabindex of -1 to content container if focus is requested on another node', () => {
        // the child node model requests focus here
        const anotherNodeModel = testContext.clarityDirective._model.children[0];
        testContext
          .getClarityProvider<TreeFocusManagerService<void>>(TreeFocusManagerService)
          .focusNode(anotherNodeModel);
        expect(testContext.clarityDirective.contentContainerTabindex).toBe(-1);
        testContext.detectChanges();
        expect(contentContainer.getAttribute('tabindex')).toBe('-1');
      });

      it('calls broadcastFocusedNode synchronously inside focusTreeNode before calling focus()', () => {
        // Verify the fix for CDE-3007: broadcastFocusedNode() must be called synchronously
        // inside focusTreeNode() so that peer nodes' checkTabIndex() fires before .focus() is called.
        // This prevents a window where multiple nodes have tabindex=0.
        const callOrder: string[] = [];
        const originalFocus = contentContainer.focus.bind(contentContainer);
        spyOn(contentContainer, 'focus').and.callFake(() => {
          callOrder.push('focus');
          originalFocus();
        });
        spyOn(focusManager, 'broadcastFocusedNode').and.callFake(() => {
          callOrder.push('broadcast');
        });

        testContext.clarityDirective.focusTreeNode();

        // broadcast must happen before focus so that peer nodes reset tabindex=-1 synchronously,
        // preventing a window where multiple nodes have tabindex=0 (which causes the double-Tab bug).
        const firstFocusIndex = callOrder.indexOf('focus');
        const firstBroadcastIndex = callOrder.indexOf('broadcast');
        expect(firstBroadcastIndex).toBeGreaterThanOrEqual(0);
        expect(firstFocusIndex).toBeGreaterThanOrEqual(0);
        expect(firstBroadcastIndex).toBeLessThan(firstFocusIndex);
      });

      it('takes default action which is toggling selection state on Enter key if node is selectable', () => {
        testContext.clarityDirective.selected = ClrSelectedState.UNSELECTED;
        expect(testContext.clarityDirective.selected as ClrSelectedState).toEqual(ClrSelectedState.UNSELECTED);
        contentContainer.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Enter }));
        expect(testContext.clarityDirective.selected as ClrSelectedState).toEqual(ClrSelectedState.SELECTED);
        contentContainer.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Enter }));
        expect(testContext.clarityDirective.selected as ClrSelectedState).toEqual(ClrSelectedState.UNSELECTED);
      });

      it('takes default action which is toggling selection state on Space key if node is selectable', () => {
        testContext.clarityDirective.selected = ClrSelectedState.UNSELECTED;
        expect(testContext.clarityDirective.selected as ClrSelectedState).toBe(ClrSelectedState.UNSELECTED);
        contentContainer.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Space }));
        expect(testContext.clarityDirective.selected as ClrSelectedState).toBe(ClrSelectedState.SELECTED);
        contentContainer.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Space }));
        expect(testContext.clarityDirective.selected as ClrSelectedState).toBe(ClrSelectedState.UNSELECTED);
      });

      it('calls focusManager.focusFirstVisibleNode on Home key', () => {
        spyOn(focusManager, 'focusFirstVisibleNode');
        contentContainer.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        expect(focusManager.focusFirstVisibleNode).toHaveBeenCalled();
      });

      it('calls focusManager.focusLastVisibleNode on End key', () => {
        spyOn(focusManager, 'focusLastVisibleNode');
        contentContainer.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        expect(focusManager.focusLastVisibleNode).toHaveBeenCalled();
      });

      it('calls focusManager.focusNodeAbove on ArrowUp key', () => {
        spyOn(focusManager, 'focusNodeAbove');
        contentContainer.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(focusManager.focusNodeAbove).toHaveBeenCalledWith(testContext.clarityDirective._model);
      });

      it('calls focusManager.focusNodeBelow on ArrowDown key', () => {
        spyOn(focusManager, 'focusNodeBelow');
        contentContainer.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(focusManager.focusNodeBelow).toHaveBeenCalledWith(testContext.clarityDirective._model);
      });

      it('expands collapsed node if expandable on ArrowRight key', () => {
        testContext.clarityDirective._model.children = [null]; // children array needs to have something
        expect(testContext.clarityDirective.expanded).toBeFalse();
        expect(testContext.clarityDirective.isExpandable()).toBeTrue();
        contentContainer.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(testContext.clarityDirective.expanded).toBeTrue();
      });

      it('toggles aria-expanded on expanded property value change on node content container', () => {
        testContext.clarityDirective._model.children = [null]; // children array needs to have something
        expect(testContext.clarityDirective.expanded).toBeFalse();
        expect(contentContainer.getAttribute('aria-expanded')).toBe('false');
        contentContainer.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(testContext.clarityDirective.expanded).toBeTrue();
        testContext.detectChanges();
        expect(contentContainer.getAttribute('aria-expanded')).toBe('true');
      });

      it('calls focusManager.focusNodeBelow if node is already expanded on ArrowRight key', () => {
        testContext.clarityDirective._model.children = [null]; // children array needs to have something
        testContext.clarityDirective.expanded = true;
        spyOn(focusManager, 'focusNodeBelow');
        contentContainer.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(focusManager.focusNodeBelow).toHaveBeenCalledWith(testContext.clarityDirective._model);
      });

      it('calls focusManager.focusNodeBelow if node is already disabled on ArrowDown key', () => {
        testContext.clarityDirective._model.children = [null]; // children array needs to have something
        testContext.clarityDirective.disabled = true;
        testContext.detectChanges();
        expect(contentContainer.getAttribute('aria-disabled')).toBe('true');
        expect(contentContainer.classList).toContain('clr-form-control-disabled');
        spyOn(focusManager, 'focusNodeBelow');
        contentContainer.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(focusManager.focusNodeBelow).toHaveBeenCalledWith(testContext.clarityDirective._model);
      });

      it('collapses expanded node on ArrowLeft key', () => {
        testContext.clarityDirective._model.children = [null]; // children array needs to have something
        testContext.clarityDirective.expanded = true;
        contentContainer.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(testContext.clarityDirective.expanded).toBeFalse();
      });

      it('calls focusManager.focusParent if node is already collapsed or not expandable on ArrowLeft key', () => {
        spyOn(focusManager, 'focusParent');
        contentContainer.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(focusManager.focusParent).toHaveBeenCalledWith(testContext.clarityDirective._model);
      });

      it('keeps the children out of reach from the moment the node collapses', () => {
        const childrenContainer: HTMLElement = testContext.clarityElement.querySelector('.clr-treenode-children');
        const child: HTMLElement = childrenContainer.querySelector('.clr-tree-node-content-container');
        const canFocus = (element: HTMLElement) => {
          element.focus();
          return document.activeElement === element;
        };
        // Collapsed from the start
        expect(canFocus(child)).toBeFalse();
        // Expanded, the children are reachable right away
        testContext.clarityDirective.expanded = true;
        testContext.detectChanges();
        expect(canFocus(child)).toBeTrue();
        // Collapsed again, they are out of reach at once: no window while the collapse animation runs.
        // A node gets collapsed from itself (ArrowLeft, or the caret, which focuses the node first).
        testContext.clarityDirective.focusTreeNode();
        testContext.clarityDirective.expanded = false;
        testContext.detectChanges();
        expect(canFocus(child)).toBeFalse();
        expect(childrenContainer.hasAttribute('inert')).toBeTrue();
      });

      it('skips rendering the children once the node has collapsed', async () => {
        const childrenContainer: HTMLElement = testContext.clarityElement.querySelector('.clr-treenode-children');
        const contentVisibility = () => getComputedStyle(childrenContainer).contentVisibility;
        expect(contentVisibility()).toBe('hidden');
        testContext.clarityDirective.expanded = true;
        testContext.detectChanges();
        await testContext.fixture.whenStable();
        expect(contentVisibility()).toBe('visible');
        testContext.clarityDirective.expanded = false;
        testContext.detectChanges();
        await testContext.fixture.whenStable();
        expect(contentVisibility()).toBe('hidden');
      });
    });

    describe('Ally with link nodes', () => {
      let testContext: Context;

      type Context = TestContext<ClrTreeNode<void>, LinkTestComponent>;

      const getContext = spec(ClrTreeNode, LinkTestComponent, ClrTreeViewModule, {
        imports: [NoopAnimationsModule, ClrIcon],
        providers: [TreeFocusManagerService],
      });
      beforeEach(() => {
        testContext = getContext() as Context;
      });

      let contentContainer: HTMLElement;

      beforeEach(() => {
        const untypedContext: any = testContext;

        contentContainer = untypedContext.clarityElement.querySelector('.clr-tree-node-content-container');
      });

      it('adds the aria-selected attribute and screen reader text for active tree node links', () => {
        testContext.testComponent.active = true;
        testContext.detectChanges();
        expect(contentContainer.getAttribute('aria-selected')).toBe('true');
        expect(contentContainer.textContent.trim().replace(/\s+/g, ' ')).toBe('Hello world selected');
      });

      it('does not add the aria-selected attribute or screen reader text for inactive tree node links', () => {
        testContext.testComponent.active = false;
        testContext.detectChanges();
        expect(contentContainer.getAttribute('aria-selected')).toBeNull();
        expect(contentContainer.textContent.trim()).toBe('Hello world');
      });

      it('removes the tree node link from the native tab sequence to prevent a double-Tab stop', () => {
        const link: HTMLElement = testContext.clarityElement.querySelector('.clr-treenode-link');
        expect(link.getAttribute('tabindex')).toBe('-1');
      });
    });
  });
}
