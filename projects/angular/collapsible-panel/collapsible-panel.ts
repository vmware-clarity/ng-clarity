/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  afterNextRender,
  AnimationCallbackEvent,
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { animateHeight, expandHeight, IfExpandService, measureHeight, uniqueIdFactory } from '@clr/angular/utils';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { CollapsiblePanelModel } from './models/collapsible-panel.model';
import { CollapsiblePanelService } from './providers/collapsible-panel.service';

@Directive()
export abstract class CollapsiblePanel implements OnInit {
  panelOpen = false;
  panelOpenChange = new EventEmitter<boolean>();

  panel: Observable<CollapsiblePanelModel>;

  protected _panelIndex: number;
  /**
   * Set to `true` to collapse the content of a closing panel: the template keeps the content while `contentCollapsing`
   * is set, and the projected content is removed once the content is collapsed.
   */
  protected animatesCollapse = false;
  /** Set while the content of a closing panel collapses. */
  protected contentCollapsing = false;

  private _id = uniqueIdFactory();
  private rendered = false;
  /** Set when Angular animates the content, which it does not when animations are disabled or on the server. */
  private content: HTMLElement;

  constructor(
    protected panelService: CollapsiblePanelService,
    protected ifExpandService: IfExpandService,
    protected cdr: ChangeDetectorRef
  ) {
    // The content of a panel open on the first render shows without animation.
    afterNextRender(() => (this.rendered = true));
  }

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  abstract get disabled(): boolean;

  ngOnInit() {
    this.panelService.addPanel(this.id, this.panelOpen);
    this.panelService.disablePanel(this.id, this.disabled);
    this.panel = this.panelService.getPanelChanges(this.id).pipe(
      filter(panel => !!panel),
      tap(panel => this.emitPanelChange(panel))
    );
  }

  togglePanel() {
    this.panelService.togglePanel(this.id);
  }

  collapsePanelOnAnimationDone(panel: CollapsiblePanelModel) {
    if (!panel.open) {
      this.ifExpandService.expanded = false;
    }
  }

  /** `animate.enter` handler of the content. */
  protected expandContent(event: AnimationCallbackEvent) {
    this.content = event.target as HTMLElement;
    if (this.rendered) {
      expandHeight(event);
    }
  }

  protected handlePanelInputChanges(changes: SimpleChanges) {
    if (this.panel && changes.panelOpen && changes.panelOpen.currentValue !== changes.panelOpen.previousValue) {
      this.panelService.togglePanel(this.id, changes.panelOpen.currentValue);
    }

    if (this.panel && changes.disabled && changes.disabled.currentValue !== changes.disabled.previousValue) {
      this.panelService.disablePanel(this.id, changes.disabled.currentValue);
    }
  }

  private emitPanelChange(panel: CollapsiblePanelModel) {
    if (panel.index !== this._panelIndex) {
      this._panelIndex = panel.index;
      this.cdr.detectChanges();
    }

    if (panel.open !== this.panelOpen) {
      this.panelOpenChange.emit(panel.open);
      this.panelOpen = panel.open;
    }

    if (panel.open) {
      this.ifExpandService.expanded = true;
      if (this.contentCollapsing) {
        this.contentCollapsing = false;
        animateHeight(this.content, { from: measureHeight(this.content) });
      }
    } else if (this.animatesCollapse && this.content) {
      if (!this.contentCollapsing) {
        this.collapseContent();
      }
    } else {
      this.removeClosedContent();
    }
  }

  /**
   * Not an `animate.leave` handler: Angular cancels the leave animation of an element when the same element of another
   * instance of the template enters, as the content of the next step does when a step closes.
   */
  private collapseContent() {
    const animation = animateHeight(this.content, { from: measureHeight(this.content), to: 0 });
    if (!animation) {
      this.content = null;
      this.removeClosedContent();
      return;
    }
    this.contentCollapsing = true;
    animation.finished.then(
      () => {
        this.content = null;
        this.contentCollapsing = false;
        this.removeClosedContent();
        this.cdr.markForCheck();
      },
      () => {
        // Canceled: the panel opened again.
      }
    );
  }

  private removeClosedContent() {
    if (!this.panelOpen) {
      this.ifExpandService.expanded = false;
    }
  }

  abstract getPanelStateClasses(panel: CollapsiblePanelModel): string;
  abstract getContentId(id: string): string;
  abstract getHeaderId(id: string): string;
}
