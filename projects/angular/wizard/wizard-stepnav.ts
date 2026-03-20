/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Component, ElementRef, Input, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { startWith, Subscription } from 'rxjs';

import { PageCollectionService } from './providers/page-collection.service';
import { WizardNavigationService } from './providers/wizard-navigation.service';
import { ClrWizardStepnavItem } from './wizard-stepnav-item';

@Component({
  selector: 'clr-wizard-stepnav',
  template: `
    @if (showScrollLeftButton && stepnavLayout === 'horizontal') {
      <button
        type="button"
        class="btn btn-sm btn-icon clr-wizard-stepnav-scroll-button-left"
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
      <ol class="clr-wizard-stepnav-list">
        @for (page of pageService.pages; track page; let i = $index) {
          <li clr-wizard-stepnav-item [page]="page" class="clr-wizard-stepnav-item">
            {{ i + 1 }}
          </li>
        }
      </ol>
    </nav>

    @if (showScrollRightButton && stepnavLayout === 'horizontal') {
      <button
        type="button"
        class="btn btn-sm btn-icon clr-wizard-stepnav-scroll-button-right"
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

  @ViewChildren(ClrWizardStepnavItem) private readonly stepnavItems: QueryList<ClrWizardStepnavItem>;

  private subscription: Subscription;
  private intersectionObserver: IntersectionObserver;
  private firstItemVisible = true;
  private lastItemVisible = true;

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
      this.setupIntersectionObserver();

      this.stepnavItems.notifyOnChanges();
      this.subscription = this.stepnavItems.changes.pipe(startWith(undefined)).subscribe(() => {
        this.observeEdgeItems();
      });
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.intersectionObserver?.disconnect();
  }

  protected scrollLeft() {
    this.scroll('left');
  }

  protected scrollRight() {
    this.scroll('right');
  }

  private setupIntersectionObserver() {
    const scrollContainer = this.elementRef.nativeElement.querySelector('.clr-wizard-stepnav-list');

    this.intersectionObserver = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          const isFirst = target === this.stepnavItems.first?.elementRef.nativeElement;
          const isLast = target === this.stepnavItems.last?.elementRef.nativeElement;

          if (isFirst) {
            this.firstItemVisible = entry.isIntersecting;
          }
          if (isLast) {
            this.lastItemVisible = entry.isIntersecting;
          }
        }

        this.showScrollLeftButton = !this.firstItemVisible;
        this.showScrollRightButton = !this.lastItemVisible;
      },
      { root: scrollContainer, threshold: 0.99 }
    );
  }

  private observeEdgeItems() {
    this.intersectionObserver.disconnect();
    this.firstItemVisible = true;
    this.lastItemVisible = true;

    const first = this.stepnavItems.first;
    const last = this.stepnavItems.last;

    if (first) {
      this.intersectionObserver.observe(first.elementRef.nativeElement);
    }
    if (last && last !== first) {
      this.intersectionObserver.observe(last.elementRef.nativeElement);
    }
  }

  private scroll(direction: 'left' | 'right') {
    const scrollContainer = this.elementRef.nativeElement.querySelector('.clr-wizard-stepnav-list');
    const scrollAmount = scrollContainer.clientWidth * 0.5;

    scrollContainer.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }
}
