/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { IfExpandService } from '@clr/angular/utils';
import { Subscription } from 'rxjs';

import { VerticalNavGroupService } from './providers/vertical-nav-group.service';

const EXPANDED_STATE = 'expanded';
const COLLAPSED_STATE = 'collapsed';

@Component({
  selector: 'clr-vertical-nav-group-children',
  template: `<ng-content></ng-content>`,
  animations: [
    trigger('clrExpand', [
      state(EXPANDED_STATE, style({ height: '*' })),
      state(COLLAPSED_STATE, style({ height: 0, visibility: 'hidden' })),
      transition(`${EXPANDED_STATE} <=> ${COLLAPSED_STATE}`, animate('0.2s ease-in-out')),
    ]),
  ],
  host: { class: 'nav-group-children' },
  standalone: false,
})
export class ClrVerticalNavGroupChildren implements OnInit, OnDestroy {
  private expandAnimationState: string = COLLAPSED_STATE;
  private subscription: Subscription;

  constructor(
    private navGroupService: VerticalNavGroupService,
    private expandService: IfExpandService
  ) {}

  @HostBinding('@clrExpand')
  get expandAnimation() {
    return this.expandAnimationState;
  }

  ngOnInit() {
    this.subscription = this.navGroupService.expandAnimationState.subscribe(animState => {
      this.expandAnimationState = animState;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  @HostListener('@clrExpand.done', ['$event'])
  onExpandAnimationDone(event: AnimationEvent) {
    if (event.toState === COLLAPSED_STATE) {
      this.expandService.expanded = false;
    }
  }
}
