---
title: Support Policies
---

# Clarity Support Policies

<div cds-layout="m-t:xxl">
  <app-cms-themed-image
    light-src="/assets/images/clarity-support-policies-banner.svg"
    dark-src="/assets/images/clarity-support-policies-banner-dark.svg"
    image-alt=""
    image-style="max-width: 100%"
  ></app-cms-themed-image>
<div>

## Versioning

Clarity Design System follows the pattern known as [Semantic Versioning](https://semver.org/), which
is a description of how the version number is updated based on what types of changes are in the
release. This helps provide users a guarantee about what to expect when upgrading Clarity. The
following list explains what to expect in each type of release:

- A **MAJOR** release can contain breaking changes, new features, and bug fixes.
- A **MINOR** release can contain new features, as well as bug fixes.
- A **PATCH** release contains only bug fixes.

By knowing the version of Clarity that you are using, you can figure out what features are available
to use. You will be able to see which features will be available by upgrading to a newer version.

**Important:** The version of the `@clr/ui` package does not follow semantic versioning. Instead, it
is aligned to the version of `@clr/angular`. While we strive to introduce breaking changes in only
major versions, we may at times need to introduce a breaking change in a minor version to maintain
alignment with the `@clr/angular` library. If you use this package, we recommend that you pin your
project to a specific path version and treat each update as a potentially breaking change.

## What constitutes a breaking change?

With respect to Clarity, breaking changes include, but are not limited to:

- Removal of support for select APIs, features, and components.
- Any change that forces users to update unrelated dependencies that they are not prepared to take.
- Any change that prevents or breaks usage of documented Clarity APIs.
- Any change in visual appearance that causes a disjoint from the existing implementation.
- Any change causing a loss in functionality from an existing release.

Breaking changes will be batched in major releases and will follow the Deprecation Policy outlined
later on this page.

## Support Policy & Schedule

Our support policy for Clarity releases is to actively support the previous major release for 6 months
after a new major release is available. For example, v5 will be supported for 6 months after its
successor v6 is released. In cases of severe issues, out-of-support versions might be updated and
released.

| Version | Status             | Released           | Support Ends                   |
| ------- | ------------------ | ------------------ | ------------------------------ |
| v17     | Actively Supported | February 15, 2024  | 6 months after v18 is released |
| v16     | Out of support     | September 28, 2023 | August 15, 2024                |
| v15     | Out of support     | February 21, 2023  | March 28, 2024                 |
| v13     | Out of support     | January 14, 2022   | August 21, 2023                |
| v12     | Out of support     | July 22, 2021      | September 1, 2022              |
| v5      | Out of support     | January 21, 2021   | February 1, 2022               |
| v4      | Out of support     | August 19, 2020    | August 1, 2021                 |
| v3      | Out of support     | February 27, 2020  | April 1, 2021                  |
| v2      | Out of support     | July 6, 2019       | January 2021                   |
| v1      | Out of support     | November 29, 2018  | August 2020                    |

## Clarity Design System and Angular Compatibility

| Clarity Version | Angular Version | Status             |
| --------------- | --------------- | ------------------ |
| v17             | v15 - v19*      | Actively supported |
| v16             | v15 - v17*      | Out of support     |
| v15             | v15 - v16       | Out of support     |
| v13             | v13 - v16       | Out of support     |
| v12             | v12             | Out of support     |
| v5              | v11             | Out of support     |
| v4              | v10             | Out of support     |
| v3              | v9              | Out of support     |
| v2              | v8              | Out of support     |
| v1              | v7              | Out of support     |

* Angular 17 is supported as of v16.4.0.
* Angular 18 is supported as of v17.3.0.
* Angular 19 is supported as of v17.5.0.

## Deprecation Policy

Sometimes breaking changes are necessary to innovate and stay current with new best practices,
changing dependencies, or changes in the web platform itself.

To make these transitions as straightforward as possible, we make these commitments to you:

- All breaking changes are batched into major releases.
- We work to minimize the number of breaking changes and to provide migration tools when possible.
- We use the deprecation policy described in the following table, so that you have time to update
  your applications to the latest APIs and best practices.

<table class="table table--left-aligned">
  <tr>
    <th>
      Deprecation Stage
    </th>
    <th>
      Details
    </th>
  </tr>
  <tr>
    <td>
      Announcement
    </td>
    <td>
      We announce deprecated APIs, features, and components in the 
      <a href="https://github.com/vmware-clarity/ng-clarity/releases" target="_blank" rel="noopener">change log</a>.
      Deprecated APIs will be clearly called out in the <a href="/pages/introduction" rel="noopener">documentation</a>.
      When we announce a deprecation, we also announce a recommended update path.
    </td>
  </tr>
  <tr>
    <td>
      Deprecation period
    </td>
    <td>
      When an API, a feature, or a component is deprecated, it is still present in the next major
      release. After that, deprecated APIs, features, and components are candidates for removal. A
      deprecation can be announced in any release, but the removal of a deprecated API or feature
      happens only in major release.
    </td>
  </tr>
</table>

## Browser Support

We actively support the following browsers. For each, we support the current and previous major
releases only. For evergreen browsers, we support the current and previous Long Term Support (LTS)
or Extended Support Release (ESR) releases. 

- Edge
- Chrome
- Safari
- Firefox

## Accessibility Support

Clarity is tested across various accessibility testing tools and several sets of screen reader and
browser combinations against the **WCAG 2.1** spec.

The testing has identified two combinations that enable us to provide support when fixing issues
related to the various assistive technologies.
The following list shows the primary combinations that we focus on when addressing issues on the
Windows and macOS platforms.

- NVDA + Google Chrome (Windows)
- VoiceOver + Safari (Apple)

To hold Clarity to a high standard for accessibility, we have an accessibility team that reviews any
accessibility issues and verifies resolutions. For accessibility support, reach out to the
[VMware Accessibility](https://www.vmware.com/help/accessibility.html) team.
