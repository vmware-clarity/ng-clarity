/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterContentInit,
  afterNextRender,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  inject,
  Injector,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { animateHeight, ClrCommonStringsService, IfExpandService, measureHeight } from '@clr/angular/utils';
import { Subscription } from 'rxjs';

import { VerticalNavGroupRegistrationService } from './providers/vertical-nav-group-registration.service';
import { VerticalNavGroupService } from './providers/vertical-nav-group.service';
import { VerticalNavService } from './providers/vertical-nav.service';

const EXPANDED_STATE = 'expanded';
const COLLAPSED_STATE = 'collapsed';

@Component({
  selector: 'clr-vertical-nav-group',
  templateUrl: './vertical-nav-group.html',
  providers: [IfExpandService, VerticalNavGroupService],
  host: { class: 'nav-group' },
  standalone: false,
})
export class ClrVerticalNavGroup implements AfterContentInit, OnDestroy {
  @Output('clrVerticalNavGroupExpandedChange') expandedChange = new EventEmitter<boolean>(true);

  /**
   * Set when Angular adds the children container (see the template): once the group is rendered, and only when
   * animations are enabled, as Angular calls `animate.enter` handlers only then.
   */
  protected animatesChildren = false;

  private wasExpanded = false;
  private _subscriptions: Subscription[] = [];
  private _expandAnimationState: string = COLLAPSED_STATE;
  private readonly injector = inject(Injector);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('children', { static: true }) private children: ElementRef<HTMLElement>;

  constructor(
    private _itemExpand: IfExpandService,
    private _navGroupRegistrationService: VerticalNavGroupRegistrationService,
    navGroupService: VerticalNavGroupService,
    private _navService: VerticalNavService,
    public commonStrings: ClrCommonStringsService
  ) {
    _navGroupRegistrationService.registerNavGroup();

    // FIXME: This subscription handles a corner case
    // Vertical Nav collapse requires the animation to run first and then
    // remove the nodes from the DOM. If the user directly sets the input
    // on the clrIfExpanded directive, we have no chance to run the animation
    // and wait for it to complete. This subscription makes sure that the
    // animation states are correct for that edge case.
    this._subscriptions.push(
      _itemExpand.expandChange.subscribe(value => {
        if (value && this.expandAnimationState === COLLAPSED_STATE) {
          if (_navService.collapsed) {
            _navService.collapsed = false;
          }
          this.expandAnimationState = EXPANDED_STATE;
        } else if (!value && this.expandAnimationState === EXPANDED_STATE) {
          this.expandAnimationState = COLLAPSED_STATE;
        }
      })
    );

    // 1. If the nav is collapsing, close the open nav group + save its state
    // 2. If the nav is expanding, expand the nav group if the previous state was expanded
    this._subscriptions.push(
      _navService.animateOnCollapsed.subscribe((goingToCollapse: boolean) => {
        if (goingToCollapse && this.expanded) {
          this.wasExpanded = true;
          this.collapseGroup();
        } else if (!goingToCollapse && this.wasExpanded) {
          this.expandGroup();
          this.wasExpanded = false;
        }
      })
    );

    // If a link is clicked, expand the nav group
    this._subscriptions.push(
      navGroupService.expandChange.subscribe((expand: boolean) => {
        if (expand && !this.expanded) {
          this.expandGroup();
        }
      })
    );
  }

  @HostBinding('class.is-expanded')
  get expanded(): boolean {
    return this._itemExpand.expanded;
  }
  set expanded(value: boolean) {
    if (this._itemExpand.expanded !== value) {
      this._itemExpand.expanded = value;
      this.expandedChange.emit(value);
    }
  }

  @Input('clrVerticalNavGroupExpanded')
  set userExpandedInput(value: boolean | string) {
    value = !!value;
    if (this.expanded !== value) {
      // We have to call toggleExpand because some cases require animations to occur first
      // Directly setting the Expand service value skips the animation and can result in
      // nodes in the DOM but the nav group still being collapsed
      this.toggleExpand();
    }
  }

  get expandAnimationState(): string {
    return this._expandAnimationState;
  }
  set expandAnimationState(value: string) {
    if (value !== this._expandAnimationState) {
      this._expandAnimationState = value;
    }
  }

  ngAfterContentInit() {
    // This makes sure that if someone marks a nav group expanded in a collapsed nav
    // the expanded property is switched back to collapsed state.
    if (this._navService.collapsed && this.expanded) {
      this.wasExpanded = true;
      this.collapseGroup();
    }
  }

  ngOnDestroy() {
    this._subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
    this._navGroupRegistrationService.unregisterNavGroup();
  }

  expandGroup(): void {
    this.animateChildrenExpand();
    this.expanded = true;
    this.expandAnimationState = EXPANDED_STATE;
  }

  collapseGroup(): void {
    this.expandAnimationState = COLLAPSED_STATE;
    // The group closes, removing its children, once they are collapsed.
    const children = this.children.nativeElement;
    const animation = this.animatesChildren ? animateHeight(children, { from: measureHeight(children), to: 0 }) : null;
    if (animation) {
      animation.finished.then(
        () => this.closeGroup(),
        () => {
          // Expanded again while collapsing.
        }
      );
    } else {
      this.closeGroup();
    }
  }

  /** @deprecated No longer called: the group closes once its children are collapsed. To be removed in a future major version. */
  expandAnimationDone(_$event: { toState: string }) {
    // Nothing to do.
  }

  toggleExpand(): void {
    if (this.expanded) {
      this.collapseGroup();
    } else {
      // If nav is collasped, first open the nav
      if (this._navService.collapsed) {
        this._navService.collapsed = false;
      }
      // then expand the nav group
      this.expandGroup();
    }
  }

  /** Animates the children from their current height to the one they have once the group is expanded. */
  private animateChildrenExpand() {
    if (!this.animatesChildren) {
      return;
    }
    const children = this.children.nativeElement;
    const from = measureHeight(children);
    afterNextRender({ read: () => animateHeight(children, { from }) }, { injector: this.injector });
  }

  private closeGroup() {
    if (this.expandAnimationState === COLLAPSED_STATE) {
      this.expanded = false;
      this.cdr.markForCheck();
    }
  }
}
