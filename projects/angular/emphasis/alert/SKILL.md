---
name: clr-alert
description: Show Clarity alert banners — standard, lightweight, small, and app-level alerts (`clr-alert`, `clr-alert-item`, `.alert-text`, `.alert-actions`) plus grouped app-level alerts with a pager (`clr-alerts`) from `@clr/angular`. Use when adding status/error/warning/info/success messages, closable banners, `clrAlertType`, `clrAlertAppLevel`, `clrAlertLightweight`, or `clrAlertClosed`.
metadata:
  docs: /documentation/alert
  guidance: ['1001:2024-11-20']
---

# Clarity alerts

## When to use

From the [alert guidance](https://guidance.clarity.design/1001):

- **Standard** alerts go inside the content area, containers, cards, or modals, close to what they're about. Types: `danger`, `warning`, `info`, `success`.
- **App-level** alerts are only for global, application-wide messages, at the very top of the app. Types: `danger`, `warning`, `info` only. Never use them to confirm a successful operation.
- **Lightweight** (`clrAlertLightweight`) where vertical space is scarce. Otherwise use the default size.
- At most one alert in a modal and one in a card. In a card, put it at the very top, use the small size, and keep the text short.
- Group several app-level alerts in `clr-alerts`, ordered by urgency: danger, warning, info.

## Setup

```ts
import { ClrAlertModule } from '@clr/angular'; // or ClrEmphasisModule

@Component({ imports: [ClrAlertModule] /* ... */ })
```

## Standard alert

```html
@if (error) {
<clr-alert clrAlertType="danger" [(clrAlertClosed)]="errorDismissed">
  <clr-alert-item>
    <span class="alert-text">{{ error }}</span>
    <div class="alert-actions">
      <button type="button" class="btn alert-action" (click)="retry()">Retry</button>
    </div>
  </clr-alert-item>
</clr-alert>
}
```

| Input                     | Values / purpose                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------- |
| `clrAlertType`            | `info` (default), `warning`, `danger`, `success`, `neutral`, `unknown`, `loading`       |
| `[clrAlertClosable]`      | Show the close button (default `true`). Set `false` for messages that must stay visible |
| `[(clrAlertClosed)]`      | Closed state, two-way. `(clrAlertClosedChange)` fires when the user closes it           |
| `[clrAlertSizeSmall]`     | Compact size (use in cards and dense areas)                                             |
| `[clrAlertLightweight]`   | Lightweight, lower-emphasis style                                                       |
| `[clrAlertAppLevel]`      | App-level banner at the top of the app                                                  |
| `clrAlertIcon`            | Override the status icon shape                                                          |
| `clrCloseButtonAriaLabel` | Localized aria-label for the close button                                               |

- One `clr-alert` can hold several `clr-alert-item`s of the same type.
- Put text in `.alert-text`, and buttons or links in `.alert-actions` with `class="btn alert-action"`.

## App-level alerts with pager

```html
<div class="main-container">
  <clr-alerts [(clrCurrentAlertIndex)]="alertIndex">
    @for (msg of appMessages; track msg.id) {
    <clr-alert [clrAlertType]="msg.type" [clrAlertAppLevel]="true">
      <clr-alert-item>
        <span class="alert-text">{{ msg.text }}</span>
      </clr-alert-item>
    </clr-alert>
    }
  </clr-alerts>
  <header class="header">...</header>
  <div class="content-container">...</div>
</div>
```

- `clr-alerts` shows one alert at a time with a built-in pager (`clr-alerts-pager`, which you don't add yourself). It takes `clrCurrentAlertIndex` or `clrCurrentAlert`, with matching `...Change` outputs.
- Place app-level alerts as the first child of `.main-container`, above the header.

## Rules

- Use `@if` to remove an alert from the DOM for app logic. Use `clrAlertClosed` only for the user's dismiss state.
- Don't rely on color alone. The text must say what happened and what to do.
- Success feedback for an action goes in context or in a notification, not in an app-level alert.

## References

- Design guidance: https://guidance.clarity.design/1001
- API: `projects/angular/emphasis/emphasis.api.md`
- Styles: `projects/angular/emphasis/alert/_alert.clarity.scss`, `projects/angular/emphasis/alert/STYLES.md`
- Docs demos: `projects/website/src/app/documentation/demos/alert/`
