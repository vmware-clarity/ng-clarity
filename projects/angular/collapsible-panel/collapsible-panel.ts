/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AnimationCallbackEvent,
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
import {
  ClrAnimationsService,
  ClrHeightAnimation,
  ClrInitialRenderState,
  IfExpandService,
  uniqueIdFactory,
} from '@clr/angular/utils';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { CollapsiblePanelModel } from './models/collapsible-panel.model';
import { CollapsiblePanelService } from './providers/collapsible-panel.service';

/**
 * Base class of the accordion and stepper panels.
 *
 * The template of a panel is expected to render its content while `panel.open` is true, with the `panelContent`
 * template reference and `animateCollapse()` as the `animate.leave` callback of the content element:
 *
 * ```html
 * @if (panel.open) {
 *   <div #panelContent (animate.leave)="animateCollapse($event)">
 * ```
 *
 * The height of the content is animated when it expands and collapses: Angular keeps the content rendered until its
 * collapse animation is done. A panel that only animates its expansion leaves out the `animate.leave` callback and sets
 * `animatesCollapse` to `false`.
 */
@Directive()
export abstract class CollapsiblePanel implements OnInit {
  panelOpen = false;
  panelOpenChange = new EventEmitter<boolean>();

  panel: Observable<CollapsiblePanelModel>;

  protected _panelIndex: number;

  /** Whether the template animates the collapse of the content with `animateCollapse()`. */
  protected readonly animatesCollapse: boolean = true;

  private _id = uniqueIdFactory();
  // ECMAScript private fields, so that they cannot clash with the members of existing subclasses.
  #destroyed = false;
  readonly #injector = inject(Injector);
  readonly #animations = inject(ClrAnimationsService);
  // Tracked from construction rather than from `ngAfterViewInit()`, which subclasses may override without `super`.
  readonly #initialRender: ClrInitialRenderState = this.#animations.trackInitialRender(this.#injector);
  readonly #heightAnimation = new ClrHeightAnimation(this.#injector);
  #content: HTMLElement | undefined;
  /** Panel whose content is about to collapse, set until its `animate.leave` callback runs. */
  #collapsingPanel: CollapsiblePanelModel | null = null;
  /** Content playing its collapse animation, and the callback letting Angular remove it. */
  #leaving: { element: HTMLElement; complete: () => void } | null = null;
  /** Height the next content expands from, when the panel is opened again while its content collapses. */
  #expandFrom = 0;

  constructor(
    protected panelService: CollapsiblePanelService,
    protected ifExpandService: IfExpandService,
    protected cdr: ChangeDetectorRef
  ) {
    inject(DestroyRef).onDestroy(() => {
      this.#destroyed = true;
      this.#heightAnimation.cancel();
      this.#leaving?.complete();
      this.#leaving = null;
    });
  }

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  abstract get disabled(): boolean;

  // Content that is open when the panel is first rendered is not animated.
  @ViewChild('panelContent')
  private set panelContent(content: ElementRef<HTMLElement> | undefined) {
    const element = content?.nativeElement;
    if (element && element !== this.#content && this.#initialRender.done) {
      this.#heightAnimation.expand(() => element, this.#expandFrom);
    }
    this.#expandFrom = 0;
    this.#content = element;
  }

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

  /**
   * `animate.leave` callback of the panel content: collapses its height, then lets Angular remove it.
   */
  protected animateCollapse(event: AnimationCallbackEvent) {
    const element = event.target as HTMLElement;
    const panel = this.#collapsingPanel;
    this.#collapsingPanel = null;
    // The panel is closed already: keep its content displayed while it collapses.
    element.classList.add('clr-collapsible-panel-collapsing');
    const animation = panel && !this.#destroyed ? this.#heightAnimation.collapse(element) : null;
    if (!animation) {
      event.animationComplete();
      if (panel) {
        this.collapsePanelOnAnimationDone(panel);
      }
      return;
    }

    const leaving = { element, complete: () => event.animationComplete() };
    this.#leaving = leaving;
    animation.finished.then(
      () => {
        if (this.#leaving !== leaving) {
          return; // the panel was opened again in the meantime
        }
        this.#leaving = null;
        leaving.complete();
        if (!this.#destroyed) {
          this.collapsePanelOnAnimationDone(panel);
        }
      },
      () => {
        // Cancelled: the panel was opened again or destroyed.
      }
    );
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
        this.#collapseContent(panel);
      }
    }

    if (panel.open) {
      this.#collapsingPanel = null;
      if (this.#leaving) {
        // Opened again while the content collapses: remove the collapsing content and expand the new one from there.
        const { element, complete } = this.#leaving;
        this.#leaving = null;
        this.#expandFrom = parseFloat(getComputedStyle(element).height) || 0;
        this.#heightAnimation.cancel();
        complete();
      }
      this.ifExpandService.expanded = true;
    }
  }

  abstract getPanelStateClasses(panel: CollapsiblePanelModel): string;
  abstract getContentId(id: string): string;
  abstract getHeaderId(id: string): string;

  #collapseContent(panel: CollapsiblePanelModel) {
    if (this.#destroyed) {
      return;
    }

    if (this.#animations.disabled || !this.animatesCollapse) {
      // The next change detection removes the content; clean up right after it, like a completed animation would.
      Promise.resolve().then(() => this.collapsePanelOnAnimationDone(panel));
      return;
    }

    // The next change detection removes the content, which runs `animateCollapse()`.
    this.#collapsingPanel = panel;
  }
}
