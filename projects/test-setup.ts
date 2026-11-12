/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

afterEach(() => {
  vi.useRealTimers();
});

document.body.setAttribute('cds-theme', '');

// Match the native-animation defaults from the upstream test bootstrap.
if (!document.getElementById('clr-test-no-animations')) {
  const noAnimationsStyle = document.createElement('style');
  noAnimationsStyle.id = 'clr-test-no-animations';
  noAnimationsStyle.textContent = `*, *::before, *::after { animation: none !important; transition: none !important; }`;
  document.head.appendChild(noAnimationsStyle);
}
