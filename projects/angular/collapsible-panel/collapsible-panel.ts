/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { afterNextRender, ChangeDetectorRef, Directive, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { IfExpandService, uniqueIdFactory } from '@clr/angular/utils';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { CollapsiblePanelModel } from './models/collapsible-panel.model';
import { CollapsiblePanelService } from './providers/collapsible-panel.service';

/**
 * Base class of the accordion and stepper panels.
 *
 * The content of a panel expands with the `clr-expand-enter` CSS animation, bound in the template with
 * `<div [animate.enter]="expandClass">` (and can collapse with `animate.leave="clr-collapse-leave"`).
 */
@Directive()
export abstract class CollapsiblePanel implements OnInit {
  panelOpen = false;
  panelOpenChange = new EventEmitter<boolean>();

  panel: Observable<CollapsiblePanelModel>;

  /** Enter animation of the content: none for the content open on the first render. */
  protected expandClass = '';

  protected _panelIndex: number;
  private _id = uniqueIdFactory();

  constructor(
    protected panelService: CollapsiblePanelService,
    protected ifExpandService: IfExpandService,
    protected cdr: ChangeDetectorRef
  ) {
    // Not for the content open on the first render (see `emitPanelChange`).
    afterNextRender(() => {
      if (!this.panelOpen) {
        this.expandClass = 'clr-expand-enter';
      }
    });
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
    } else if (this.ifExpandService.expanded) {
      // Content open on the first render animates from its next opening.
      this.expandClass = 'clr-expand-enter';
      this.collapsePanelOnAnimationDone(panel);
    }
  }

  abstract getPanelStateClasses(panel: CollapsiblePanelModel): string;
  abstract getContentId(id: string): string;
  abstract getHeaderId(id: string): string;
}
