/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/** @jsx h */

function NavPreview({
  entry: immutableEntry
}) {
  // I want to work with a plain JS object, not the immutable object it gives me.
  const entry = JSON.parse(JSON.stringify(immutableEntry));
  return h("section", null, h("h1", null, entry.data.title), h("ul", null, entry.data.groups.map(group => h("li", null, group.label, renderGroupLinks(group)))));
  function renderGroupLinks(group) {
    if (group.label === 'Components') {
      return h("ul", null, h("li", null, h("em", null, "[The component pages will be automatically inserted here.]")));
    } else if (group.links) {
      return h("ul", null, group.links.map(link => h("li", null, h("a", {
        href: link.url
      }, link.label))));
    }
  }
}
CMS.registerPreviewTemplate('nav', NavPreview);
