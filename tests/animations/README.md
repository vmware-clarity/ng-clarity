# Animation recordings

The visual regression tests take their screenshots with animations disabled, so they cannot tell whether an
animation changed. The animation recordings work like them for animations: a recording of every scenario is committed
in [`recordings`](./recordings), and pull requests that change how a component animates update the recordings.

For every scenario of [`animation-scenarios.ts`](./animation-scenarios.ts) (open / close a modal, expand / collapse an
accordion panel, a tree node, a datagrid row...), the recorder opens the Storybook story, triggers the animation and
records, from the trigger:

- the **rendered frames**, with Playwright's [screencast](https://playwright.dev/docs/api/class-screencast): every
  frame the browser paints (about 60 per second), with its timestamp,
- a **video** of the same time span (`video.webm`, from the screencast as well),
- the **geometry, opacity and transform** of the tracked elements, sampled on every animation frame,
- the **animations and transitions** that ran (CSS animations and transitions, Web Animations API, Angular
  animations) with their duration, delay, easing and keyframes.

The report plays the frames rather than the videos: a video is encoded at a fixed frame rate, which leaves 5 frames to
a 200 ms animation, and cannot be lined up with another recording to the millisecond. The
[test videos](https://playwright.dev/docs/videos) are only kept for the scenarios that fail, to see why.

Nothing is slowed down or paused while recording: the page runs its animations like it does for users. Slow motion is
only applied when playing the recordings back in the report.

## In pull requests

The **PR Animation Recordings** job of the PR Build records the animations of the pull request and compares them with
the committed recordings, like the visual regression tests do with the screenshots:

- when a scenario animates differently, its new recording (`recording.json`, the frames and `video.webm`) is offered by
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

- **same**: the tracked elements start from and end in the same state, are animated (or not) in both versions, end
  their animations within 40 ms of each other and follow similar easing curves,
- **changed**: an element is animated in one version and changes at once in the other, its animation ends more than
  40 ms earlier or later, or its progress curve is more than 12% away from the other version's (different easing;
  a start up to 10 ms apart, less than a frame, is tolerated),
- **differs**: an element starts from or ends in a different state (size, position, opacity, rendered or not).

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
