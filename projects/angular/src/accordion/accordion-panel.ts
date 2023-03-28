/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IfExpandService } from '../utils/conditional/if-expanded.service';
import { ClrCommonStringsService } from '../utils/i18n/common-strings.service';
import { uniqueIdFactory } from '../utils/id-generator/id-generator.service';
import { ClrAccordionDescription } from './accordion-description';
import { AccordionStatus } from './enums/accordion-status.enum';
import { AccordionPanelModel } from './models/accordion.model';
import { AccordionService } from './providers/accordion.service';
import { panelAnimation } from './utils/animation';

@Component({
  selector: 'clr-accordion-panel',
  templateUrl: './accordion-panel.html',
  host: { '[class.clr-accordion-panel]': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: panelAnimation,
  providers: [IfExpandService],
})
export class ClrAccordionPanel implements OnInit, OnChanges {
  @Input('clrAccordionPanelDisabled') disabled = false;
  @Input('clrAccordionPanelOpen') panelOpen = false;
  @Output('clrAccordionPanelOpenChange') panelOpenChange = new EventEmitter<boolean>();
  @ContentChildren(ClrAccordionDescription) accordionDescription: QueryList<ClrAccordionDescription>;

  panel: Observable<AccordionPanelModel>;
  readonly AccordionStatus = AccordionStatus;
  isAccordion = true;

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  private _id = uniqueIdFactory();
  private _panelIndex: number;

  constructor(
    public commonStrings: ClrCommonStringsService,
    private accordionService: AccordionService,
    private ifExpandService: IfExpandService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.panel = this.accordionService.getPanelChanges(this.id).pipe(tap(panel => this.emitPanelChange(panel)));
    this.accordionService.addPanel(this.id, this.panelOpen);
    this.accordionService.togglePanel(this.id, this.panelOpen);
    this.accordionService.disablePanel(this.id, this.disabled);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.panel && changes.panelOpen && changes.panelOpen.currentValue !== changes.panelOpen.previousValue) {
      this.accordionService.togglePanel(this.id, changes.panelOpen.currentValue);
    }

    if (this.panel && changes.disabled && changes.disabled.currentValue !== changes.disabled.previousValue) {
      this.accordionService.disablePanel(this.id, changes.disabled.currentValue);
    }
  }

  get panelNumber() {
    return this._panelIndex + 1;
  }

  togglePanel() {
    this.accordionService.togglePanel(this.id);
  }

  collapsePanelOnAnimationDone(panel: AccordionPanelModel) {
    if (!panel.open) {
      this.ifExpandService.expanded = false;
    }
  }

  getPanelStateClasses(panel: AccordionPanelModel) {
    return `clr-accordion-panel-${panel.status} ${panel.open ? 'clr-accordion-panel-open' : ''}`;
  }

  getAccordionContentId(id: string) {
    return `clr-accordion-content-${id}'`;
  }

  getAccordionHeaderId(id: string) {
    return `clr-accordion-header-${id}`;
  }

  private emitPanelChange(panel: AccordionPanelModel) {
    if (panel.index !== this._panelIndex) {
      this._panelIndex = panel.index;
      // The whole chain of updates leading to this line starts in a ngAfterViewInit subscription in accordion.ts,
      // listening for DOM changes. It seems to only fails in tests, but as this is not a frequently called code,
      // I prefer to stay on the safe side and initiate a detection cycle here.
      this.cdr.detectChanges();
    }

    if (panel.open !== this.panelOpen) {
      this.panelOpenChange.emit(panel.open);
      /**
       * @Note: this line below is needed because we don't want to use another value to track
       * for changes of the panel. Because we use BehaviorSubject this emit event is trigger on
       * init (that is not needed - there is no change of the original value) - in some cases this
       * lead to duplicate events.
       *
       * To prevent this we try to emit only when the value is changed and keep the value in sync
       * even that is used only into the Initial Lifecycle (ngOnInit).
       */
      this.panelOpen = panel.open;
    }

    if (panel.open) {
      this.ifExpandService.expanded = true;
    }
  }
}
