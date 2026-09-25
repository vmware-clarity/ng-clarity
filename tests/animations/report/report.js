/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* global ANIMATION_REPORT */

(function () {
  'use strict';

  const report = ANIMATION_REPORT;
  const LEAD_TIME = 100; // frames recorded before the trigger
  const VIEWPORT = { width: 1280, height: 800 };
  const PROPERTIES = ['height', 'width', 'y', 'x', 'opacity', 'translateX', 'translateY', 'scale'];
  const SPEEDS = [1, 0.5, 0.25, 0.1];
  const root = document.getElementById('report');

  root.append(
    el('h1', {}, 'Animation recordings'),
    el('div', { class: 'subtitle' }, [
      el('strong', {}, report.base),
      ' (dashed) vs ',
      el('strong', {}, report.head),
      ` (solid), generated ${new Date(report.generatedAt).toLocaleString()}`,
    ]),
    el('div', { class: 'legend' }, [
      el('span', {}, [el('span', { class: 'swatch base' }), report.base]),
      el('span', {}, [el('span', { class: 'swatch' }), report.head]),
      el(
        'span',
        {},
        'Frames are the rendered page (Playwright screencast, every painted frame); charts are sampled on every animation frame. ' +
          'Time 0 is the trigger. Nothing is slowed down while recording: slow motion is applied on playback only.'
      ),
    ]),
    renderSummary(),
    ...report.scenarios.map(renderScenario)
  );

  function renderSummary() {
    const rows = report.scenarios.map(scenario =>
      el('tr', { 'data-verdict': scenario.verdict }, [
        el('td', {}, el('a', { href: `#${scenario.name}` }, scenario.name)),
        el('td', {}, chip(scenario.verdict)),
        el(
          'td',
          {},
          scenario.notes.length ? scenario.notes.join('; ') : el('span', { class: 'muted' }, 'no measurable difference')
        ),
      ])
    );
    const counts = count(report.scenarios.map(scenario => scenario.verdict));
    const filters = ['all', 'differs', 'changed', 'same'].map(verdict =>
      el(
        'button',
        {
          type: 'button',
          'aria-pressed': String(verdict === 'all'),
          onclick: event => {
            filters.forEach(button => button.setAttribute('aria-pressed', String(button === event.currentTarget)));
            document.querySelectorAll('[data-verdict]').forEach(element => {
              element.hidden = verdict !== 'all' && element.dataset.verdict !== verdict;
            });
          },
        },
        `${verdict} (${verdict === 'all' ? report.scenarios.length : counts[verdict] || 0})`
      )
    );
    return el('section', { class: 'card' }, [
      el('div', { class: 'filters' }, filters),
      el('div', { class: 'table-scroll' }, [
        el('table', {}, [
          el(
            'thead',
            {},
            el('tr', {}, [el('th', {}, 'Scenario'), el('th', {}, 'Verdict'), el('th', {}, 'Differences')])
          ),
          el('tbody', {}, rows),
        ]),
      ]),
    ]);
  }

  function renderScenario(scenario) {
    const runs = [scenario.runs.base, scenario.runs.head];
    const range = { from: -LEAD_TIME, to: scenario.duration };
    const focus = focusArea(scenario);
    let time = range.from;
    let speed = 0.25;
    let playing = false;
    let focused = false;
    let lastFrameTime = null;

    const players = runs.map(run => {
      const image = el('img', { alt: `${run.label} at the current time`, loading: 'lazy' });
      const viewport = el('div', { class: 'viewport' }, image);
      return {
        run,
        image,
        viewport,
        element: el('figure', { class: 'player' }, [
          el('figcaption', {}, [
            el('strong', {}, run.label),
            run.video ? [' · ', el('a', { href: run.video }, 'video (webm)')] : [],
          ]),
          viewport,
        ]),
      };
    });

    const slider = el('input', {
      type: 'range',
      min: range.from,
      max: range.to,
      step: 1,
      value: range.from,
      'aria-label': 'Time',
      oninput: () => {
        pause();
        setTime(Number(slider.value));
      },
    });
    const timeLabel = el('span', { class: 'time' });
    const playButton = el('button', { type: 'button', onclick: () => (playing ? pause() : play()) }, 'Play');
    const speedSelect = el(
      'select',
      { 'aria-label': 'Playback speed', onchange: () => (speed = Number(speedSelect.value)) },
      SPEEDS.map(value => el('option', { value, selected: value === speed }, `${value}×`))
    );
    const stepButton = delta =>
      el(
        'button',
        {
          type: 'button',
          title: delta < 0 ? 'Previous frame' : 'Next frame',
          onclick: () => {
            pause();
            setTime(nextFrameTime(runs, time, delta));
          },
        },
        delta < 0 ? '◀' : '▶'
      );
    const focusButton = el(
      'button',
      {
        type: 'button',
        'aria-pressed': 'false',
        title: 'Zoom on the tracked elements',
        onclick: () => {
          focused = !focused;
          focusButton.setAttribute('aria-pressed', String(focused));
          focusButton.textContent = focused ? 'Full page' : 'Focus';
          layout();
        },
      },
      'Focus'
    );

    const charts = renderCharts(scenario, range);
    const section = el('section', { class: 'card', id: scenario.name, 'data-verdict': scenario.verdict }, [
      el('div', { class: 'scenario-header' }, [
        el('h2', {}, scenario.name),
        chip(scenario.verdict),
        el('code', { class: 'muted' }, scenario.story),
      ]),
      scenario.notes.length
        ? el(
            'ul',
            { class: 'notes' },
            scenario.notes.map(note => el('li', {}, note))
          )
        : [],
      el(
        'div',
        { class: 'players' },
        players.map(player => player.element)
      ),
      el('div', { class: 'controls' }, [
        playButton,
        speedSelect,
        stepButton(-1),
        stepButton(1),
        slider,
        timeLabel,
        focusButton,
      ]),
      charts.element,
      renderAnimations(runs),
    ]);

    layout();
    setTime(range.from);
    new ResizeObserver(layout).observe(players[0].viewport);
    return section;

    function layout() {
      const area = focused ? focus : { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height };
      for (const player of players) {
        const width = player.viewport.clientWidth || 600;
        const scale = width / area.width;
        player.viewport.style.height = `${Math.round(area.height * scale)}px`;
        player.image.style.width = `${VIEWPORT.width}px`;
        player.image.style.transform = `scale(${scale}) translate(${-area.x}px, ${-area.y}px)`;
      }
    }

    function setTime(value) {
      time = Math.min(range.to, Math.max(range.from, value));
      slider.value = String(Math.round(time));
      timeLabel.textContent = `${Math.round(time)} ms`;
      for (const player of players) {
        const frame = frameAt(player.run.frames, time);
        if (frame && player.image.getAttribute('src') !== frame.src) {
          player.image.setAttribute('src', frame.src);
        }
      }
      charts.setTime(time);
    }

    function play() {
      playing = true;
      playButton.textContent = 'Pause';
      if (time >= range.to) {
        setTime(range.from);
      }
      lastFrameTime = null;
      requestAnimationFrame(tick);
    }

    function pause() {
      playing = false;
      playButton.textContent = 'Play';
    }

    function tick(now) {
      if (!playing) {
        return;
      }
      if (lastFrameTime !== null) {
        setTime(time + (now - lastFrameTime) * speed);
      }
      lastFrameTime = now;
      if (time >= range.to) {
        pause();
        return;
      }
      requestAnimationFrame(tick);
    }
  }

  /** Charts of the properties that change in either run, per tracked element. */
  function renderCharts(scenario, range) {
    const charts = [];
    for (const element of scenario.elements) {
      for (const property of PROPERTIES) {
        const series = [scenario.runs.base, scenario.runs.head].map(run =>
          run.samples.map(sample => ({ t: sample.t, value: sample.values[element.label]?.[property] ?? null }))
        );
        const values = series.flat().filter(point => point.value !== null);
        if (!values.length || !changes(series, property)) {
          continue;
        }
        charts.push(renderChart(`${element.label} · ${property}`, series, range));
      }
    }
    return {
      element: charts.length
        ? el(
            'div',
            { class: 'charts' },
            charts.map(chart => chart.element)
          )
        : el('p', { class: 'muted' }, 'None of the tracked elements changes.'),
      setTime: time => charts.forEach(chart => chart.setTime(time)),
    };
  }

  /**
   * Whether the property takes different values in either run, beyond sub-pixel jitter (appearing / disappearing is
   * not charted). Same tolerances as the comparison script.
   */
  function changes(series, property) {
    const tolerance = property === 'opacity' || property === 'scale' ? 0.01 : 1;
    return series.some(points => {
      const values = points.filter(point => point.value !== null).map(point => point.value);
      return values.length && Math.max(...values) - Math.min(...values) > tolerance;
    });
  }

  function renderChart(title, series, range) {
    const width = 300;
    const height = 110;
    const pad = { left: 34, right: 6, top: 6, bottom: 16 };
    const values = series.flat().filter(point => point.value !== null);
    let min = Math.min(...values.map(point => point.value));
    let max = Math.max(...values.map(point => point.value));
    if (min === max) {
      min -= 1;
      max += 1;
    }
    const x = t => pad.left + ((t - range.from) / (range.to - range.from)) * (width - pad.left - pad.right);
    const y = value => pad.top + (1 - (value - min) / (max - min)) * (height - pad.top - pad.bottom);

    const svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': title });
    for (const value of [min, max]) {
      svg.append(
        svgEl('line', { class: 'grid', x1: pad.left, x2: width - pad.right, y1: y(value), y2: y(value) }),
        svgEl('text', { class: 'axis', x: pad.left - 4, y: y(value) + 3, 'text-anchor': 'end' }, format(value))
      );
    }
    for (let t = 0; t <= range.to; t += range.to > 1000 ? 500 : 200) {
      svg.append(svgEl('text', { class: 'axis', x: x(t), y: height - 3, 'text-anchor': 'middle' }, `${t}`));
    }
    ['base', 'head'].forEach((name, i) => {
      for (const segment of segments(series[i])) {
        svg.append(
          svgEl('polyline', {
            class: name,
            points: segment.map(point => `${x(point.t).toFixed(1)},${y(point.value).toFixed(1)}`).join(' '),
          })
        );
      }
    });
    const cursor = svgEl('line', { class: 'cursor', y1: pad.top, y2: height - pad.bottom });
    svg.append(cursor);

    return {
      element: el('div', { class: 'chart' }, [el('div', { class: 'chart-title' }, title), svg]),
      setTime(time) {
        cursor.setAttribute('x1', x(time));
        cursor.setAttribute('x2', x(time));
      },
    };
  }

  /** Splits a series where the element is not rendered. */
  function segments(points) {
    const result = [];
    let current = [];
    for (const point of points) {
      if (point.value === null) {
        if (current.length) {
          result.push(current);
        }
        current = [];
      } else {
        current.push(point);
      }
    }
    if (current.length) {
      result.push(current);
    }
    return result;
  }

  function renderAnimations(runs) {
    return el('details', {}, [
      el('summary', {}, 'Animations and transitions that ran'),
      el(
        'div',
        { class: 'animations' },
        runs.map(run =>
          el('div', { class: 'table-scroll' }, [
            el('strong', {}, run.label),
            run.animations.length
              ? el('table', {}, [
                  el(
                    'thead',
                    {},
                    el(
                      'tr',
                      {},
                      ['Start', 'Element', 'Kind', 'Name', 'Timing', 'Keyframes'].map(label => el('th', {}, label))
                    )
                  ),
                  el(
                    'tbody',
                    {},
                    run.animations.map(animation =>
                      el('tr', {}, [
                        el('td', {}, `${animation.t} ms`),
                        el('td', {}, el('code', {}, animation.target)),
                        el('td', {}, animation.kind),
                        el('td', {}, animation.name || '—'),
                        el('td', {}, timing(animation)),
                        el('td', {}, el('code', {}, keyframes(animation.keyframes))),
                      ])
                    )
                  ),
                ])
              : el('p', { class: 'muted' }, 'None'),
          ])
        )
      ),
    ]);
  }

  function timing(animation) {
    const parts = [`${format(Number(animation.duration))} ms`];
    if (animation.delay) {
      parts.push(`delay ${format(animation.delay)} ms`);
    }
    if (animation.easing && animation.easing !== 'linear') {
      parts.push(animation.easing);
    }
    if (animation.iterations === null) {
      parts.push('infinite');
    }
    return parts.join(', ');
  }

  function keyframes(frames) {
    return frames
      .map(frame => {
        const { offset, ...properties } = frame;
        const values = Object.entries(properties)
          .map(([property, value]) => `${property}: ${value}`)
          .join('; ');
        return `${offset}: ${values || '(computed)'}`;
      })
      .join('  →  ');
  }

  /** Union of the tracked elements' boxes over both runs, with a margin: where the animations happen. */
  function focusArea(scenario) {
    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;
    for (const run of [scenario.runs.base, scenario.runs.head]) {
      for (const sample of run.samples) {
        for (const value of Object.values(sample.values)) {
          if (value && value.width > 0 && value.height > 0) {
            left = Math.min(left, value.x);
            top = Math.min(top, value.y);
            right = Math.max(right, value.x + value.width);
            bottom = Math.max(bottom, value.y + value.height);
          }
        }
      }
    }
    if (left === Infinity) {
      return { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height };
    }
    const margin = 40;
    const x = Math.max(0, left - margin);
    const y = Math.max(0, top - margin);
    return {
      x,
      y,
      width: Math.min(VIEWPORT.width, right + margin) - x,
      height: Math.min(VIEWPORT.height, bottom + margin) - y,
    };
  }

  function frameAt(frames, time) {
    let low = 0;
    let high = frames.length - 1;
    let found = frames[0];
    while (low <= high) {
      const middle = (low + high) >> 1;
      if (frames[middle].t <= time) {
        found = frames[middle];
        low = middle + 1;
      } else {
        high = middle - 1;
      }
    }
    return found;
  }

  function nextFrameTime(runs, time, direction) {
    const times = runs.flatMap(run => run.frames.map(frame => frame.t));
    const candidates = direction > 0 ? times.filter(t => t > time) : times.filter(t => t < time);
    if (!candidates.length) {
      return time;
    }
    return direction > 0 ? Math.min(...candidates) : Math.max(...candidates);
  }

  function chip(verdict) {
    return el('span', { class: `chip ${verdict}` }, verdict);
  }

  function count(values) {
    return values.reduce((counts, value) => ({ ...counts, [value]: (counts[value] || 0) + 1 }), {});
  }

  function format(value) {
    return String(Math.round(value * 100) / 100);
  }

  function el(tag, attributes, children) {
    const element = document.createElement(tag);
    setAttributes(element, attributes);
    append(element, children);
    return element;
  }

  function svgEl(tag, attributes, children) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    setAttributes(element, attributes);
    append(element, children);
    return element;
  }

  function setAttributes(element, attributes) {
    for (const [name, value] of Object.entries(attributes || {})) {
      if (name.startsWith('on')) {
        element.addEventListener(name.slice(2), value);
      } else if (value === true) {
        element.setAttribute(name, '');
      } else if (value !== false && value !== null && value !== undefined) {
        element.setAttribute(name, String(value));
      }
    }
  }

  function append(element, children) {
    for (const child of [children].flat(Infinity)) {
      if (child !== null && child !== undefined && child !== false) {
        element.append(child instanceof Node ? child : String(child));
      }
    }
  }
})();
