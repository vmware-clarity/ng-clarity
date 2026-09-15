/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Injector,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ClrAnimationsService, ClrInitialRenderState, IfExpandService, uniqueIdFactory } from '@clr/angular/utils';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { CollapsiblePanelModel } from './models/collapsible-panel.model';
import { CollapsiblePanelService } from './providers/collapsible-panel.service';

/** Applied to the panel content while it expands, see `_mixins.collapsible-panel.scss`. */
export const COLLAPSIBLE_PANEL_EXPANDING_CLASS = 'clr-collapsible-panel-expanding';
/** Applied to the panel content while it collapses, see `_mixins.collapsible-panel.scss`. */
export const COLLAPSIBLE_PANEL_COLLAPSING_CLASS = 'clr-collapsible-panel-collapsing';

/**
 * Base class of the accordion and stepper panels.
 *
 * The template of a panel is expected to render its content while `panel.open || collapsing` is true, with the
 * `panelContent` template reference, the `collapsing` class and the enter animation bound to the content element:
 *
 * ```html
 * @if (panel.open || collapsing) {
 *   <div #panelContent [animate.enter]="contentEnterClass" [class.clr-collapsible-panel-collapsing]="collapsing">
 * ```
 *
 * Binding the `collapsing` class is what animates the collapse; a panel that only animates its expansion leaves it out
 * and sets `animatesCollapse` to `false`.
 */
@Directive()
export abstract class CollapsiblePanel implements OnInit, AfterViewInit {
  panelOpen = false;
  panelOpenChange = new EventEmitter<boolean>();

  panel: Observable<CollapsiblePanelModel>;

  /**
   * Whether the panel content is playing its collapse animation. The content stays rendered until it is done.
   */
  collapsing = false;

  protected _panelIndex: number;

  /** Whether the template animates the collapse of the content by binding the `collapsing` class. */
  protected readonly animatesCollapse: boolean = true;

  @ViewChild('panelContent') private readonly panelContent: ElementRef<HTMLElement>;

  private _id = uniqueIdFactory();
  private initialRender: ClrInitialRenderState = { done: false };
  private destroyed = false;
  private readonly injector = inject(Injector);
  private readonly animations = inject(ClrAnimationsService);

  constructor(
    protected panelService: CollapsiblePanelService,
    protected ifExpandService: IfExpandService,
    protected cdr: ChangeDetectorRef
  ) {
    inject(DestroyRef).onDestroy(() => (this.destroyed = true));
  }

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  abstract get disabled(): boolean;

  /**
   * Class animating the expansion of the panel content, meant for its `animate.enter` binding.
   * Content that is open when the panel is first rendered is not animated.
   */
  get contentEnterClass(): string {
    return this.initialRender.done ? COLLAPSIBLE_PANEL_EXPANDING_CLASS : '';
  }

  ngOnInit() {
    this.panelService.addPanel(this.id, this.panelOpen);
    this.panelService.disablePanel(this.id, this.disabled);
    this.panel = this.panelService.getPanelChanges(this.id).pipe(
      filter(panel => !!panel),
      tap(panel => this.emitPanelChange(panel))
    );
  }

  ngAfterViewInit() {
    this.initialRender = this.animations.trackInitialRender(this.injector);
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
      if (!panel.open) {
        this.collapseContent(panel);
      }
    }

    if (panel.open) {
      this.collapsing = false;
      this.ifExpandService.expanded = true;
    }
  }

  private collapseContent(panel: CollapsiblePanelModel) {
    if (this.destroyed) {
      return;
    }

    if (this.animations.disabled || !this.animatesCollapse) {
      // The next change detection removes the content; clean up right after it, like a completed animation would.
      Promise.resolve().then(() => this.collapsePanelOnAnimationDone(panel));
      return;
    }

    this.collapsing = true;

    this.animations
      .whenCompleteAfterRender(() => this.panelContent?.nativeElement, this.injector)
      .then(() => {
        if (!this.collapsing || this.destroyed) {
          return; // the panel was opened again or destroyed in the meantime
        }
        this.collapsing = false;
        // Remove the content right away rather than on the next change detection, which is what the
        // tests of applications using the panels expect.
        this.cdr.detectChanges();
        this.collapsePanelOnAnimationDone(panel);
      });
  }

  abstract getPanelStateClasses(panel: CollapsiblePanelModel): string;
  abstract getContentId(id: string): string;
  abstract getHeaderId(id: string): string;
}
