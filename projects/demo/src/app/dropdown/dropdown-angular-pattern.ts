/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import {
  ClrAlignment,
  ClrAxis,
  ClrCommonStringsService,
  ClrDropdownMenu,
  ClrPopoverEventsService,
  ClrPopoverPosition,
  ClrPopoverPositionService,
  ClrPopoverToggleService,
  ClrSide,
} from '@clr/angular';

import { uniqueIdFactory } from '../../../../angular/src/utils/id-generator/id-generator.service';
import { states } from '../combobox/states';

interface VirtualMachineData {
  text: string;
  details: string;
  ariaLabel: string;
}

interface VirtualMachineModel {
  searchTerm: string;
  lines: VirtualMachineData[];
}

const data: VirtualMachineData[] = [
  {
    text: 'network_adapter01',
    details: 'IP: 172.0.0.1 | MAC: 00:50:56:a5:66:ee',
    ariaLabel: 'Drowpdown header Action 1',
  },
  {
    text: 'network_adapter02',
    details: 'IP: 172.0.0.2 | MAC: 00:50:22:a5:66:ee',
    ariaLabel: 'Drowpdown header Action 2',
  },
  {
    text: 'network_adapter03',
    details: 'IP: 172.0.0.3 | MAC: 00:50:56:a5:7a:ee',
    ariaLabel: 'Drowpdown header Action 3',
  },
  {
    text: 'network_adapter04',
    details: 'IP: 172.0.0.4 | MAC: 9f:50:56:a5:66:ee',
    ariaLabel: 'Drowpdown header Action 4',
  },
];

@Component({
  selector: 'clr-dropdown-angular-pattern-demo',
  templateUrl: './dropdown-angular-pattern.demo.html',
  styleUrls: ['./dropdown.demo.scss'],
  providers: [ClrPopoverToggleService, ClrPopoverEventsService, ClrPopoverPositionService],
})
export class DropdownAngularPatternDemo implements AfterViewInit {
  @ViewChild('combo', { read: ElementRef }) comboBox: ElementRef;
  @ViewChild('dropDownMenu') dropDownMenu: ClrDropdownMenu | undefined;

  users = [
    {
      id: 'id-1',
      name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    },
    {
      id: 'id-2',
      name: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    },
    {
      id: 'id-3',
      name: 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
    },
    {
      id: 'id-4',
      name: 'dddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
    },
  ];

  states = states;

  model: VirtualMachineModel = {
    lines: data,
    searchTerm: '',
  };

  comboFormModel = {
    states: [],
  };

  globalTimeout = null;

  popoverId = uniqueIdFactory();
  open = false;
  // Smart Popover
  smartPosition: ClrPopoverPosition = {
    axis: ClrAxis.VERTICAL,
    side: ClrSide.AFTER,
    anchor: ClrAlignment.END,
    content: ClrAlignment.END,
  };

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public commonStrings: ClrCommonStringsService,
    private smartToggleService: ClrPopoverToggleService
  ) {
    smartToggleService.openChange.subscribe(change => {
      this.open = change;
    });
  }

  ngAfterViewInit(): void {
    this.dropDownMenu.closeOnOutsideClick = false;
  }

  @HostListener('click', ['$event'])
  comboBoxMouseClick(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();

    console.log(event);
  }

  @HostListener('keydown.enter', ['$event'])
  comboBoxEnter(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();

    console.log(event);
  }

  delay($event) {
    $event.preventDefault();
    $event.stopPropagation();

    if (this.globalTimeout !== null) {
      clearTimeout(this.globalTimeout);
    }
    this.globalTimeout = setTimeout(this.searchTerm.bind(this), 200);
  }

  searchTerm() {
    this.model.lines = data;

    if (this.model.searchTerm !== '') {
      this.model.lines = data.filter(
        value => value.details.includes(this.model.searchTerm) || value.text.includes(this.model.searchTerm)
      );
    }
  }
}
