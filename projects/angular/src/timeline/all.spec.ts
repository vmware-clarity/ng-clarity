/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import TimelineIconAttributeService from './providers/timeline-icon-attribute.service.spec';
import TimelineStepDescriptionSpec from './timeline-step-description.spec';
import TimelineStepHeaderSpec from './timeline-step-header.spec';
import TimelineStepTitleSpec from './timeline-step-title.spec';
import TimelineStepSpec from './timeline-step.spec';
import TimelineSpec from './timeline.spec';

describe('Timeline', () => {
  TimelineSpec();
  TimelineStepSpec();
  TimelineStepDescriptionSpec();
  TimelineStepHeaderSpec();
  TimelineStepTitleSpec();
  TimelineIconAttributeService();
});
