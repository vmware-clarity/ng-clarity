# Animation recordings

The visual regression tests take their screenshots with animations disabled, so they cannot tell whether an
animation changed. These recordings show how the components animate, and compare two versions of the library (for
example `main` and a branch that changes animations).

For every scenario of [`animation-scenarios.ts`](./animation-scenarios.ts) (open / close a modal, expand / collapse an
accordion panel, a tree node, a datagrid row...), the recorder opens the Storybook story, triggers the animation and
records, from the trigger:

- the **rendered frames**, with the Chrome DevTools screencast (about 60 frames per second),
- the **geometry, opacity and transform** of the tracked elements, sampled on every animation frame,
- the **animations and transitions** that ran (CSS animations and transitions, Web Animations API, Angular
  animations) with their duration, delay, easing and keyframes,
- a **video** of the whole test (Playwright video).

Nothing is slowed down or paused while recording: the page runs its animations like it does for users. Slow motion is
only applied when playing the recordings back in the report.

## Comparing two versions locally

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
stay where they are).

The recorder runs from the current checkout, so the scenarios can be recorded for any Storybook build: point
`CLARITY_STORYBOOK_DIR` to another build (for example a second git worktree) to record it without switching branches.

| Environment variable       | Default            | Description                                  |
| -------------------------- | ------------------ | -------------------------------------------- |
| `CLARITY_ANIMATIONS_LABEL` | current git branch | Name of the recording (its output directory) |
| `CLARITY_STORYBOOK_DIR`    | `./dist/docs`      | Storybook build to record                    |
| `CLARITY_STORYBOOK_PORT`   | `8080`             | Port the Storybook build is served on        |

## Comparing in CI

Run the **Animation Recordings** workflow from the Actions tab with the two git refs to compare, or add the
`animation-recordings` label to a pull request to compare it with its base branch. The job summary lists the
differences; the `animation-report` artifact contains the report (`base-vs-head.html`) and the recordings.

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
