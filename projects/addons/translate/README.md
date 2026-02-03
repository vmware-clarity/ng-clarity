### Overview & Rationale

AppFx Translate provides translations for the AppFx components. It aims to provide
independence and applicability of AppFx components across different products using
different localization libraries - or stay independent of the localization library of
choice for the application.

### Design

#### AppfxTranslateService

<div class="alert alert-info" role="alert">
    <div class="alert-items">
        <div class="alert-item static">
            <div class="alert-icon-wrapper">
                <cds-icon class="alert-icon" shape="info-circle"></cds-icon>
            </div>
            <span class="alert-text">
                Consumers of the AppFx library should only use the AppfxTranslateService to
                sync the locale with their application locale.
            </span>
        </div>
    </div>
</div>

#### Features:

- Single locale management point for AppFx components
- Simple translate functionality with interpolation arguments similar to
  [@ngx-translate/core](https://github.com/ngx-translate/core).
- Per-component translations isolation through `InjectionToken`s.

##### The service doesn't support:

- Loading translations from an endpoint

##### It's discouraged to:

- Use the service as a general purpose translate service outside AppFx because it's meant
  to be a light weight implementation for the AppFx components and thus lacks some
  general purpose functionalities.
- Provide global translations. Each AppFx component that needs translations should use
  its own component providers to achieve isolation.

#### TranslatePipe

Exposes the translate functionality of the AppfxTranslateService as a pipe.

#### DateTimeService

##### Features:

- Standardized date-time formatting for AppFx components.

##### The service doesn't support:

- Custom date formats. To keep the formatting standardized there are only a few different
  formatting options.

#### DateTimePipe

Exposes the date-time formatting functionality of the DateTimeService as a pipe.

### Example Code

_translate-demo.component.html_:

```html
<clr-select-container>
  <label>Locale</label>
  <select clrSelect name="locales" [(ngModel)]="translateService.locale">
    <option *ngFor="let locale of locales" [value]="locale[1]">{{ locale[0] }}</option>
  </select>
</clr-select-container>

<p>{{ 'hello-world' | translate }}</p>
<p>{{ getNow() | dateTime: dateTimeFormat }}</p>
```

_translate-demo.component.ts_:

```ts
@Component({
  templateUrl: './translate-demo.component.html',
  providers: [
    AppfxTranslateService,
    // Provide the translations
    {
      provide: appfxTranslations,
      useValue: {
        [Locale.En]: {
          'hello-world': 'Hello World!',
        },
        [Locale.De]: {
          'hello-world': 'Hallo Welt!',
        },
      },
    },
    // Override the default hook for missing translations
    {
      provide: appfxMissingTranslation,
      useValue: (translations: Translations, locale: Locale, key: string, args?: InterpolationParams) => {
        return `<Missing translation for locale "\${locale}" with key "\${key}">`;
      },
    },
  ],
})
export class TranslateDemoComponent {
  readonly locales = Object.entries(Locale);

  readonly dateTimeFormat: DateTimeFormatOptions = {
    dateTimeKind: DateTimeKind.DateTime,
    hourFormat: HourFormat.Hour24,
  };

  constructor(public readonly translateService: AppfxTranslateService) {}

  getNow(): Date {
    return new Date();
  }
}
```
