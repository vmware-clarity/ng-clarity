/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, viewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  angleIcon,
  ClarityIcons,
  ClrAccordionModule,
  ClrDatagridModule,
  ClrDatagridSortOrder,
  ClrDatagridStringFilterInterface,
  ClrIcon,
  ClrIconModule,
  ClrIfExpanded,
  ClrLoadingModule,
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
  infoCircleIcon,
  pencilIcon,
  plusIcon,
  userIcon,
} from '@clr/angular';
import { Subscription } from 'rxjs';

import { ClarityDocComponent } from '../clarity-doc';
import { DatagridDetailAccessibilityGuidance } from './accessibility/datagrid-detail-accessibility-guidance.component';
import { DatagridBasicStructureDemo } from './basic-structure/basic-structure';
import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';
import { ColorFilter } from './utils/color-filter';
import { PokemonComparator } from './utils/pokemon-comparator';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';

class DateFilter implements ClrDatagridStringFilterInterface<User> {
  accepts(user: User, search: string): boolean {
    const date = (user.creation as Date).toDateString();
    return date === search || date.toLowerCase().indexOf(search) >= 0;
  }
}

type DemoRoute = Route & { data: { demoName: string } };

@Component({
  selector: 'clr-datagrid-demo',
  templateUrl: './datagrid.demo.html',
  providers: [Inventory],
  styleUrls: ['./datagrid.demo.main.scss', './datagrid.demo.scss'],
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    RouterLink,
    ClrDatagridModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ColorFilter,
    ClrIfExpanded,
    ClrLoadingModule,
    ClrIcon,
    ClrIconModule,
    RouterOutlet,
    ClrAccordionModule,
    StyleDocsComponent,
    DatagridDetailAccessibilityGuidance,
    DatagridBasicStructureDemo,
    DatePipe,
  ],
})
export class DatagridDemo extends ClarityDocComponent implements OnInit, OnDestroy {
  readonly demoView = viewChild<ElementRef<HTMLDivElement>>('demoView');

  childRoutes: DemoRoute[] | undefined;

  previous = false;
  next = false;

  previousRoute: DemoRoute | undefined;
  nextRoute: DemoRoute | undefined;

  parentRoute = '';
  apis = [
    {
      name: 'ClrDatagrid',
      selector: 'clr-datagrid',
      props: [
        {
          name: '[clrDgCLoading]',
          type: 'Boolean',
          defaultValue: 'false',
          description: 'Freezes the datagrid while data is loading',
        },
        {
          name: '[clrDgItemsIdentityFn]',
          type: 'ClrDatagridItemsIdentityFunction<T>',
          defaultValue: 'undefined',
          description: 'Use this to pass a TrackBy function for entire datagrid.',
        },
        {
          name: '[clrLoadingMoreItems]',
          type: 'Boolean',
          defaultValue: 'false',
          description:
            'Used to shows an additional top and bottom rows, when virtual scroll is at the end and is still loading items',
        },
        {
          name: '(clrDgRefresh)',
          type: 'ClrDatagridStateInterface<T>',
          defaultValue: 'n/a',
          description: 'Output emitted whenever the data needs to be refreshed, based on user action or external ones',
        },
        {
          name: '[(clrDgSelected)]',
          type: 'T[]',
          defaultValue: '[]',
          description: 'An array of all selected items',
        },
        {
          name: '[(clrDgSingleSelected)]',
          type: 'T',
          defaultValue: 'undefined',
          description: 'Selected item in single-select mode.',
        },
        {
          name: '[clrDgSingleSelectionAriaLabel]',
          type: 'string',
          defaultValue: 'Single selection header',
          description: 'Change / over-ride the text for single selection column header',
        },
        {
          name: '[clrDgSingleActionableAriaLabel]',
          type: 'string',
          defaultValue: 'Single actionable header',
          description: 'Change / over-ride the text for single action column header',
        },
        {
          name: '[clrDetailExpandableAriaLabel]',
          type: 'string',
          defaultValue: 'Toggle more row content',
          description: 'Change / over-ride the text for expandable row button.',
        },
        {
          name: '[clrDgDisablePageFocus]',
          type: 'Boolean',
          defaultValue: 'false',
          description: 'Set true to enable focus on the datagrid table container element after page change.',
        },
        {
          name: '[clrDgPreserveSelection]',
          type: 'boolean',
          defaultValue: 'false',
          description:
            'Set to true to preserve selected rows between data changes. E.g - page changes or filter changes.',
        },
      ],
    },
    {
      name: 'ClrDatagridRow',
      selector: 'clr-dg-row',
      props: [
        {
          name: '[clrDgItem]',
          type: 'T',
          defaultValue: '',
          description: 'A model of the row, used for selection, filtering, sorting and pagination.',
        },
        {
          name: '[(clrDgSelected)]',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Select or de-select an item.',
        },
        {
          name: '[clrDgSelectable]',
          type: 'boolean',
          defaultValue: 'true',
          description:
            "Set this to false if you don't want the row to be selectable (single or multicast select modes).",
        },
        {
          name: '[clrDgSkeletonLoading]',
          type: 'Boolean',
          defaultValue: 'false',
          description: 'Set this to true if the row data is not yet loaded to show row skeleton.',
        },
        {
          name: '[clrDgDetailOpenLabel]',
          type: 'string',
          defaultValue: 'Open',
          description: 'A string for the aria-label on the detail pane open button',
        },
        {
          name: '[clrDgDetailCloseLabel]',
          type: 'string',
          defaultValue: 'Close',
          description: 'A string for the aria-label on the detail pane open button',
        },
        {
          name: '[clrDgRowAriaLabel]',
          type: 'string',
          defaultValue: '',
          description: 'A model of the row, used for selection, filtering, sorting and pagination.',
        },
        {
          name: '[clrDgDetailDisabled]',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Set this to true if you want to disable the detail pane open button',
        },
        {
          name: '[clrDgDetailHidden]',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Set this to true if you want to hide the detail pane open button',
        },
      ],
    },
    {
      name: 'ClrDatagridActionOverflow',
      selector: 'clr-dg-action-overflow',
      props: [
        {
          name: '[clrDgActionOverflowButtonLabel]',
          type: 'string',
          defaultValue: 'Available actions',
          description: 'A label for the action overflow trigger button.',
        },
      ],
    },
    {
      name: 'ClrDatagridFilter',
      selector: 'clr-dg-filter',
      props: [
        {
          name: '[(clrDgFilterOpen)]',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Input / Output that sets or emits the open state of a filter.',
        },
        {
          name: '[clrDgFilter]',
          type: 'ClrDatagridFilterInterface<T> | RegisteredFilter<T, ClrDatagridFilterInterface<T>>',
          defaultValue: 'n/a',
          description: 'Bind a custom filter to a column.',
        },
        {
          name: '',
          type: '',
          defaultValue: '',
          description: '',
        },
      ],
    },
    {
      name: 'ClrDatagridColumn',
      selector: 'clr-dg-column',
      props: [
        {
          name: '[clrDgColType]',
          type: 'string | number',
          defaultValue: 'string',
          description: 'Designates usage of the built in string or number filters for a column filter.',
        },
        {
          name: '[clrDgField]',
          type: 'string',
          defaultValue: 'undefined',
          description: 'Set the model property that represents data in the column.',
        },
        {
          name: '[clrFilterNumberMaxPlaceholder]',
          type: 'string',
          defaultValue: 'undefined',
          description: 'Placeholder text for max filter',
        },
        {
          name: '[clrFilterNumberMinPlaceholder]',
          type: 'string',
          defaultValue: 'undefined',
          description: 'Placeholder text for min filter',
        },
        {
          name: '[clrFilterStringPlaceholder]',
          type: 'string',
          defaultValue: 'undefined',
          description: 'Placeholder text for string filter.',
        },
        {
          name: '[clrDgSortBy]',
          type: 'ClrDatagridComparatorInterface<T> | string',
          defaultValue: 'undefined',
          description:
            'Bind to a custom sorting comparator or designate a string to be used with the build in DatagridPropertyComparator.',
        },
        {
          name: '[(clrDgSortOrder)]',
          type: 'ClrDatagridSortOrder | string',
          defaultValue: 'undefined',
          description:
            'Set the sort order for the column. You can sort the column in either ascending or descending order.',
        },
        {
          name: '[(clrFilterValue)]',
          type: 'string | [number, number]',
          defaultValue: null,
          description: 'Preset the filter value on columns to initialize the datagrid to a specific filtered state.',
        },
        {
          name: '(clrDgColumnResize)',
          type: 'number',
          defaultValue: null,
          description: "Emits when the column is resized. The value is the column's size in pixels.",
        },
        {
          name: '',
          type: '',
          defaultValue: '',
          description: '',
        },
      ],
    },
    {
      name: 'ClrDatagridHideableColumn',
      selector: '[clrDgHideableColumn]',
      props: [
        {
          name: '[clrDgHideableColumn]',
          type: '{hidden: boolean}',
          defaultValue: 'false',
          description: 'Designate a column to hide-able and pass its visibility state.',
        },
        {
          name: '[(clrDgHidden)]',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Input/Output for the hidden state of a column.',
        },
      ],
    },
    {
      name: 'ClrIfDetail',
      selector: '[clrIfDetail]',
      props: [
        {
          name: '[(clrIfDetail)]',
          type: 'T',
          defaultValue: 'Row model <T>',
          description:
            'Use this to pass the row model context to the structural directive that toggles the detail pane for a row.',
        },
        {
          name: '',
          type: '',
          defaultValue: '',
          description: '',
        },
      ],
    },
    {
      name: 'ClrDatagridItems',
      selector: '[clrDgItems][clrDgItemsOf]',
      props: [
        {
          name: '[clrDgItemsOf]',
          type: 'T[]',
          defaultValue: 'undefined',
          description:
            'A structural directive / iterator that uses a list of item models for each of the visible rows in a datagrid.',
        },
        {
          name: '[clrDgItemsIdentityFn]',
          type: 'TrackByFunction<T>',
          defaultValue: 'undefined',
          description: 'Use this to pass a TrackBy function for each row item.',
        },
      ],
    },
    {
      name: 'ClrDatagridPageSize',
      selector: 'clr-dg-page-size',
      props: [
        {
          name: '[clrPageSizeOptions]',
          type: 'number',
          defaultValue: '0',
          description: 'Set the size of items for a page.',
        },
        {
          name: '[clrPageSizeOptionsId]',
          type: 'string',
          defaultValue: '[unique id]',
          description: 'Set the id of the page size select element.',
        },
      ],
    },
    {
      name: 'ClrDatagridPagination',
      selector: 'clr-dg-pagination',
      props: [
        {
          name: '[clrDgPageInputDisabled]',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Disable user input for the text input element.',
        },
        {
          name: '[clrDgPageSize]',
          type: 'number',
          defaultValue: '0',
          description: 'Sets the number of row items per page.',
        },
        {
          name: '[clrDgTotalItems]',
          type: 'number',
          defaultValue: 'undefined',
          description: 'A value representing the total number of items in the full dataset.',
        },
        {
          name: '[clrDgLastPage]',
          type: 'number',
          defaultValue: 'undefined',
          description: 'Designate a specific page number as the last page for a dataset.',
        },
        {
          name: '[clrDgPage]',
          type: 'number',
          defaultValue: '1',
          description: 'Sets the current page for a paginated dataset.',
        },
      ],
    },
    {
      name: 'ClrVirtualScroll',
      selector: 'clrVirtualScroll',
      props: [
        {
          name: '[clrVirtualRowsOf]',
          type: 'T[]',
          defaultValue: '[]',
          description:
            'A structural directive / iterator that uses a list of item models for each of the visible rows in a datagrid. Similar to [clrDgItemsOf]. Should not be used in combination with [clrVirtualDataRange].',
        },
        {
          name: '[clrVirtualDataRange]',
          type: '{ total: number, skip: number,  data: T[], }',
          defaultValue: 'undefined',
          description:
            'Users provide only `total` count, start position `skip` and amount of `data` that will be inserted at the start position. Should not be used in combination with [clrVirtualRowsOf].',
        },
        {
          name: '[clrVirtualPersistItems]',
          type: 'Boolean',
          defaultValue: 'true',
          description: 'Allowing [clrVirtualDataRange] to keep already loaded items.',
        },
        {
          name: '[clrVirtualRowsTrackBy]',
          type: 'TrackByFunction<T>',
          defaultValue: 'undefined',
          description: 'Use this to pass a TrackBy function for each row item.',
        },
        {
          name: '[clrVirtualRowsItemSize]',
          type: 'number',
          defaultValue: '32 | 24',
          description: 'Theoretical minimum row height in pixels. In compact datagrid is set to 24.',
        },
        {
          name: '[clrVirtualRowsMinBufferPx]',
          type: 'number',
          defaultValue: '200',
          description: 'Theoretical minimum buffered items height in pixels.',
        },
        {
          name: '[clrVirtualRowsMaxBufferPx]',
          type: 'number',
          defaultValue: '400',
          description: 'Theoretical maximum buffered items height in pixels.',
        },
        {
          name: '(renderedRangeChange)',
          type: 'ListRange',
          defaultValue: 'undefined',
          description: 'Emits currently rendered amount of rows.',
        },
        {
          name: '[clrVirtualRowsTemplate]',
          type: 'TemplateRef<CdkVirtualForOfContext<T>>',
          defaultValue: 'undefined',
          description: 'The template used to stamp out new elements.',
        },
        {
          name: '[clrVirtualRowsTemplateCacheSize]',
          type: 'number',
          defaultValue: '20',
          description:
            'The size of the cache used to store templates that are not being used for re-use later. Setting the cache size to 0 will disable caching. Defaults to 20 templates.',
        },
      ],
    },
  ];

  pokemonComparator = new PokemonComparator();
  sortOrder: ClrDatagridSortOrder = ClrDatagridSortOrder.DESC;
  exampleData1: User[];
  exampleData2: User[];
  exampleData3: User[];
  exampleData4: User[];
  selected: User[] = [];
  detailExampleData: User[] | undefined;
  detailState: User | undefined;
  detailStateSelected: User[] = [];
  dateFilter = new DateFilter();
  detail = 'default';
  replace = false;

  private _subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventory: Inventory
  ) {
    super('datagrid');

    inventory.size = 3;
    inventory.reset();
    this.exampleData1 = inventory.all;

    inventory.size = 4;
    inventory.reset();
    this.exampleData2 = inventory.all;
    this.exampleData2[0].expanded = true;

    inventory.size = 103;
    inventory.reset();
    this.exampleData3 = inventory.all;

    inventory.size = 10;
    inventory.reset();
    this.exampleData4 = inventory.all;
    this.selected.push(this.exampleData4[0]);
    this.selected.push(this.exampleData4[1]);

    ClarityIcons.addIcons(angleIcon, plusIcon, pencilIcon, userIcon, infoCircleIcon);
  }

  ngOnInit() {
    const tempArr = this.route.routeConfig?.children as DemoRoute[] | undefined;
    if (tempArr && tempArr.length > 1) {
      this.childRoutes = tempArr.slice(1);
    }
    this._subscriptions.push(
      this.router.events.subscribe((change: any) => {
        if (change instanceof NavigationEnd) {
          if (change.url.includes('datagrid')) {
            this.initializePagination(change.url);
          }
        }
      })
    );
    this.initializePagination('/documentation/datagrid/code/' + this.route.children[0].routeConfig?.path);
  }

  ngOnDestroy() {
    this._subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  initializePagination(url: string): void {
    const tempArr: string[] = url.split('/');
    this.parentRoute = url.substr(0, url.indexOf('datagrid/code')) + 'datagrid/code/';
    if (tempArr.length > 1 && this.childRoutes) {
      const subRoute: string = tempArr[tempArr.length - 1];
      if (subRoute === 'datagrid') {
        this.nextRoute = this.childRoutes[1];
        this.next = true;
      } else {
        for (let i = 0; i < this.childRoutes.length; i++) {
          if (this.childRoutes[i].path === subRoute) {
            if (i === 0) {
              this.previous = false;
            } else {
              this.previousRoute = this.childRoutes[i - 1];
              this.previous = true;
            }

            if (i < this.childRoutes.length - 1) {
              this.nextRoute = this.childRoutes[i + 1];
              this.next = true;
            } else {
              this.next = false;
            }
            break;
          }
        }
      }
    }
  }

  scrollToDemoView() {
    const demoView = this.demoView();
    if (demoView) {
      demoView.nativeElement.scrollIntoView();
    }
  }

  moveNext() {
    if (this.nextRoute) {
      const tempPath = this.parentRoute + this.nextRoute.path;
      this.router.navigate(['./' + tempPath]);
      this.scrollToDemoView();
    }
  }

  movePrevious() {
    if (this.previousRoute) {
      const tempPath = this.parentRoute + this.previousRoute.path;
      this.router.navigate([tempPath]);
      this.scrollToDemoView();
    }
  }
}
