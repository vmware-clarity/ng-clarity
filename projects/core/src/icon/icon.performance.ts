/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityIcons } from '@cds/core/icon/icon.service.js';
import { ellipsisVerticalIcon } from '@cds/core/icon/shapes/ellipsis-vertical.js';
import { html, testBundleSize, testRenderTime } from 'web-test-runner-performance/browser.js';
import '@cds/core/icon/register.js';

ClarityIcons.addIcons(ellipsisVerticalIcon);

describe('cds-icon performance', () => {
  it(`should bundle and treeshake individual icons`, async () => {
    const bundle = `
      import { ClarityIcons, userIcon } from '@cds/core/icon';
      import '@cds/core/icon/register.js';
      ClarityIcons.addIcons(userIcon);
    `;
    expect((await testBundleSize(bundle)).kb).toBeLessThan(19.8);
  });

  it(`should bundle all icons`, async () => {
    const bundle = `
    import { loadChartIconSet, loadCommerceIconSet, loadCoreIconSet, loadEssentialIconSet, loadMediaIconSet, loadMiniIconSet, loadSocialIconSet, loadTechnologyIconSet, loadTextEditIconSet, loadTravelIconSet } from '@cds/core/icon';
    import '@cds/core/icon/register.js';
      loadChartIconSet();
      loadCommerceIconSet();
      loadCoreIconSet();
      loadEssentialIconSet();
      loadMediaIconSet();
      loadMiniIconSet();
      loadSocialIconSet();
      loadTechnologyIconSet();
      loadTextEditIconSet();
      loadTravelIconSet();
    `;

    expect((await testBundleSize(bundle)).kb).toBeLessThan(248);
  });

  const icon = html`<cds-icon shape="ellipsis-vertical"></cds-icon>`;

  it(`should render 1 icon under 20ms`, async () => {
    expect((await testRenderTime(icon)).duration).toBeLessThan(20);
  });

  it(`should render 100 icons under 50ms`, async () => {
    expect((await testRenderTime(icon, { iterations: 100, average: 5 })).duration).toBeLessThan(50);
  });
});
