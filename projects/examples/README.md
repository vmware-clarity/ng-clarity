# Shared examples

The component examples in this folder are the single source for the three apps that show them:

- the documentation website (`projects/website`), which shows each example with its code and a StackBlitz link,
- the demo app (`projects/demo`), the playground,
- Storybook (`.storybook`), which the visual regression tests screenshot.

The apps import them from `@clr/examples/<component>`, compiled from source like `@clr/angular`.

## Adding an example

1. Add `<id>.example.ts` and `<id>.example.html` (and optionally `<id>.example.scss`) to the component's folder.
   The component must be standalone and self-contained: import only from `@angular/*`, `@clr/angular`,
   `@clr/addons` and files next to it, because the website opens it in StackBlitz as is.
2. Add an entry to the folder's `examples.json` with its `id`, `title` and `targets` (`website`, `demo`, `storybook`).
   Set `"showStyles": false` when the styles only frame the example and are not worth showing on the website.
3. Run `npm run examples:generate`. It writes the folder's `index.ts` (components, metadata and source text) and the
   Storybook stories in `.storybook/stories/examples`. `npm run lint` fails when they are out of date.

The source text is rewritten to what the website's StackBlitz project expects: the component is renamed to
`ExampleComponent`, its selector to `app-example` and its files to `example.component.*`.

## Using examples

- Website: `<app-doc-example [example]="examples.solid"></app-doc-example>` renders the example and its code.
- Demo app: route to `ExampleListComponent` with `data: { examples }` to render every example that targets the demo.
- Storybook: the generated stories render every example that targets Storybook under `<Component>/Examples`.
