# Grid layout

## CSS Classes

| Class name                              | Description                                                                                                                                          |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| clr-row                                 | Styles a flex row of columns                                                                                                                         |
| clr-justify-content-#{POSITION}         | Sets justify-content property to #{POSITION}, POSITION is one of 'start', 'center', 'end'                                                            |
| clr-justify-content-between             | Sets justify-content property to 'space-between'                                                                                                     |
| clr-justify-content-around              | Sets justify-content property to 'space-around'                                                                                                      |
| clr-align-items-start                   | Horizontally aligns items in a row towards the beginning                                                                                             |
| clr-align-items-center                  | Centers items horizontally in a row                                                                                                                  |
| clr-align-items-end                     | Aligns items in a row to the right end                                                                                                               |
| clr-align-items-baseline                | Aligns items in a row based on their baselines                                                                                                       |
| clr-align-items-stretch                 | Expands and evenly distributes items in a row                                                                                                        |
| clr-align-content-#{POSITION}           | Aligns content of multiline flex rows to #{POSITION}, POSITION is any of 'start', 'center', 'end'                                                    |
| clr-align-content-between               | Evenly distributes the space between the flex columns in a multiline container, leaving no space at the beginning or end of the container            |
| clr-align-content-around                | Evenly distributes the space around the flex columns in a multiline container, creating equal spacing between and around the lines                   |
| clr-align-content-stretch               | Stretches the flex columns in a multiline flex container, causing them to expand vertically and fill the available space                             |
| clr-break-row                           | Breaks the columns in a row with a new line                                                                                                          |
| clr-clearfix                            | Clears floated content within a container                                                                                                            |
| clr-no-gutters                          | Removes gaps between column content in a row                                                                                                         |
| clr-col                                 | Styles a column within a row                                                                                                                         |
| clr-col-#{SIZE}                         | Styles a column that spans to #{SIZE}/12 of the row's width, SIZE is an integer in the [1,12] interval                                               |
| clr-col-#{BREAKPOINT}                   | Styles a column within a screen with width >= than #{BREAKPOINT}, BREAKPOINT is anything among 'sm', 'md', 'lg', 'xl'                                |
| clr-col-#{BREAKPOINT}-#{SIZE}           | Styles a column that spans to SIZE/12 of the row's width for a row with width >= BREAKPOINT                                                          |
| clr-col-auto                            | Styles a column within a row to have auto width                                                                                                      |
| clr-col-#{BREAKPOINT}-auto              | Styles a column within a row to have auto width for a small, medium, large and extra large screen                                                    |
| clr-offset-#{OFFSET_SIZE}               | Sets left offset to #{OFFSET_SIZE}/12 of the row's width, OFFSET_SIZE is an integer in the [1,11] interval                                           |
| clr-offset-#{BREAKPOINT}-#{OFFSET_SIZE} | Sets the left offset of the column to #{OFFSET_SIZE}/12 for a screen larger than #{BREAKPOINT}                                                       |
| clr-order-first                         | Sets the order of the column as first                                                                                                                |
| clr-order-last                          | Sets the order of the column as last                                                                                                                 |
| clr-order-#{ORDER}                      | Sets the order of the column, ORDER is an integer in the interval [1,12]                                                                             |
| clr-order-#{BREAKPOINT}-#{ORDER}        | Sets the order of the column                                                                                                                         |
| clr-align-self-auto                     | Sets align-self property of a column to #{POSITION}, POSITION is one of 'auto', 'start', 'end', 'center', 'baseline', 'stretch'                      |
| clr-invisible                           | Sets the visibility of element to hidden                                                                                                             |
| clr-display-#{DISPLAY_VALUE}            | Sets the display property of an element to #{DISPLAY_VALUE}, DISPLAY_VALUE is one of 'block', 'inline-block', 'inline'                               |
| clr-align-#{POSITION}                   | Sets vertical-align to #{POSITION}, POSITION is one of 'baseline', 'top', 'middle', 'bottom', 'text-bottom', 'text-top'                              |
| clr-flex-#{DIRECTION}                   | Sets the flex-direction to #{DIRECTION} ('row', 'column', 'row-reverse' or 'column-reverse')                                                         |
| clr-flex-#{FLEX_WRAP_VALUE}             | Sets the flex-wrap to #{FLEX_WRAP_VALUE} ('wrap', 'nowrap', 'wrap-reverse')                                                                          |
| clr-flex-fill                           | Makes a flex item expand to fill any remaining space within a flex container, distributing the available space evenly among the flex items           |
| clr-#{FLEXIBILITY}-#{SIZE}              | Sets the flexibility (flex-grow or flex-shrink) to #{SIZE} (0 or 1)                                                                                  |
| clr-float-#{BREAKPOINT}-#{DIRECTION}    | Sets the float property to #{DIRECTION}('left', 'right' or 'none') for screens with width bigger than the #{BREAKPOINT} value for 'sm', 'md' or 'lg' |

## Screen width breakpoints

| Breakpoint | Description |
| ---------- | ----------- |
| sm         | >= 576px    |
| md         | >= 768px    |
| lg         | >= 992px    |
| xl         | >= 1200px   |
