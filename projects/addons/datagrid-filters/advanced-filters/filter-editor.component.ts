/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

import {
  DateTimePropertyDefinition,
  EnumPropertyDefinition,
  FilterablePropertyDefinition,
  NumericPropertyDefinition,
  PropertyFilter,
  StringPropertyDefinition,
  UserPropertyDefinition,
} from '../model/datagrid-filters.interfaces';

/**
 * Shows the editor for a field's type: general (string and numeric), enum, date-time or users. Used by Add filter and
 * by the pills, so the choice of editor is in one place. Internal, not exported from the package.
 */
@Component({
  selector: 'appfx-filter-editor',
  standalone: false,
  templateUrl: 'filter-editor.component.html',
  styleUrls: ['filter-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterEditorComponent {
  /** The field to edit. */
  @Input() property!: FilterablePropertyDefinition;

  /** The filter to edit; none for a new filter. */
  @Input() propertyFilter?: PropertyFilter;

  /** Rendered in the editor's field row, e.g. the field picker. */
  @Input() fieldTemplate?: TemplateRef<unknown>;

  /** Rendered next to the editor's Cancel and Apply, e.g. Remove filter. */
  @Input() actionsTemplate?: TemplateRef<unknown>;

  /** The applied filter, or nothing when the editor was cancelled. */
  @Output() filterCriteriaChange = new EventEmitter<PropertyFilter>();

  protected get generalProperty(): StringPropertyDefinition | NumericPropertyDefinition | undefined {
    return this.property instanceof StringPropertyDefinition || this.property instanceof NumericPropertyDefinition
      ? this.property
      : undefined;
  }

  protected get enumProperty(): EnumPropertyDefinition | undefined {
    return this.property instanceof EnumPropertyDefinition ? this.property : undefined;
  }

  protected get dateTimeProperty(): DateTimePropertyDefinition | undefined {
    return this.property instanceof DateTimePropertyDefinition ? this.property : undefined;
  }

  protected get userProperty(): UserPropertyDefinition | undefined {
    return this.property instanceof UserPropertyDefinition ? this.property : undefined;
  }
}
