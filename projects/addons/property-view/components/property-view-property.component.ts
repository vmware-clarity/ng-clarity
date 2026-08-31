/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, HostBinding, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges } from '@angular/core';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import { Subscription } from 'rxjs';

import { PropertyViewConfigProvider } from '../property-view-config-provider';
import {
  PropertyViewLinkModel,
  PropertyViewModelType,
  PropertyViewPropertyModel,
  PropertyViewPropertyValueComponentModel,
  PropertyViewPropertyValueModel,
} from '../property-view.model';

@Component({
  selector: '[appfx-property-view-property]',
  standalone: false,
  templateUrl: 'property-view-property.component.html',
  styleUrls: ['property-view-property.component.scss'],
})
export class PropertyViewPropertyComponent implements OnInit, OnChanges, OnDestroy {
  readonly PropertyViewModelType = PropertyViewModelType;

  @Input() data: PropertyViewPropertyModel;

  propertyValueModelContent: PropertyViewPropertyValueModel[];

  propertyValueComponentModelContent: PropertyViewPropertyValueComponentModel<unknown>[];

  @HostBinding('class.zoom4x') is4xZoomed = false;

  private zoomLevelSubscription: Subscription | undefined;

  constructor(
    public propertyViewConfigProvider: PropertyViewConfigProvider,
    @Optional() private zoomLevelService?: ZoomLevelService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.propertyValueModelContent = this.data?.content.filter(
        value => value.type === PropertyViewModelType.PropertyValue
      ) as PropertyViewPropertyValueModel[];

      this.propertyValueComponentModelContent = this.data?.content.filter(
        value => value.type === PropertyViewModelType.PropertyValueComponent
      ) as PropertyViewPropertyValueComponentModel<unknown>[];
    }
  }

  handleLinkClick(link: PropertyViewLinkModel): void {
    link.clickHandler();
  }

  getValueTrackingId(index: number) {
    return index;
  }

  ngOnInit(): void {
    this.zoomLevelSubscription = this.zoomLevelService?.onChange.subscribe(
      (level: ZoomLevel) => (this.is4xZoomed = level === ZoomLevel.x4)
    );
  }

  ngOnDestroy() {
    this.zoomLevelSubscription?.unsubscribe();
  }
}
