/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { animate, style, transition, trigger } from '@angular/animations';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { a11ykeys, ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import { DragAndDropGroupService } from '@clr/addons/drag-and-drop';
import {
  appfxMissingTranslationToken,
  AppfxTranslateService,
  appfxTranslationsToken,
  defaultMissingTranslationHandler,
} from '@clr/addons/translate';
import { ClarityIcons, dragHandleIcon } from '@clr/angular/icon';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AppfxCardInternal } from '../appfx-card-container.interface';
import { translations } from '../appfx-card-container.l10n';
import { A11yService } from '../services/a11y.service';
import { DragDropService } from '../services/dnd.service';
import { LayoutService } from '../services/layout.service';

/**
 * Appfx Container Card
 * Handles user interactions like drag and drop and a11y support for same through keyboard events
 *
 * Used internally in Appfx Card Container @see(AppfxCardContainer)
 */
@Component({
  selector: 'appfx-card',
  standalone: false,
  templateUrl: 'appfx-card.component.html',
  styleUrls: ['appfx-card.component.scss'],
  providers: [
    AppfxTranslateService,
    {
      provide: appfxMissingTranslationToken,
      useValue: defaultMissingTranslationHandler,
    },
    {
      provide: appfxTranslationsToken,
      useValue: translations,
    },
  ],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('200ms ease-in', style({ opacity: 1, transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(0%)' }))]),
    ]),
  ],
})
export class AppfxCardComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * The descriptor of the step being rendered.
   */
  @Input() card: AppfxCardInternal;

  /**
   * Specifics which dropGroup card belongs to as card drop should happen within specific container
   * used to distinguish drag and drop cards from multiple containers
   */
  @Input() dropGroup: string;

  @ViewChild(CdkDropList, { static: true }) readonly dropList: CdkDropList;

  dragDropEnabled: boolean = true;

  @ViewChild(CdkDrag, { read: ElementRef }) private cdkDragElementRefs: ElementRef;

  @ViewChild('cardViewContainer', { read: ViewContainerRef, static: true }) private cardViewContainer: ViewContainerRef;

  // Store current set card unit width
  private currentUnitWidth: number | undefined;
  // Store current set card unit height
  private currentUnitHeight: number | undefined;
  private subscriptions = new Subscription();

  constructor(
    private el: ElementRef,
    private groupService: DragAndDropGroupService,
    private layoutService: LayoutService,
    private dragDropService: DragDropService,
    private a11yService: A11yService,
    private changeDetector: ChangeDetectorRef,
    @Optional() private zoomLevelService: ZoomLevelService
  ) {
    ClarityIcons.addIcons(dragHandleIcon);
  }

  get isSelected(): boolean {
    return this.a11yService.isSelected(this.card.id);
  }

  get isDraggableOver(): boolean {
    return this.a11yService.isDraggableOver(this.card.id);
  }

  get cdkDropGroup(): CdkDropList[] {
    return this.groupService.getGroupItems(this.dropGroup) as unknown as CdkDropList[];
  }

  ngOnInit(): void {
    if (!this.card.id) {
      throw new Error('Missing Input property for card - id');
    }
    this.loadComponent();

    if (this.zoomLevelService) {
      this.currentUnitWidth = this.card.unitWidth;
      this.currentUnitHeight = this.card.unitHeight;
      this.subscriptions.add(
        this.zoomLevelService.onChange
          .pipe(
            map((data: ZoomLevel) => {
              if (!!this.card.cardZoomSizes && !!(this.card.cardZoomSizes as any)[data]) {
                return (this.card.cardZoomSizes as any)[data];
              }
              return {
                unitHeight: this.card.unitHeight,
                unitWidth: this.card.unitWidth,
              };
            }),
            filter(size => {
              return size.unitWidth !== this.currentUnitWidth || size.unitHeight !== this.currentUnitHeight;
            })
          )
          .subscribe(size => {
            this.currentUnitWidth = size.unitWidth;
            this.currentUnitHeight = size.unitHeight;
            this.layoutService.updateCardSize(this.el.nativeElement, this.currentUnitWidth, this.currentUnitHeight);
            this.changeDetector.detectChanges();
          })
      );
    }
  }

  ngAfterViewInit(): void {
    this.layoutService.updateCardSize(this.el.nativeElement, this.card.unitWidth, this.card.unitHeight);
    this.groupService.addGroupItem(this.dropGroup, this.dropList);
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.groupService.removeGroupItem(this.dropGroup, this.dropList);
    this.subscriptions.unsubscribe();
  }

  onDragStart(): void {
    this.dragDropService.onDragStart(this.card.id);
  }

  onDrop(): void {
    this.dragDropService.onDragDrop(this.card.id);
  }

  selectCard(event: Event): void {
    this.eventCheck(event);
    this.a11yService.selectCard(this.card.id);
  }

  moveDropPositionBackwards(event: Event): void {
    this.eventCheck(event);
    this.a11yService.moveDropPosition(a11ykeys.arrowLeft);
  }

  moveDropPositionForwards(event: Event): void {
    this.eventCheck(event);
    this.a11yService.moveDropPosition(a11ykeys.arrowRight);
  }

  onDropHandleKeyUp(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.cdkDragElementRefs?.nativeElement.focus();
    this.a11yService.selectCard(this.card.id);
  }

  private loadComponent(): void {
    if (!this.card.componentClass) {
      return;
    }
    this.cardViewContainer.clear();
    const cr = this.cardViewContainer.createComponent(this.card.componentClass);
    if (this.card.context) {
      Object.entries(this.card.context).forEach(([key, value]) => {
        cr.instance[key] = value;
      });
    }
  }

  private eventCheck(event: Event): void {
    if (event.target !== event.currentTarget) {
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
