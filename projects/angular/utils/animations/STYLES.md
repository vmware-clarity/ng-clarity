# Animations

## CSS Custom Properties

| CSS Custom Property | Description                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| --clr-slide-offset  | Distance covered by the `clr-slide-*` and `clr-fade-slide-*` animations (defaults to `25%`). Not inherited: set it on the animated element |

## CSS Classes

The enter / leave classes are meant for Angular's `animate.enter` and `animate.leave` bindings, but they are plain CSS animations and can be applied by any other means. Slides and height animations are skipped when the user prefers reduced motion.

| Class name                         | Description                                                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| clr-fade-enter                     | Fades an element in                                                                                          |
| clr-fade-leave                     | Fades an element out                                                                                         |
| clr-slide-`<direction>`-enter      | Slides an element in towards `up`, `down`, `left` or `right`                                                 |
| clr-slide-`<direction>`-leave      | Slides an element out, the reverse of `clr-slide-<direction>-enter`                                          |
| clr-fade-slide-`<direction>`-enter | Fades and slides an element in towards `up`, `down`, `left` or `right`                                       |
| clr-fade-slide-`<direction>`-leave | Fades and slides an element out, the reverse of `clr-fade-slide-<direction>-enter`                           |
| clr-expand-enter                   | Expands an element from a height of 0 to its natural height (Chromium browsers only, see `interpolate-size`) |
| clr-collapse-leave                 | Collapses an element from its natural height to 0 (Chromium browsers only, see `interpolate-size`)           |
| clr-collapse-hold-leave            | Keeps an element removed inside a collapsing container displayed while the container collapses               |
| fade                               | Hidden element fading in when the `in` class is added                                                        |
| fadeDown                           | Hidden element fading and sliding down in when the `in` class is added                                       |
| skeleton-loading                   | Animated skeleton placeholder of content being loaded                                                        |
