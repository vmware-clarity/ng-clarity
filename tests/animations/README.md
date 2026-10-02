# Animation tests

The visual regression tests take their screenshots with animations disabled, so they cannot tell whether an
animation changed. The animation tests are visual regression tests of the animations: for every component of
[`animation-scenarios.ts`](./animation-scenarios.ts), they open its story and run its steps (open then close a modal,
expand then collapse a tree node...). For each step, they take frames of the animation and compare them with the
snapshots in `tests/snapshots/chromium/animations/<component>/<step>` (for instance `vertical-nav/collapse`):

- `start.png`, the page before the step,
- `0000ms.png`, `0050ms.png`, `0100ms.png`, `0150ms.png`, `0200ms.png`, `0300ms.png`, `0500ms.png`, the page 0, 50...
  milliseconds after the step,
- `end.png`, the page once every animation of the step ended,
- `animations.json`, the animations and transitions that ran, as the browser declares them (duration, delay, easing,
  keyframes), to tell what changed when a frame does.

## How the frames are taken

Real time would give different frames on every run, so the tests control time:

- Playwright's [fake clock](https://playwright.dev/docs/clock) is installed and paused once the story rendered: timers
  (`setTimeout`, animation frames...) only run when the test moves the clock,
- every animation and transition (CSS, Web Animations API, Angular animations) is paused as soon as it starts, and
  seeked to the time of the frame (see [`animation-timeline.ts`](./animation-timeline.ts)).

For a frame at 100 ms, the clock runs 100 ms and every animation is seeked to 100 ms after its start. An animation
reaching its end is finished, so that its end handlers run at the right time. Each frame is then the same on every
run.

The clicks are dispatched without moving the mouse, so that no hover transition runs. Focus rings are not drawn:
whether an element keeps the focus can depend on the order of asynchronous work (a dropdown focuses its first item
while its menu moves to the overlay container, which drops the focus).

## In pull requests

The **PR Animation Test** job of the PR Build runs the tests like the visual regression tests:

- the report is deployed to Netlify (`https://<pull request number>-animations--<storybook site>.netlify.app`), and
  the **🎬 Animation Report** comment on the pull request links to it, with ✅ when every frame matches its snapshot
  and ❌ otherwise; the report shows the expected, actual and diff images of the frames that changed,
- the new snapshots of the components that changed are offered by the **PR Visual Snapshot Update Bot**, in the same
  commit as the other snapshot changes, to cherry-pick into the pull request (the bot check fails until it is).

Pull requests from forks cannot deploy to Netlify or comment: their report is in the `animation-report` artifact.

## Running the tests locally

```bash
npm run _build:storybook
CLARITY_VRT_BROWSER=chromium CLARITY_VRT_SUITE=animations npx playwright test
```

`--update-snapshots` updates the snapshots. Without `CLARITY_VRT_SUITE=animations`, Playwright runs the Storybook
visual regression tests instead. The snapshots committed in the repository come from CI: frames rendered on another
machine can differ slightly.

## Adding a component

Add an entry to [`animation-scenarios.ts`](./animation-scenarios.ts), named after the component, with the id of a
story (from the Storybook URL) and its steps by name:

```ts
accordion: {
  story: 'accordion-accordion--default',
  steps: { expand: '.clr-accordion-header-button', collapse: '.clr-accordion-header-button' },
},
```

A step is a [Playwright selector](https://playwright.dev/docs/other-locators) (CSS, or `text=...`) to click, or story
args to set (`{ validateState: 1 }`). The steps run in order, each from the state the previous one ended in: expand
then collapse tests both animations. The name of a step is the name of its snapshots directory.
