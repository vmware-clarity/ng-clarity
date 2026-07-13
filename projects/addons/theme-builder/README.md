### Overview & Rationale

`ThemeBuilderComponent` is a standalone, embeddable UI for customizing Clarity's color tokens
(primary, info, success, warning, danger) across both the light and dark theme, previewing the
result live, and exporting a CSS override file consumers can drop into their application.

### Design

#### ThemeBuilderComponent

- `[presets]` — the list of named color presets shown in the preset selector. Defaults to
  Clarity's built-in preset list (`PRESETS`), exported from this entry point so consumers can
  extend it (e.g. `[...PRESETS, myPreset]`) instead of replacing it outright.
- `(generatedCSS)` — emits the generated CSS override text (a `string`) every time a color,
  preset, reset, or the warning-text-override toggle changes.
- `[customContent]` — by default (`false`) the component renders a built-in preview covering most
  Clarity components (buttons, forms, datagrid, alerts, navigation, etc.) so the color changes
  can be seen in context. Set it to `true` and project your own preview through `<ng-content>`
  instead; the projected content still renders inside the themed preview sandbox, so it reacts to
  the light/dark toggle and every color edit exactly like the built-in preview does.

##### The component doesn't support:

- Persisting the generated CSS — it's the consumer's responsibility to display, copy, or save the
  value emitted through `generatedCSS`.
- Editing color tokens other than the five status/primary aliases (primary, info, success,
  warning, danger) and their computed tint/shade/dark variants.

### Example Code

_host.component.html_:

```html
<clr-theme-builder [presets]="presets" (generatedCSS)="generatedCss = $event"></clr-theme-builder>

<pre>{{ generatedCss }}</pre>
```

_host.component.html_ — projecting a custom preview instead of the built-in one:

```html
<clr-theme-builder [presets]="presets" [customContent]="true" (generatedCSS)="generatedCss = $event">
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
      light: { primary: new Color('--cds-alias-primary', 'hsl(160deg 69% 36%)') },
      dark: { primary: new Color('--cds-alias-primary', 'hsl(160deg 69% 53%)') },
    },
  ];

  generatedCss = '';
}
```
