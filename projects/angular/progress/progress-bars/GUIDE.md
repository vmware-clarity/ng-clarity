---
name: clr-progress-bar
description: Show determinate or indeterminate progress with the Clarity progress bar (`clr-progress-bar` with `clrValue`, `clrMax`, `clrLabeled`, `clrLoop`, or the `.progress` CSS classes) from `@clr/angular`. Use when adding or changing a progress bar for uploads, long operations, or step completion. For a loading indicator with no measurable progress, use `clr-spinner`.
metadata:
  docs: /documentation/progress
  guidance-1020: '2024-10-30'
---

# Clarity progress bar

## When to use

From the [progress bar guidance](https://guidance.clarity.design/1020):

- **Determinate** when the duration or amount is known (uploads, multi-step setup). Always add descriptive text next to it, such as the file name and size. A percentage label is optional.
- **Indeterminate** (`clrLoop`) when there's no estimated end. If space is tight, use a spinner instead — guide `clr-spinner`.
- Colour must not carry meaning. Report completion or failure with a text label or an alert next to the bar, not with colour or flash.

## Setup

```ts
import { ClrProgressBarModule } from '@clr/angular';

@Component({ imports: [ClrProgressBarModule] /* ... */ })
```

```ts
export class Upload {
  file = { name: 'backup.zip', size: 524288 };
  uploaded = 0;

  get percent(): number {
    return Math.round((this.uploaded / this.file.size) * 100);
  }
}
```

## Usage

```html
<div class="progress-block">
  <label for="upload-progress">Uploading {{ file.name }} ({{ file.size }})</label>
  <clr-progress-bar id="upload-progress" [clrValue]="percent" clrLabeled></clr-progress-bar>
</div>

<clr-progress-bar clrLoop></clr-progress-bar>
```

| Input           | Purpose                                                   |
| --------------- | --------------------------------------------------------- |
| `clrValue`      | Current value (default 0)                                 |
| `clrMax`        | Maximum (default 100)                                     |
| `clrColor`      | `success` / `warning` / `danger`, deprecated in 3.0       |
| `clrLabeled`    | Show the value label on the right                         |
| `clrDisplayval` | Custom label text (default `{value}%`)                    |
| `clrLoop`       | Indeterminate, looping animation                          |
| `clrCompact`    | Thinner bar                                               |
| `clrFade`       | Fade out once the value reaches 100%                      |
| `id`            | Id of the inner `<progress>` element (for `aria-*` links) |

- The label is `{value}%`, and `clrFade` only fires at a value of exactly `100`. So bind a percentage with the default `clrMax` of 100; if you set another `clrMax`, also set `clrDisplayval`.
- `clrColor` variants, `clrFlash` and `clrFlashDanger` are deprecated; don't use them. Report completion or failure with a text label or an alert next to the bar.
- CSS only: `<div class="progress labeled"><progress value="65" max="100"></progress><span>65%</span></div>`. Use `class="progress loop"` for indeterminate.

## References

- Design guidance: https://guidance.clarity.design/1020
- API: `@clr/angular/types/clr-angular-progress-progress-bars.d.ts` (`ClrProgressBar`)
- Styles: `@clr/ui/progress/progress-bars/_progress-bars.clarity.scss`
