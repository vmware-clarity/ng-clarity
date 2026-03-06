/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AsyncPipe, NgClass } from '@angular/common';
import { Component, input, OnChanges } from '@angular/core';
import { ClarityIcons, ClrIcon, ClrIconModule, IconShapeTuple } from '@clr/angular';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';

import { IconBadgePipe } from './icon-badge.pipe';
import { ICON_SETS, IconSet } from './icon-inventory';
import { searchIcons } from './icon-search.helper';
import { IconDetailsComponent } from '../icon-details/icon-details.component';

export interface IconGroupsFormOptions {
  searchTerm?: string | null;
  solid?: boolean | null;
  badge?: string | null;
}

@Component({
  selector: 'app-icon-groups',
  templateUrl: './icon-groups.component.html',
  styleUrl: './icon-groups.component.scss',
  imports: [NgClass, ClrIcon, ClrIconModule, IconDetailsComponent, AsyncPipe, IconBadgePipe],
})
export class IconGroupsComponent implements OnChanges {
  readonly formOptions = input<IconGroupsFormOptions | undefined>(undefined);

  selectedIcon: string | undefined;

  protected readonly iconSets: Observable<IconSet[]>;
  protected readonly iconCountForScreenReader: Observable<number>;

  private readonly searchTerm = new BehaviorSubject<string>('');

  constructor() {
    ClarityIcons.addIcons(
      ...ICON_SETS.map(iconSet => iconSet.icons)
        .flat()
        .map<IconShapeTuple>(icon => [icon.name, icon.shapeCollection])
    );

    this.iconSets = getIconSets(this.searchTerm);
    this.iconCountForScreenReader = getIconCountForScreenReader(this.iconSets);
  }

  ngOnChanges() {
    this.searchTerm.next(this.formOptions()?.searchTerm || '');
  }

  onIconClick(iconName: string) {
    if (this.selectedIcon === iconName) {
      this.selectedIcon = undefined;
    } else {
      this.selectedIcon = iconName;
    }
  }
}

function getIconSets(searchTerm: Observable<string>) {
  return searchTerm.pipe(distinctUntilChanged(), map(searchIcons));
}

function getIconCountForScreenReader(iconSets: Observable<IconSet[]>) {
  return iconSets.pipe(
    debounceTime(1000), // allow screen reader to finish announcing search term and update once after the user is done typing
    map(iconSets => iconSets.reduce((partialSum, iconSet) => partialSum + iconSet.icons.length, 0))
  );
}
