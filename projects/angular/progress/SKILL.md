---
name: clr-progress
description: Show progress with Clarity — determinate/indeterminate progress bars (`clr-progress-bar` with `clrValue`, `clrMax`, `clrColor`, `clrLabeled`, `clrLoop`) and spinners (`clr-spinner` with `clrInline`, `clrSmall`, `clrMedium`, `clrInverse`), or their `.progress` / `.spinner` CSS classes, from `@clr/angular`. Use when indicating loading, uploads, or any ongoing user-initiated process.
metadata:
  docs: /documentation/progress
  guidance: ['1020:2024-10-30', '1028:2024-10-30']
---

# Clarity progress bars and spinners

## When to use

From the [progress bar guidance](https://guidance.clarity.design/1020) and [spinner guidance](https://guidance.clarity.design/1028):

- **Determinate progress bar** when the duration or amount is known (uploads, multi-step setup). Always add descriptive text next to it, such as the file name and size. A percentage label is optional.
- **Indeterminate** (`clrLoop`) when there's no estimated end. If space is tight, use a spinner instead.
- **Spinner**: a page spinner for whole-page operations, an inline spinner for one component. Place it where the result will appear, with a short status text ("Loading…").
- Never signal state by color alone. Pair `danger`/`success` with text or an icon.

## Setup

```ts
import { ClrProgressBarModule, ClrSpinnerModule } from '@clr/angular';

@Component({ imports: [ClrProgressBarModule, ClrSpinnerModule] /* ... */ })
```

## Progress bar

```html
<span id="upload-label">Uploading {{ file.name }} ({{ file.size }})</span>
<clr-progress-bar id="upload-progress" [clrValue]="uploaded" [clrMax]="file.size" clrLabeled></clr-progress-bar>

<clr-progress-bar clrValue="100" clrColor="success" clrLabeled clrDisplayval="Done"></clr-progress-bar>

<clr-progress-bar clrLoop></clr-progress-bar>
```

| Input           | Purpose                                                   |
| --------------- | --------------------------------------------------------- |
| `clrValue`      | Current value (default 0)                                 |
| `clrMax`        | Maximum (default 100)                                     |
| `clrColor`      | `success`, `warning`, or `danger` (default: info/blue)    |
| `clrLabeled`    | Show the value label on the right                         |
| `clrDisplayval` | Custom label text (default `{value}%`)                    |
| `clrLoop`       | Indeterminate, looping animation                          |
| `clrCompact`    | Thinner bar                                               |
| `clrFade`       | Fade out once the value reaches 100%                      |
| `id`            | Id of the inner `<progress>` element (for `aria-*` links) |

- `clrFlashDanger` is deprecated, and the flash styles behind `clrFlash` are marked deprecated in the scss. Show completion or failure with `clrColor` plus text instead.
- CSS only: `<div class="progress success labeled"><progress value="65" max="100" data-displayval="65%"></progress></div>`. Use `class="progress loop"` for indeterminate.

## Spinner

```html
@if (loading) {
<clr-spinner>Loading users</clr-spinner>
} @else {
<app-user-list [users]="users" />
}

<span>
  <clr-spinner clrInline>Saving</clr-spinner>
  Saving…
</span>
```

- Projected text is visually hidden but read by screen readers. Always provide it. The host sets `aria-busy`.
- Sizes: default (large), `clrMedium`, `clrSmall`. Use `clrInline` next to text, and `clrInverse` on dark backgrounds.
- For a busy button, use `[clrLoading]` on the button (see clr-button) rather than putting a spinner inside it.
- CSS only: `<span class="spinner spinner-inline">Loading…</span>`, plus modifiers `spinner-sm`, `spinner-md`, `spinner-inverse`.

## References

- Design guidance: https://guidance.clarity.design/1020, https://guidance.clarity.design/1028
- API: `projects/angular/clarity.api.md` (`ClrProgressBar`, `ClrSpinner`)
- Styles: `projects/angular/progress/progress-bars/STYLES.md`, `projects/angular/progress/spinner/STYLES.md`
- Docs demos: `projects/website/src/app/documentation/demos/progress-bars/`, `.../demos/spinners/` (spinner page: /documentation/spinner)
