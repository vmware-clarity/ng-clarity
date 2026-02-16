/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  assignUserIcon,
  assignUserIconName,
  bellIcon,
  bellIconName,
  ClarityIcons,
  formIcon,
  formIconName,
  layersIcon,
  layersIconName,
  lineChartIcon,
  lineChartIconName,
} from '@cds/core/icon';

import { LinkCardsLink } from '../../shared/link-cards/link-cards.component';

ClarityIcons.addIcons(assignUserIcon, bellIcon, formIcon, layersIcon, lineChartIcon);

export const chartsPatternLink: LinkCardsLink = {
  routerLink: '/documentation/charts',
  text: 'Charts pattern',
  iconShape: lineChartIconName,
  hexagonColor: 'status-info',
};

export const formsPatternLink: LinkCardsLink = {
  routerLink: '/documentation/forms',
  text: 'Forms pattern',
  iconShape: formIconName,
  hexagonColor: 'status-info',
};

export const multiStepPatternLink: LinkCardsLink = {
  routerLink: '/documentation/multi-step-workflow',
  text: 'Multi-Step Workflow pattern',
  iconShape: layersIconName,
  hexagonColor: 'status-info',
};

export const notificationsPatternLink: LinkCardsLink = {
  routerLink: '/documentation/notifications',
  text: 'Notifications pattern',
  iconShape: bellIconName,
  hexagonColor: 'status-info',
};

export const onboardingPatternLink: LinkCardsLink = {
  routerLink: '/documentation/onboarding',
  text: 'Onboarding pattern',
  iconShape: assignUserIconName,
  hexagonColor: 'status-info',
};
