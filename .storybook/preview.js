/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { setCompodocJson } from '@storybook/addon-docs/angular';
import docs from './../documentation.json';

setCompodocJson(docs);

export const parameters = {
  docs: { inlineStories: true },
  chromatic: { disableSnapshot: true },
};
