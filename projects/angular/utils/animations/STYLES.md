# Animations

## CSS Custom Properties

| CSS Custom Property | Description                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| --clr-slide-offset  | Distance covered by the `clr-slide-*` and `clr-fade-slide-*` animations (defaults to `25%`). Not inherited: set it on the animated element |

## CSS Classes

The enter / leave classes are meant for Angular's `animate.enter` and `animate.leave` bindings, but they are plain CSS animations and can be applied by any other means. Slides and height animations are skipped when the user prefers reduced motion.

| Class name                 | Description                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| clr-fade-enter             | Fades an element in                                                                                          |
| clr-fade-leave             | Fades an element out                                                                                         |
| clr-slide-up-enter         | Slides an element in upwards                                                                                 |
| clr-slide-up-leave         | Slides an element out downwards (reverse of `clr-slide-up-enter`)                                            |
| clr-slide-down-enter       | Slides an element in downwards                                                                               |
| clr-slide-down-leave       | Slides an element out upwards (reverse of `clr-slide-down-enter`)                                            |
| clr-slide-left-enter       | Slides an element in to the left                                                                             |
| clr-slide-left-leave       | Slides an element out to the right (reverse of `clr-slide-left-enter`)                                       |
| clr-slide-right-enter      | Slides an element in to the right                                                                            |
| clr-slide-right-leave      | Slides an element out to the left (reverse of `clr-slide-right-enter`)                                       |
| clr-fade-slide-up-enter    | Fades and slides an element in upwards                                                                       |
| clr-fade-slide-up-leave    | Fades and slides an element out downwards                                                                    |
| clr-fade-slide-down-enter  | Fades and slides an element in downwards                                                                     |
| clr-fade-slide-down-leave  | Fades and slides an element out upwards                                                                      |
| clr-fade-slide-left-enter  | Fades and slides an element in to the left                                                                   |
| clr-fade-slide-left-leave  | Fades and slides an element out to the right                                                                 |
| clr-fade-slide-right-enter | Fades and slides an element in to the right                                                                  |
| clr-fade-slide-right-leave | Fades and slides an element out to the left                                                                  |
| clr-expand-enter           | Expands an element from a height of 0 to its natural height (Chromium browsers only, see `interpolate-size`) |
| clr-collapse-leave         | Collapses an element from its natural height to 0 (Chromium browsers only, see `interpolate-size`)           |
| clr-expandable-animation   | Host class of `clr-expandable-animation` / `clrExpandableAnimation`                                          |
| fade                       | Hidden element fading in when the `in` class is added                                                        |
| fadeDown                   | Hidden element fading and sliding down in when the `in` class is added                                       |
| skeleton-loading           | Animated skeleton placeholder of content being loaded                                                        |
