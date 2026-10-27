# Shared examples

The component examples in this folder are the single source for the three apps that show them:

- the documentation website (`projects/website`), which shows each example with its code and a StackBlitz link,
- the demo app (`projects/demo`), the playground,
- Storybook (`.storybook`), which the visual regression tests screenshot.

The apps import them from `@clr/examples/<component>`, compiled from source like `@clr/angular`.

## Adding an example

1. Add `<id>.example.ts` and `<id>.example.html` (and optionally `<id>.example.scss`) to the component's folder.
   The website opens these three files in StackBlitz as they are, so the example must be self-contained:
   - The component is standalone and imports only from `@angular/*`, `@clr/angular`, `@clr/addons`, `rxjs` and
     files next to it.
   - Styles use CSS custom properties such as `var(--cds-global-space-9)`, not `@use` or `@import` of Sass files
     from this repository.
   - Other files it needs, such as mock data, sit in the component's folder and are imported with a relative path
     (`./inventory/inventory`). The generator finds them through the imports and StackBlitz gets them at the same paths.
   - Images go in `projects/examples/assets`. All three apps serve that folder at `assets/examples/`, so reference them
     with that relative path, such as `src="assets/examples/placeholder_350x150.png"`.
2. Add an entry to the folder's `examples.json` with its `id`, `title` and `targets` (`website`, `demo`, `storybook`).
   When any example targets Storybook, set the file's `storybook` key to the component's story directory, such as
   `components/button` (see `docs/CONTRIBUTING_STORYBOOK.md`).
   Set `"showStyles": false` when the styles only frame the example and are not worth showing on the website.
3. Run `npm run examples:generate`. It writes the folder's `index.ts` (components, metadata and source text) and the
   Storybook stories in `.storybook/stories/<storybook>/<name>-examples.stories.ts`. `npm run lint` fails when they
   are out of date.

The source text is rewritten to what the website's StackBlitz project expects: the component is renamed to
`ExampleComponent`, its selector to `app-example` and its files to `example.component.*`.

## Using examples

- Website: `<app-doc-example [example]="examples.solid"></app-doc-example>` renders the example and its code.
- Demo app: route to `ExampleListComponent` with `data: { examples }` to render every example that targets the demo.
- Storybook: the generated stories render every example that targets Storybook under `<story directory>/Examples`,
  such as `Components/Button/Examples`.
