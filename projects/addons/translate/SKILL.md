---
name: appfx-translate
description: Set the locale and translations used by AppFX components with `AppfxTranslateService`, `appfxTranslationsToken`, the `translate` and `dateTime` pipes from `@clr/addons/translate`. Use when syncing the app locale with AppFX components, providing AppFX translations, formatting dates with `DateTimePipe`, or localizing `@clr/addons` components.
metadata:
  docs: /documentation/translate
---

# AppFX translate (`@clr/addons/translate`)

## When to use

AppFX components (datagrid, card container, certificate viewer, required field legend, ...) translate their own strings through this package. In a consumer app, its main job is to **sync the AppFX locale with the app locale**. It is a lightweight helper, so keep using your app's own i18n library (ngx-translate, Angular i18n, ...) for app strings.

Supported locales: `AppfxLocale.En`, `Es`, `Fr`, `Ja`.

## Setup

```ts
import { AppfxTranslateModule, AppfxTranslateService, AppfxLocale } from '@clr/addons/translate';

@Component({
  imports: [AppfxTranslateModule], // translate + dateTime pipes; provides AppfxTranslateService, DateTimeService
  // ...
})
```

Use `AppfxTranslateModule`, `AppfxTranslateService`, `AppfxTranslations`, `AppfxLocale`. The unprefixed `TranslateModule`, `TranslateService`, `Translations`, `Locale` are deprecated aliases.

## Sync the locale

```ts
export class AppComponent {
  private readonly appfxTranslate = inject(AppfxTranslateService);

  onLocaleChange(lang: string): void {
    this.appfxTranslate.locale = lang as AppfxLocale; // e.g. 'fr'
  }
}
```

`localeChanged$` emits on change; `localeAsBcp47()` returns the BCP 47 tag.

## Component-scoped translations

```ts
@Component({
  selector: 'app-widget',
  imports: [AppfxTranslateModule],
  providers: [
    AppfxTranslateService,
    {
      provide: appfxTranslationsToken,
      useValue: {
        [AppfxLocale.En]: { greeting: 'Hello {{name}}' },
        [AppfxLocale.Es]: { greeting: 'Hola {{name}}' },
        [AppfxLocale.Fr]: { greeting: 'Bonjour {{name}}' },
        [AppfxLocale.Ja]: { greeting: 'こんにちは {{name}}' },
      } satisfies AppfxTranslations,
    },
  ],
  template: `<p>{{ 'greeting' | translate: { name: user } }}</p>`,
})
```

Override the missing-key behavior with `{ provide: appfxMissingTranslationToken, useValue: myHandler }` (`EmptyTranslationCallback`); the default is `defaultMissingTranslationHandler`.

## Dates

```ts
readonly format: DateTimeFormatOptions = { dateTimeKind: DateTimeKind.DateTime, hourFormat: HourFormat.Hour24 };
```

```html
<span>{{ lastModified | dateTime: format }}</span>
```

`DateTimeKind`: `Date`, `Time`, `DateTime`, `LongDateTime`. Formatting follows the AppFX locale; custom patterns are unsupported.

## Rules

- Provide translations per component (`providers`), with every `AppfxLocale` key present; global app-wide AppFX translations are discouraged.
- Translations are static objects — loading them from an endpoint is unsupported.
- Interpolation uses `{{param}}` placeholders.

## References

- API: `projects/addons/translate/translate.api.md`
- Docs: `projects/addons/translate/README.md`, demos in `projects/website/src/app/documentation/demos/translate/`
