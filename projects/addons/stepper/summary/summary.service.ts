/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import {
  PropertyViewBuilder,
  PropertyViewCategoryBuilder,
  PropertyViewModel,
  PropertyViewSectionBuilder,
  PropertyViewSectionModel,
} from '@clr/addons/property-view';
import { Step, StepInternal } from '@clr/addons/var';

/**
 * SummaryService provides methods to build data required to display Step summary using appfx-property-view.
 */
@Injectable()
export class SummaryService {
  /**
   * Builds {@link PropertyViewModel} for the Step passed using Step#description field.
   */
  getDescription(step: Step): PropertyViewModel | undefined {
    if (step.description) {
      return this.getPropertyViewModelFromMessage(step.description);
    }
    return undefined;
  }

  /**
   * Builds {@link PropertyViewModel} for the Step passed using Step#summary method.
   */
  getSummary(step: StepInternal): PropertyViewModel | undefined {
    if (step.summary) {
      const stepSummary = step.summary(this.getPropertyViewSectionBuilder(), step.modelInstance);
      return this.getPropertyViewModelFromPropertyViewSectionModel(stepSummary);
    }
    return undefined;
  }

  private getPropertyViewModelFromMessage(data: string): PropertyViewModel {
    const builder = this.getPropertyViewBuilder();
    const categoryBuilder = builder.generateAllCategory('');
    categoryBuilder.section('defaultSection').message(data).renderAsHtml(true);
    return builder.build();
  }

  private getPropertyViewModelFromPropertyViewSectionModel(data: PropertyViewSectionModel): PropertyViewModel {
    const categoryBuilder = this.getPropertyViewCategoryBuilder();
    const category = categoryBuilder.build();
    category.content = [data];
    return {
      categories: [category],
    };
  }

  private getPropertyViewSectionBuilder(): PropertyViewSectionBuilder {
    return this.getPropertyViewCategoryBuilder().section('defaultSection');
  }

  private getPropertyViewCategoryBuilder(): PropertyViewCategoryBuilder {
    return this.getPropertyViewBuilder().generateAllCategory('');
  }

  private getPropertyViewBuilder(): PropertyViewBuilder {
    return new PropertyViewBuilder();
  }
}
