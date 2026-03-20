/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { debounceTime, startWith, Subscription } from 'rxjs';

import { PageCollectionService } from './providers/page-collection.service';
import { WizardNavigationService } from './providers/wizard-navigation.service';
import { ClrWizardStepnavItem } from './wizard-stepnav-item';

@Component({
  selector: 'clr-wizard-stepnav',
  template: `
    @if (showScrollLeftButton && stepnavLayout === 'horizontal') {
      <button
        #scrollLeftButton
        type="button"
        class="btn btn-icon clr-wizard-stepnav-scroll-button"
        (click)="scrollLeft()"
        tabindex="-1"
      >
        <cds-icon shape="angle" direction="left"></cds-icon>
      </button>
    }

    <nav
      class="clr-wizard-stepnav-nav"
      [ngClass]="{
        'clr-wizard-stepnav-nav--with-one-scroll-button': showScrollLeftButton || showScrollRightButton,
        'clr-wizard-stepnav-nav--with-two-scroll-buttons': showScrollLeftButton && showScrollRightButton,
      }"
      [attr.aria-label]="label"
    >
      <ol class="clr-wizard-stepnav-list" (scrollend)="updateScrollButtons()">
        @for (page of pageService.pages; track page; let i = $index) {
          <li clr-wizard-stepnav-item [page]="page" class="clr-wizard-stepnav-item">
            {{ i + 1 }}
          </li>
        }
      </ol>
    </nav>

    @if (showScrollRightButton && stepnavLayout === 'horizontal') {
      <button
        #scrollRightButton
        type="button"
        class="btn btn-icon clr-wizard-stepnav-scroll-button"
        (click)="scrollRight()"
        tabindex="-1"
      >
        <cds-icon shape="angle" direction="right"></cds-icon>
      </button>
    }
  `,
  host: { class: 'clr-wizard-stepnav' },
  standalone: false,
})
export class ClrWizardStepnav implements AfterViewInit, OnDestroy {
  @Input() label: string;

  protected showScrollLeftButton = false;
  protected showScrollRightButton = false;

  private subscription: Subscription;

  @ViewChild('scrollLeftButton') private readonly scrollLeftButtonElementRef: ElementRef<HTMLButtonElement>;
  @ViewChild('scrollRightButton') private readonly scrollRightButtonElementRef: ElementRef<HTMLButtonElement>;
  @ViewChildren(ClrWizardStepnavItem) private readonly stepnavItems: QueryList<ClrWizardStepnavItem>;

  constructor(
    public pageService: PageCollectionService,
    private navService: WizardNavigationService,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  protected get stepnavLayout() {
    return this.navService.stepnavLayout;
  }

  ngAfterViewInit() {
    if (this.stepnavLayout === 'horizontal') {
      this.stepnavItems.notifyOnChanges();
      this.subscription = this.stepnavItems.changes.pipe(startWith(undefined), debounceTime(0)).subscribe(() => {
        this.updateScrollButtons();
      });
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

    if (direction === 'left') {
      stepnavItems.reverse();
    }

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
