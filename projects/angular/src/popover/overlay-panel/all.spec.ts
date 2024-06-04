/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { addHelpers } from '../../data/datagrid/helpers.spec';
import OverlayPanelContentSpecs from './overlay-panel-content.spec';
import OverlayPanelTriggerSpecs from './overlay-panel-trigger.spec';
import OverlayPanelSpecs from './overlay-panel.spec';
import OverlayPanelFocusManagerServiceSpec from './providers/overlay-panel-focus-manager.service.spec';
import OverlayPanelIdServiceSpec from './providers/overlay-panel-id.service.spec';

describe('OverlayPanel', function () {
  addHelpers();
  /*
   * After having to work with it, I think this spec delves waaaay to much into the component's views.
   * So I'm not happy with some of the code I wrote, but refactoring this whole spec is not part of my
   * current work and it'll have to come later.
   */
  OverlayPanelSpecs();
  OverlayPanelContentSpecs();
  OverlayPanelTriggerSpecs();
  OverlayPanelIdServiceSpec();
  OverlayPanelFocusManagerServiceSpec();
});
