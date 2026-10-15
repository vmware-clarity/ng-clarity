---
title: Update v18 to v19
addLevel3HeadingsToToc: true
---

# Update v18 to v19

Clarity v19 upgrades its build toolchain to Angular 22 and TypeScript 6.

## Node.js requirements

Before updating to Clarity v19, use Node.js 24.15.0 or later in the 24.x release line, or Node.js 26.0.0 or later.
These versions meet the [Angular 22 Node.js requirements](https://angular.dev/reference/versions).

For Clarity contributors, the repository also requires npm 11.0.0 or later. Its `.nvmrc` file pins Node.js 24.15.0
for local development and CI. Run `nvm install` and `nvm use` from the repository root to select that version.

## Angular and package requirements

Clarity v19 requires Angular 22. Angular 21 applications must upgrade Angular before installing Clarity v19.
Angular framework and CDK peer dependencies are bounded to `^22.0.0`.

`@clr/angular` declares its Angular animations, CDK, common, core, forms, platform-browser and router peers,
along with RxJS `^7.8.0`. `@clr/addons` requires the corresponding Clarity v19 Angular package; published releases
pin this peer to the matching release version, including prereleases.

Both libraries declare `tslib` as a runtime dependency. `@clr/addons` also declares `reflect-metadata`, used by
its workflow input and output mappings. These runtime dependencies are installed with the packages.

## CDK constructor changes

Clarity v19 uses CDK 22 constructor signatures. The exported `CdkDragModule_CdkDrag`,
`CdkTrapFocusModule_CdkTrapFocus` and `ClrStandaloneCdkTrapFocus` wrappers have zero-argument constructors.
Their CDK base classes resolve dependencies through Angular injection. If you subclass these wrappers,
call `super()` without arguments and let Angular create the directive. Tests should create directives
through `TestBed` rather than manually passing dependencies to their constructors.

This is a public TypeScript API change for code that constructs or extends the wrappers. Applications
that use the directives through templates do not need to change those bindings.

Custom CDK focus-trap implementations also need to match CDK 22: `FocusTrap` takes an `Injector` as its
sixth constructor argument, after `deferAnchors`, and `ConfigurableFocusTrap` takes an `Injector` after
its configuration argument. `ConfigurableFocusTrapFactory` has a zero-argument constructor; obtain it
through Angular dependency injection and call `create(element, config)` instead of passing dependencies
to the factory constructor. Clarity's website focus-trap override has been adapted to the new signature.

## Enum declarations

The exported `Reason` enum in `@clr/addons/wizard` is now a regular enum rather than a const enum, so
applications using `isolatedModules` can reference its members. Its `finish` and `cancel` string values
are unchanged. Internal icon size and certificate algorithm enums also use regular enum declarations.
