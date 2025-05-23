/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { animate, state, style, transition, trigger } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  PLATFORM_ID,
  QueryList,
  SkipSelf,
  ViewChild,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { Keys } from '../../utils/enums/keys.enum';
import { isKeyEitherLetterOrNumber, normalizeKey, preventArrowKeyScroll } from '../../utils/focus/key-focus/util';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { LoadingListener } from '../../utils/loading/loading-listener';
import { DeclarativeTreeNodeModel } from './models/declarative-tree-node.model';
import { ClrSelectedState } from './models/selected-state.enum';
import { TreeNodeModel } from './models/tree-node.model';
import { TREE_FEATURES_PROVIDER, TreeFeaturesService } from './tree-features.service';
import { TreeFocusManagerService } from './tree-focus-manager.service';
import { ClrTreeNodeLink } from './tree-node-link';

const LVIEW_CONTEXT_INDEX = 8;

// If the user types multiple keys without allowing 200ms to pass between them,
// then those keys are sent together in one request.
const TREE_TYPE_AHEAD_TIMEOUT = 200;

@Component({
  selector: 'clr-tree-node',
  templateUrl: './tree-node.html',
  providers: [TREE_FEATURES_PROVIDER, IfExpandService, { provide: LoadingListener, useExisting: IfExpandService }],
  animations: [
    trigger('toggleChildrenAnim', [
      transition('collapsed => expanded', [style({ height: 0 }), animate(200, style({ height: '*' }))]),
      transition('expanded => collapsed', [style({ height: '*' }), animate(200, style({ height: 0 }))]),
      state('expanded', style({ height: '*', 'overflow-y': 'visible' })),
      state('collapsed', style({ height: 0 })),
    ]),
  ],
  host: {
    '[class.clr-tree-node]': 'true',
    '[class.disabled]': 'this._model.disabled',
  },
})
export class ClrTreeNode<T> implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  // Allows the consumer to override our logic deciding if a node is expandable.
  // Useful for recursive trees that don't want to pre-load one level ahead just to know which nodes are expandable.
  @Input('clrExpandable') expandable: boolean | undefined;

  @Output('clrSelectedChange') selectedChange = new EventEmitter<ClrSelectedState>(false);
  @Output('clrExpandedChange') expandedChange = new EventEmitter<boolean>();

  STATES = ClrSelectedState;
  isModelLoading = false;
  nodeId = uniqueIdFactory();
  contentContainerTabindex = -1;
  _model: TreeNodeModel<T>;

  private skipEmitChange = false;
  private typeAheadKeyBuffer = '';
  private typeAheadKeyEvent = new Subject<string>();
  private subscriptions: Subscription[] = [];

  @ViewChild('contentContainer', { read: ElementRef, static: true }) private contentContainer: ElementRef<HTMLElement>;

  // @ContentChild would have been more succinct
  // but it doesn't offer a way to query only an immediate child
  @ContentChildren(ClrTreeNodeLink, { descendants: false }) private treeNodeLinkList: QueryList<ClrTreeNodeLink>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Optional()
    @SkipSelf()
    parent: ClrTreeNode<T>,
    public featuresService: TreeFeaturesService<T>,
    public expandService: IfExpandService,
    public commonStrings: ClrCommonStringsService,
    private focusManager: TreeFocusManagerService<T>,
    private elementRef: ElementRef<HTMLElement>,
    injector: Injector
  ) {
    if (featuresService.recursion) {
      // I'm completely stuck, we have to hack into private properties until either
      // https://github.com/angular/angular/issues/14935 or https://github.com/angular/angular/issues/15998
      // are fixed
      // This is for non-ivy implementations
      if ((injector as any).view) {
        this._model = (injector as any).view.context.clrModel;
      } else {
        // Ivy puts this on a specific index of a _lView property
        this._model = (injector as any)._lView[LVIEW_CONTEXT_INDEX].clrModel;
      }
    } else {
      // Force cast for now, not sure how to tie the correct type here to featuresService.recursion
      this._model = new DeclarativeTreeNodeModel(parent ? (parent._model as DeclarativeTreeNodeModel<T>) : null);
    }
    this._model.nodeId = this.nodeId;
  }

  @Input('clrDisabled')
  get disabled(): boolean {
    return this._model.disabled;
  }
  set disabled(value: boolean) {
    this._model.disabled = value;
  }

  @Input('clrSelected')
  get selected(): ClrSelectedState | boolean {
    return this._model.selected.value;
  }
  set selected(value: ClrSelectedState | boolean) {
    this.featuresService.selectable = true;
    // Gracefully handle falsy states like null or undefined because it's just easier than answering questions.
    // This shouldn't happen with strict typing on the app's side, but it's not up to us.
    if (value === null || typeof value === 'undefined') {
      value = ClrSelectedState.UNSELECTED;
    }
    // We match booleans to the corresponding ClrSelectedState
    if (typeof value === 'boolean') {
      value = value ? ClrSelectedState.SELECTED : ClrSelectedState.UNSELECTED;
    }
    // We propagate only if the tree is in smart mode, and skip emitting the output when we set the input
    // See https://github.com/vmware/clarity/issues/3073
    this.skipEmitChange = true;
    this._model.setSelected(value, this.featuresService.eager, this.featuresService.eager);
    this.skipEmitChange = false;
  }

  // I'm caving on this, for tree nodes I think we can tolerate having a two-way binding on the component
  // rather than enforce the clrIfExpanded structural directive for dynamic cases. Mostly because for the smart
  // case, you can't use a structural directive, it would need to go on an ng-container.
  @Input('clrExpanded')
  get expanded(): boolean {
    return this.expandService.expanded;
  }
  set expanded(value: boolean) {
    this.expandService.expanded = value;
  }

  @Input('clrForTypeAhead')
  set clrForTypeAhead(value: string) {
    this._model.textContent = trimAndLowerCase(value || this.elementRef.nativeElement.textContent);
  }

  get ariaSelected(): boolean {
    if (this.isSelectable()) {
      return this._model.selected.value === ClrSelectedState.SELECTED;
    } else if (this.treeNodeLink?.active) {
      return true;
    } else {
      return null;
    }
  }

  get treeNodeLink() {
    return this.treeNodeLinkList && this.treeNodeLinkList.first;
  }

  private get isParent() {
    return this._model.children && this._model.children.length > 0;
  }

  ngOnInit() {
    this._model.expanded = this.expanded;
    this._model.disabled = this.disabled;
    this.subscriptions.push(
      this._model.selected.pipe(filter(() => !this.skipEmitChange)).subscribe(value => {
        this.selectedChange.emit(value);
      })
    );
    this.subscriptions.push(
      this.expandService.expandChange.subscribe(value => {
        this.expandedChange.emit(value);
        this._model.expanded = value;
      })
    );
    this.subscriptions.push(
      this.focusManager.focusRequest.subscribe(nodeId => {
        if (this.nodeId === nodeId) {
          this.focusTreeNode();
        }
      }),
      this.focusManager.focusChange.subscribe(nodeId => {
        this.checkTabIndex(nodeId);
      })
    );

    this.subscriptions.push(
      this._model.loading$.pipe(debounceTime(0)).subscribe(isLoading => (this.isModelLoading = isLoading))
    );
  }

  ngAfterContentInit() {
    this.subscriptions.push(
      this.typeAheadKeyEvent.pipe(debounceTime(TREE_TYPE_AHEAD_TIMEOUT)).subscribe((bufferedKeys: string) => {
        this.focusManager.focusNodeStartsWith(bufferedKeys, this._model);
        // reset once bufferedKeys are used
        this.typeAheadKeyBuffer = '';
      })
    );
  }

  ngAfterViewInit() {
    if (!this._model.textContent) {
      this._model.textContent = trimAndLowerCase(this.elementRef.nativeElement.textContent);
    }
  }

  ngOnDestroy() {
    this._model.destroy();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  isExpandable() {
    if (typeof this.expandable !== 'undefined') {
      return this.expandable;
    }
    return !!this.expandService.expandable || this.isParent;
  }

  isSelectable() {
    return this.featuresService.selectable;
  }

  focusTreeNode(): void {
    const containerEl = this.contentContainer.nativeElement;
    if (isPlatformBrowser(this.platformId) && document.activeElement !== containerEl) {
      this.setTabIndex(0);
      containerEl.focus();
      containerEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  broadcastFocusOnContainer() {
    this.focusManager.broadcastFocusedNode(this.nodeId);
  }

  onKeyDown(event: KeyboardEvent) {
    // Two reasons to prevent default behavior:
    // 1. to prevent scrolling on arrow keys
    // 2. Assistive Technology focus differs from Keyboard focus behavior.
    //    By default, pressing arrow key makes AT focus go into the nested content of the item.
    preventArrowKeyScroll(event);

    // https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-22
    switch (normalizeKey(event.key)) {
      case Keys.ArrowUp:
        this.focusManager.focusNodeAbove(this._model);
        break;
      case Keys.ArrowDown:
        this.focusManager.focusNodeBelow(this._model);
        break;
      case Keys.ArrowRight:
        this.expandOrFocusFirstChild();
        break;
      case Keys.ArrowLeft:
        this.collapseOrFocusParent();
        break;
      case Keys.Home:
        event.preventDefault();
        this.focusManager.focusFirstVisibleNode();
        break;
      case Keys.End:
        event.preventDefault();
        this.focusManager.focusLastVisibleNode();
        break;
      case Keys.Enter:
        this.toggleExpandOrTriggerDefault();
        break;
      case Keys.Space:
      case Keys.Spacebar:
        // to prevent scrolling on space key in this specific case
        event.preventDefault();
        this.toggleExpandOrTriggerDefault();
        break;
      default:
        if (this._model.textContent && isKeyEitherLetterOrNumber(event)) {
          this.typeAheadKeyBuffer += event.key;
          this.typeAheadKeyEvent.next(this.typeAheadKeyBuffer);
          return;
        }
        break;
    }

    // if non-letter keys are pressed, do reset.
    this.typeAheadKeyBuffer = '';
  }

  private setTabIndex(value: number) {
    this.contentContainerTabindex = value;
    this.contentContainer.nativeElement.setAttribute('tabindex', value.toString());
  }

  private checkTabIndex(nodeId: string): void {
    if (isPlatformBrowser(this.platformId) && this.nodeId !== nodeId && this.contentContainerTabindex !== -1) {
      this.setTabIndex(-1);
    }
  }

  private toggleExpandOrTriggerDefault() {
    if (this.disabled) {
      return;
    }

    if (this.isExpandable() && !this.isSelectable()) {
      this.expandService.expanded = !this.expanded;
    } else {
      this.triggerDefaultAction();
    }
  }

  private expandOrFocusFirstChild() {
    if (this.disabled) {
      return;
    }

    if (this.expanded) {
      // if the node is already expanded and has children, focus its very first child
      if (this.isParent) {
        this.focusManager.focusNodeBelow(this._model);
      }
    } else {
      // we must check if the node is expandable, in order to set .expanded to true from false
      // because we shouldn't set .expanded to true if it's not expandable node
      if (this.isExpandable()) {
        this.expandService.expanded = true;
      }
    }
  }

  private collapseOrFocusParent() {
    if (this.disabled) {
      return;
    }

    if (this.expanded) {
      this.expandService.expanded = false;
    } else {
      this.focusManager.focusParent(this._model);
    }
  }

  private triggerDefaultAction() {
    if (this.treeNodeLink) {
      this.treeNodeLink.activate();
    } else {
      if (this.isSelectable()) {
        this._model.toggleSelection(this.featuresService.eager);
      }
    }
  }
}

function trimAndLowerCase(value: string) {
  return value.toLocaleLowerCase().trim();
}
