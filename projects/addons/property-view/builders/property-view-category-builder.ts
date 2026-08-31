/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable @typescript-eslint/parameter-properties */
import { PropertyViewCategoryModel, PropertyViewModelType } from '../property-view.model';
import { PropertyViewBuilder } from './property-view-builder';
import { PropertyViewSectionBuilder } from './property-view-section-builder';

export class PropertyViewCategoryBuilder {
  private parent: PropertyViewBuilder;
  private id: string;
  private contentBuilders: Array<PropertyViewSectionBuilder>;
  #title: string | null;

  constructor(parent: PropertyViewBuilder, id: string) {
    this.parent = parent;
    this.id = id;
    this.#title = null;
    this.contentBuilders = [];
  }

  getId(): string {
    return this.id;
  }

  title(value: string | null): PropertyViewCategoryBuilder {
    this.#title = value;

    return this;
  }

  getAllSections(): Array<PropertyViewSectionBuilder> {
    return this.contentBuilders.concat();
  }

  getSection(id: string): PropertyViewSectionBuilder | null {
    const matchingSections = this.getAllSections().filter(section => section.getId() === id);
    if (matchingSections.length === 1) {
      return matchingSections[0];
    }

    return null;
  }

  section(id: string): PropertyViewSectionBuilder {
    let sectionBuilder = this.getSection(id);
    if (sectionBuilder === null) {
      sectionBuilder = new PropertyViewSectionBuilder(this, id);
      this.contentBuilders.push(sectionBuilder);
    }

    return sectionBuilder;
  }

  cloneAndAddBuilder(builder: PropertyViewSectionBuilder): PropertyViewCategoryBuilder {
    if (this.getSection(builder.getId()) !== null) {
      throw new Error(`Section '${builder.getId()}' already exists.`);
    }
    builder = builder.clone(this);
    this.contentBuilders.push(builder);

    return this;
  }

  cloneAndAddBuilders(builders: Array<PropertyViewSectionBuilder>): PropertyViewCategoryBuilder {
    builders.forEach(builder => this.cloneAndAddBuilder(builder));

    return this;
  }

  build(): PropertyViewCategoryModel {
    return {
      type: PropertyViewModelType.Category,
      id: this.id,
      title: this.#title,
      content: this.getAllSections().map(builder => builder.build()),
    };
  }

  clone(parentClone: PropertyViewBuilder): PropertyViewCategoryBuilder {
    const result = new PropertyViewCategoryBuilder(parentClone, this.id);
    result.#title = this.#title;
    result.contentBuilders = this.getAllSections().map(builder => builder.clone(result));

    return result;
  }

  exit(): PropertyViewBuilder {
    return this.parent;
  }
}
