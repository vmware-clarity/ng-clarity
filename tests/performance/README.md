# Performance tests

The performance tests measure how long the components take to react to the user, on the base and the head of a pull
request, and report the difference in a comment on the pull request.

## How it works

- [`projects/benchmarks`](../../projects/benchmarks) is a small zoneless application with one page per component. Each
  page renders its component with generated data, and buttons marked with `data-bench` for the actions to measure.
- `npm run _build:benchmarks` builds it twice with the production configuration: against the libraries of the
  repository (`dist/benchmarks/head`), and against the libraries checked out in `.benchmark-base`
  (`dist/benchmarks/base`, with `tsconfig.base-library.json`). Both builds use the same scenarios, the ones of the
  head.
- [`run.ts`](./run.ts) runs every scenario of [`scenarios.ts`](./scenarios.ts) in Chromium, 15 times on each build,
  alternating between them so that a slower period of the machine affects both alike. Each run opens the page, runs the
  setup steps, then measures the step: from the event until the frame after the last change of the DOM, so that
  rendering passes scheduled after the first one count too. It writes the samples to `dist/benchmarks/results.json`.
- [`report.ts`](./report.ts) writes `dist/benchmarks/report.md`: for each scenario, the median times, the change with
  its 95% confidence interval, and the counts of layouts, style recalculations and DOM nodes.

## Metrics

| Metric        | Source                                           | Noise                                   |
| ------------- | ------------------------------------------------ | --------------------------------------- |
| Time          | `performance.now()` in the page                  | Varies between runs: compared with a CI |
| JavaScript    | Chrome's `ScriptDuration` performance metric     | Varies between runs                     |
| Layouts       | Chrome's `LayoutCount` performance metric        | Stable for most scenarios               |
| Style recalcs | Chrome's `RecalcStyleCount` performance metric   | Stable for most scenarios               |
| DOM nodes     | Chrome's `Nodes` metric after garbage collection | Stable                                  |

The counts catch the regressions that time hides in the noise: a component that reads the layout in a loop forces one
layout per iteration, whatever the speed of the machine.

## In pull requests

The **PR Performance Test** job of the PR Build checks out the base of the pull request in `.benchmark-base`, builds
and runs the benchmarks, adds the report to the job summary and posts it as the **⏱️ Performance Report** comment.
Pull requests from forks cannot comment: their report is in the job summary.

The report does not fail the build: shared CI machines are too noisy for a time threshold to be a reliable gate.

## Running locally

```bash
git worktree add .benchmark-base next   # or any other commit to compare with
npm run _build:benchmarks
npm run test:performance
```

`node tests/performance/run.ts --filter=datagrid --samples=5` runs some of the scenarios, fewer times.

## Adding a scenario

Add a page to `projects/benchmarks/src/app` and its route to `routes.ts` if the component has none, then an entry to
`scenarios.ts`: the page, the setup steps and the measured step. A step clicks an element (`{ click: selector }`) or
types into an input (`{ type: selector, text }`).

The base is built with the scenarios of the head, so a scenario can only use the API that the base already has: add a
scenario for a new API in a pull request after the one that adds the API.
