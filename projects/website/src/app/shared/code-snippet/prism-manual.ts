/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Stops Prism from highlighting the whole page on its own when it loads. That automatic pass ran once, at a moment
// that depends on rendering, and it turned the build-time highlighting of languages the website doesn't load at
// runtime (SCSS in compiled markdown) back into plain text. highlightStaticCode() handles the static blocks instead.
// Prism reads this setting when it loads, so this module must be imported before 'prismjs'.
(globalThis as { Prism?: { manual?: boolean } }).Prism = { manual: true };
