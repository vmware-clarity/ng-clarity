/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AsyncPipe, NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import {
  CollapsiblePanel,
  collapsiblePanelExpandAnimation,
  CollapsiblePanelModel,
  CollapsiblePanelService,
  CollapsiblePanelStrategy,
} from '@clr/angular/collapsible-panel';
import { ClrIcon } from '@clr/angular/icon';
import { IfExpandService } from '@clr/angular/utils';
import { createArray } from 'helpers/common';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'storybook-panel',
  standalone: true,
  imports: [AsyncPipe, NgClass, ClrIcon],
  template: `
    @if (panel | async; as panel) {
      <div [ngClass]="getPanelStateClasses(panel)">
        <div class="clr-collapsible-header">
          <button
            type="button"
            class="clr-collapsible-header-button"
            (click)="togglePanel()"
            [id]="getHeaderId(panel.templateId)"
            [disabled]="panel.disabled"
            [attr.aria-controls]="!panel.disabled && panel.open ? getContentId(panel.templateId) : null"
            [attr.aria-expanded]="panel.open"
          >
            <span class="clr-collapsible-status">
              <cds-icon shape="angle" direction="right" class="clr-collapsible-angle"></cds-icon>
            </span>
            <span class="clr-collapsible-title"><ng-content select="[panelTitle]"></ng-content></span>
          </button>
        </div>
        <div
          @skipInitialRender
          role="region"
          class="clr-collapsible-content-region"
          [id]="getContentId(panel.templateId)"
          [attr.aria-hidden]="!panel.open"
          [attr.aria-labelledby]="getHeaderId(panel.templateId)"
        >
          @if (panel.open) {
            <div @toggle (@toggle.done)="collapsePanelOnAnimationDone(panel)" class="clr-collapsible-content">
              <div class="clr-collapsible-inner-content">
                <ng-content></ng-content>
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: collapsiblePanelExpandAnimation,
  providers: [IfExpandService],
  host: { '[class.clr-collapsible-panel]': 'true' },
})
export class StorybookPanel extends CollapsiblePanel implements OnChanges {
  @Input() panelDisabled = false;
  @Input() override panelOpen = false;
  @Output() override panelOpenChange = new EventEmitter<boolean>();

  get disabled(): boolean {
    return this.panelDisabled;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.handlePanelInputChanges(changes);

    if (
      this.panel &&
      changes.panelDisabled &&
      changes.panelDisabled.currentValue !== changes.panelDisabled.previousValue
    ) {
      this.panelService.disablePanel(this.id, changes.panelDisabled.currentValue);
    }
  }

  getPanelStateClasses(panel: CollapsiblePanelModel) {
    return panel.open ? 'clr-collapsible-panel-open' : 'clr-collapsible-panel-closed';
  }

  getContentId(id: string) {
    return `clr-collapsible-content-${id}`;
  }

  getHeaderId(id: string) {
    return `clr-collapsible-header-${id}`;
  }
}

@Component({
  selector: 'storybook-panel-group',
  standalone: true,
  imports: [StorybookPanel],
  template: `
    @for (_ of createArray(panelCount); track $index; let i = $index) {
      <storybook-panel [panelOpen]="!!openIndices[i]" [panelDisabled]="panelDisabled">
        <span panelTitle>{{ title }} {{ i + 1 }}</span>
        {{ content }} {{ i + 1 }}
      </storybook-panel>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CollapsiblePanelService],
  styleUrls: ['./collapsible-panel.storybook.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StorybookPanelGroup implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() multiPanel: boolean | string = false;
  @Input() panelCount = 3;
  @Input() panelDisabled = false;
  @Input() title = 'Panel';
  @Input() content = 'Content for panel';
  @Input() openIndices: boolean[] = [];

  @ViewChildren(StorybookPanel) panels: QueryList<StorybookPanel>;

  createArray = createArray;
  private subscriptions: Subscription[] = [];

  constructor(private panelService: CollapsiblePanelService) {}

  ngOnInit() {
    this.setStrategy();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.multiPanel && changes.multiPanel.currentValue !== changes.multiPanel.previousValue) {
      this.setStrategy();
    }
  }

  ngAfterViewInit() {
    this.subscriptions.push(
      this.panels.changes.pipe(startWith(this.panels)).subscribe((panels: QueryList<StorybookPanel>) => {
        this.panelService.updatePanelOrder(panels.toArray().map(p => p.id));
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private setStrategy() {
    const strategy = this.multiPanel ? CollapsiblePanelStrategy.Multi : CollapsiblePanelStrategy.Default;
    this.panelService.setStrategy(strategy);
  }
}
