# Animation recordings

The visual regression tests take their screenshots with animations disabled, so they cannot tell whether an
animation changed. The animation recordings work like them for animations: a recording of every scenario is committed
in [`recordings`](./recordings), and pull requests that change how a component animates update the recordings.

For every scenario of [`animation-scenarios.ts`](./animation-scenarios.ts) (open / close a modal, expand / collapse an
accordion panel, a tree node, a datagrid row...), the recorder opens the Storybook story, triggers the animation and
records, from the trigger:

- a **video** (`video.webm`) at 60 frames per second: every frame the browser paints is captured with Playwright's
  [screencast](https://playwright.dev/docs/api/class-screencast), with its timestamp, and encoded so that the video
  frame at a time shows the page at that time (from 100 ms before the trigger),
- the **geometry, opacity and transform** of the tracked elements, sampled on every animation frame,
- the **animations and transitions** that ran (CSS animations and transitions, Web Animations API, Angular
  animations) with their duration, delay, easing and keyframes.

A recording is `recording.json` (the measurements) and `video.webm`. The report shows any frame of the videos by
seeking in them. Playwright's own [test videos](https://playwright.dev/docs/videos) are recorded at 25 frames per
second, which leaves 5 frames to a 200 ms animation: they are only kept for the scenarios that fail, to see why. The
videos are encoded with the ffmpeg build Playwright uses for its videos (`npx playwright install ffmpeg`; set
`CLARITY_FFMPEG` to use another ffmpeg).

Nothing is slowed down or paused while recording: the page runs its animations like it does for users. Slow motion is
only applied when playing the recordings back in the report.

## In pull requests

The **PR Animation Recordings** job of the PR Build records the animations of the pull request and compares them with
the committed recordings, like the visual regression tests do with the screenshots:

- when a scenario animates differently, its new recording (`recording.json` and `video.webm`) is offered by
  the **PR Visual Snapshot Update Bot**, in the same commit as the screenshot changes, to cherry-pick into the pull
  request (like for the screenshots, the bot check fails until it is); the bot comment links to the animation report,
- the job summary lists the scenarios that changed and how,
- the `animation-report` artifact contains the report (`baseline-vs-current.html`) and the recordings: unzip it and
  open the report to watch them side by side.

A scenario that still animates the same keeps its committed recording: small timing differences between runs do not
produce changes.

## Updating the recordings locally

```bash
npm run _build:storybook
npm run animations:update
```

This records the scenarios, compares them with the committed recordings, updates the recordings that changed in
`tests/animations/recordings` and writes the report to `dist/animation-recordings/baseline-vs-current.html`. Playwright
options are passed on, for example `npm run animations:update -- -g modal` (removed scenarios are only cleaned up by a
full run). The recordings committed in the repository come from CI; recordings made on another machine can differ
slightly.

## Comparing any two versions

Record each version from its own Storybook build, then compare the recordings:

```bash
# 1. Baseline
git checkout main
npm run _build:storybook
CLARITY_ANIMATIONS_LABEL=main npm run animations:record

# 2. Version to compare
git checkout my-branch
npm run _build:storybook
CLARITY_ANIMATIONS_LABEL=my-branch npm run animations:record

# 3. Report
npm run animations:compare -- main my-branch
```

Then open `dist/animation-recordings/main-vs-my-branch.html` in a browser (the recording directories next to it must
stay where they are). Point `CLARITY_STORYBOOK_DIR` to another build (for example in a second git worktree) to record
it without switching branches.

| Environment variable       | Default            | Description                                  |
| -------------------------- | ------------------ | -------------------------------------------- |
| `CLARITY_ANIMATIONS_LABEL` | current git branch | Name of the recording (its output directory) |
| `CLARITY_STORYBOOK_DIR`    | `./dist/docs`      | Storybook build to record                    |
| `CLARITY_STORYBOOK_PORT`   | `8080`             | Port the Storybook build is served on        |

## Reading the report

Each scenario gets a verdict:

- **same**: the tracked elements start from and end in the same state, are animated (or not) in both versions and
  end their animations within 40 ms of each other, and the same animations run with the same timing,
- **changed**: an element is animated in one version and changes at once in the other, its animation ends more than
  40 ms earlier or later, or the animations that run differ: another duration or delay (more than 10 ms apart), another
  easing, other animated properties, an animation added or removed,
- **differs**: an element starts from or ends in a different state (size, position, opacity, rendered or not).

The timing of the animations is compared as the browser declares it, not measured from the frames: measured
progress curves vary by a frame or two from run to run, which is as much as a change of easing.
The thresholds are in [`compare-animation-recordings.js`](../../scripts/compare-animation-recordings.js). The verdicts
point at what to look at; the recordings are what to judge.

The two recordings play side by side on a shared timeline (0 is the trigger), at 1× down to 0.1× speed or frame by
frame; **Focus** zooms on the tracked elements. The charts overlay each measured property of both versions, and the
details list every animation that ran with its keyframes.

## Adding a scenario

Add an entry to [`animation-scenarios.ts`](./animation-scenarios.ts) with the story id (from the Storybook URL), the
steps bringing the story to the state to animate from (`setup`), the steps triggering the animation (`trigger`: click,
fill, or update the story args) and the elements to track. Record the opening and the closing of a component as two
scenarios.
