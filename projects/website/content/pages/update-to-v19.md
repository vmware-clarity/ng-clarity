---
title: Update v18 to v19
addLevel3HeadingsToToc: true
---

# Update v18 to v19

Clarity v19 upgrades its build toolchain to Angular 22 and TypeScript 6.

## Node.js requirements

Before updating to Clarity v19, use a Node.js version supported by Angular 22 (`^22.22.3 || ^24.15.0 || >=26.0.0`).
See the [Angular 22 Node.js requirements](https://angular.dev/reference/versions).

Clarity contributors need Node.js `^24.15.0 || >=26.0.0` and npm 11.0.0 or later to work on the repository. Its
`.nvmrc` file pins Node.js 24.15.0 for local development and CI. Run `nvm install` and `nvm use` from the repository
root to select that version.

## Angular and package requirements

Clarity v19 requires Angular 22. Angular 21 applications must upgrade Angular before installing Clarity v19.
Angular framework and CDK peer dependencies are bounded to `^22.0.0`.

`@clr/angular` declares its Angular CDK, common, core, forms, platform-browser and router peers,
along with RxJS `^7.8.0`.

`@clr/ui`, `@clr/angular` and `@clr/addons` are released together with the same version number. Published releases
pin `@clr/angular`'s `@clr/ui` peer and `@clr/addons`' `@clr/angular` peer to that exact version, including
prereleases. Always update the three packages together to the same version; mixing versions fails peer dependency
resolution.

Both libraries declare `tslib` as a runtime dependency. `@clr/addons` also declares `reflect-metadata`, used by
its workflow input and output mappings. These runtime dependencies are installed with the packages.

The certificate viewer in `@clr/addons` needs `asn1js` `^3.0.6` and `pkijs` `^3.2.5`. They are optional peer
dependencies of `@clr/addons`, so install them only if your application uses the certificate viewer.

## CDK constructor changes

Clarity v19 uses CDK 22 constructor signatures. Since v18.4.0, the exported `CdkDragModule_CdkDrag`,
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
