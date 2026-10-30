### Overview & Rationale

`ThemeBuilderComponent` is a standalone, embeddable UI for customizing Clarity's color tokens
(primary, info, success, warning, danger) across both the light and dark theme, previewing the
result live, and exporting a CSS override file consumers can drop into their application.

### Design

#### ThemeBuilderComponent

- `[presets]` — the list of named color presets shown in the preset selector. Defaults to
  Clarity's built-in preset list (`PRESETS`), exported from this entry point so consumers can
  extend it (e.g. `[...PRESETS, myPreset]`) or replacing it outright. Whatever list is
  provided, the Clarity Default preset is always prepended and selected initially, so it remains
  always available.
  Each preset holds `light` and `dark` color groups (`primary`, `info`, `success`, `warning`,
  `danger`), and each group is a `Color[]`. A group can list its base token and any of its
  variants: the base drives the computed tint/shade/dark variants, and a variant listed
  explicitly overrides the computed value.
- `(generatedCSS)` — emits the generated CSS override text (a `string`) every time a color,
  preset, reset, or the warning-text-override toggle changes. The initial value is emitted after
  the preview has rendered and its computed colors have been read. Color controls and output
  update with either zoneless or Zone.js change detection.
- Content projection — anything projected through `<ng-content>` renders above the built-in
  preview, which covers most Clarity components (buttons, forms, datagrid, alerts, navigation,
  etc.) so the color changes can be seen in context. Projected content renders inside the same
  themed preview sandbox, so it reacts to the light/dark toggle and every color edit exactly like
  the built-in preview does.
- `importCSS(css)` — re-applies CSS previously emitted through `generatedCSS`, resetting both
  themes first. Returns `false` and leaves the current colors untouched when
  `validateGeneratedCSS` rejects the CSS.

##### The component doesn't support:

- Persisting the generated CSS — it's the consumer's responsibility to display, copy, or save the
  value emitted through `generatedCSS`.
- Editing color tokens other than the five status/primary aliases (primary, info, success,
  warning, danger) and their computed tint/shade/dark variants.

#### validateGeneratedCSS

`validateGeneratedCSS(css)` checks CSS before it's imported and returns a `ThemeCssValidation`:

- `valid` — `true` when the CSS can be imported as is.
- `malformedDeclarations` — theme-block declarations whose value isn't an accepted `hsl()`
  shape, or that aren't custom properties, as written.
- `duplicateThemeBlocks` — themes whose `[cds-theme~='light'|'dark']` block appears more than
  once.
- `duplicateTokens` — tokens declared more than once for the same theme.

CSS with no recognized theme color (including the "NO changes" output) is also invalid, since
importing it would only reset the colors.

### Example Code

_host.component.html_:

```html
<clr-theme-builder [presets]="presets" (generatedCSS)="generatedCss = $event"></clr-theme-builder>

<pre>{{ generatedCss }}</pre>
```

_host.component.html_ — projecting a custom preview above the built-in one:

```html
<clr-theme-builder [presets]="presets" (generatedCSS)="generatedCss = $event">
  <my-app-shell></my-app-shell>
</clr-theme-builder>
```

_host.component.ts_:

```ts
import { Color, PRESETS, ThemeBuilderComponent, ThemePreset } from '@clr/addons/theme-builder';

@Component({
  imports: [ThemeBuilderComponent /* ... */],
})
export class HostComponent {
  presets: ThemePreset[] = [
    ...PRESETS,
    {
      name: 'Custom',
      light: { primary: [new Color('--cds-alias-primary', 'hsl(160deg 69% 36%)')] },
      dark: { primary: [new Color('--cds-alias-primary', 'hsl(160deg 69% 53%)')] },
    },
  ];

  generatedCss = '';
}
```

### Restoring a saved theme

`applyPreset()` and `importCSS()` can be called from a host's first `ngAfterViewInit`.
The preview reads its computed colors after rendering; requests made before that
initialization are retained, and the latest valid preset or CSS request is applied
when the preview is ready. `importCSS()` returns `true` for accepted CSS, including
an early request, and `false` for malformed CSS. Rejected CSS does not replace an
already pending request. The `generatedCSS` output reports the resulting theme.
