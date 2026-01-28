/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import CommonSpecs from './common.spec';
import ControlContainerSpecs from './control-container.spec';
import ErrorSpecs from './error.spec';
import FormSpecs from './form.spec';
import HelperSpecs from './helper.spec';
import IfErrorSpec from './if-control-state/if-error.spec';
import LabelSpecs from './label.spec';
import LayoutSpecs from './layout.spec';
import ControlClassServiceSpecs from './providers/control-class.service.spec';
import ControlIdServiceSpecs from './providers/control-id.service.spec';
import LayoutServiceSpecs from './providers/layout.service.spec';
import NgControlServiceSpecs from './providers/ng-control.service.spec';
import SuccessSpec from './success.spec';
import WrappedControlSpecs from './wrapped-control.spec';

describe('Forms common utilities', function () {
  ControlClassServiceSpecs();
  ControlIdServiceSpecs();
  ControlContainerSpecs();
  NgControlServiceSpecs();
  LayoutServiceSpecs();
  LayoutSpecs();
  FormSpecs();
  LabelSpecs();
  WrappedControlSpecs();
  CommonSpecs();
  ErrorSpecs();
  SuccessSpec();
  HelperSpecs();
  IfErrorSpec();
});
