/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { debounceTime, startWith, Subscription } from 'rxjs';

import { PageCollectionService } from './providers/page-collection.service';
import { ClrWizardStepnavItem } from './wizard-stepnav-item';

@Component({
  selector: 'clr-wizard-stepnav',
  template: `
    <button
      #scrollLeftButton
      *ngIf="showScrollLeftButton && stepnavLayout === 'horizontal'"
      class="btn btn-icon clr-wizard-stepnav-scroll-button"
      (click)="scrollLeft()"
    >
      <cds-icon shape="angle" direction="left"></cds-icon>
    </button>

    <nav
      class="clr-wizard-stepnav-nav"
      [ngClass]="{
        'clr-wizard-stepnav-nav--with-one-scroll-button': showScrollLeftButton || showScrollRightButton,
        'clr-wizard-stepnav-nav--with-two-scroll-buttons': showScrollLeftButton && showScrollRightButton
      }"
      [attr.aria-label]="label"
    >
      <ol class="clr-wizard-stepnav-list" (scrollend)="updateScrollButtons()">
        <li
          *ngFor="let page of pageService.pages; let i = index"
          clr-wizard-stepnav-item
          [page]="page"
          class="clr-wizard-stepnav-item"
        >
          {{ i + 1 }}
        </li>
      </ol>
    </nav>

    <button
      #scrollRightButton
      *ngIf="showScrollRightButton && stepnavLayout === 'horizontal'"
      class="btn btn-icon clr-wizard-stepnav-scroll-button"
      (click)="scrollRight()"
    >
      <cds-icon shape="angle" direction="right"></cds-icon>
    </button>
  `,
  host: { class: 'clr-wizard-stepnav' },
})
export class ClrWizardStepnav implements AfterViewInit, OnChanges, OnDestroy {
  @Input() label: string;
  @Input() stepnavLayout: 'vertical' | 'horizontal';

  protected showScrollLeftButton = false;
  protected showScrollRightButton = false;

  private subscription: Subscription;

  @ViewChild('scrollLeftButton') private readonly scrollLeftButtonElementRef: ElementRef<HTMLButtonElement>;
  @ViewChild('scrollRightButton') private readonly scrollRightButtonElementRef: ElementRef<HTMLButtonElement>;
  @ViewChildren(ClrWizardStepnavItem) private readonly stepnavItems: QueryList<ClrWizardStepnavItem>;

  constructor(public pageService: PageCollectionService, private elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    if (this.stepnavLayout === 'horizontal') {
      this.stepnavItems.notifyOnChanges();
      this.subscription = this.stepnavItems.changes.pipe(startWith(undefined), debounceTime(0)).subscribe(() => {
        this.updateScrollButtons();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stepnavLayout']?.currentValue === 'horizontal') {
      this.updateScrollButtons();
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  protected updateScrollButtons() {
    if (this.stepnavItems && this.stepnavLayout === 'horizontal') {
      const firstStepnavItem = this.stepnavItems.first;
      const lastStepnavItem = this.stepnavItems.last;

      this.showScrollLeftButton = !this.stepnavItemIsVisibleHorizontally(firstStepnavItem);
      this.showScrollRightButton = !this.stepnavItemIsVisibleHorizontally(lastStepnavItem);
    }
  }

  protected scrollLeft() {
    this.scroll('left');
  }

  protected scrollRight() {
    this.scroll('right');
  }

  private scroll(direction: 'left' | 'right') {
    const stepnavItems = this.stepnavItems.toArray();

    // Reverse the array if scrolling left.
    if (direction === 'left') {
      stepnavItems.reverse();
    }

    // Find the item to scroll into view.
    // The element to scroll into view is the first not-visible element after the first visible element.
    let visibleFound = false;
    let stepnavItemToScrollIntoView: ClrWizardStepnavItem;

    for (const stepnavItem of stepnavItems) {
      const visible = this.stepnavItemIsVisibleHorizontally(stepnavItem);

      if (visible) {
        visibleFound = true;
      } else if (visibleFound) {
        stepnavItemToScrollIntoView = stepnavItem;
        break;
      }
    }

    // If an element was found, scroll to it; if not, do nothing.
    stepnavItemToScrollIntoView?.elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }

  private stepnavItemIsVisibleHorizontally(stepnavItem: ClrWizardStepnavItem) {
    const containerRect = this.elementRef.nativeElement.getBoundingClientRect();
    const itemRect = stepnavItem.elementRef.nativeElement.getBoundingClientRect();

    const leftOffset = this.scrollLeftButtonElementRef?.nativeElement.clientWidth || 0;
    const rightOffset = this.scrollRightButtonElementRef?.nativeElement.clientWidth || 0;

    return itemRect.left >= containerRect.left + leftOffset && itemRect.right <= containerRect.right - rightOffset;
  }
}
