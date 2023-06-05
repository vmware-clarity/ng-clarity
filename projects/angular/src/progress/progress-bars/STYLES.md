# Progress bar

## CSS Custom Properties

| CSS Custom Property          | Description      |
| ---------------------------- | ---------------- |
| --clr-progress-default-color | Default color    |
| --clr-progress-alt-color-1   | Success color    |
| --clr-progress-alt-color-2   | Danger color     |
| --clr-progress-alt-color-3   | Warning color    |
| --clr-progress-bg-color      | Background color |

## Class names

| Class name      | Description                                                              |
| --------------- | ------------------------------------------------------------------------ |
| progress        | Main progress bar element                                                |
| progress-static | Main static progress bar element                                         |
| progress-fade   | Fade out animation for progress bar                                      |
| progress-meter  | The bar element in a static progress bar                                 |
| progress-group  | Layout element for multiple progress bars                                |
| progress-block  | Layout element for progress bar groups                                   |
| flash           | Sets the bar color to success once value of 100 is reached               |
| flash-danger    | Sets the bar color to danger once value of 100 is reached                |
| labeled         | Used with `progress` to show display value next to the bar               |
| loop            | Loop animation for non-static progress bars                              |
| danger          | Combined with `progress loop` or `progress-static` to set progress color |
| warning         | Combined with `progress loop` or `progress-static` to set progress color |
| success         | Combined with `progress loop` or `progress-static` to set progress color |
