/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';

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
  // Stays Eager: see PropertyViewComponent.
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class PropertyViewPropertyComponent implements OnChanges {
  readonly PropertyViewModelType = PropertyViewModelType;

  @Input() data!: PropertyViewPropertyModel;

  propertyValueModelContent!: PropertyViewPropertyValueModel[];

  propertyValueComponentModelContent!: PropertyViewPropertyValueComponentModel<unknown>[];

  constructor(
    public propertyViewConfigProvider: PropertyViewConfigProvider,
    @Optional() private zoomLevelService?: ZoomLevelService
  ) {}

  @HostBinding('class.zoom4x')
  get is4xZoomed(): boolean {
    return this.zoomLevelService?.level() === ZoomLevel.x4;
  }

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
}
