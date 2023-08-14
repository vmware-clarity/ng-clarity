# Stack view

## CSS Custom Properties

| CSS Custom Property                                                    | Description                                                           |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| --clr-stack-view-border-radius                                         | Border radius of stack view                                           |
| --clr-stack-view-border-color                                          | Border color of stack view                                            |
| --clr-stack-view-bg-color                                              | Background color of stack view                                        |
| --clr-stack-view-color                                                 | Font color of stack view                                              |
| --clr-stack-view-stack-block-border-bottom                             | Bottom border color of stack block                                    |
| --clr-stack-view-stack-block-label-text-color                          | Font color of stack block label                                       |
| --clr-stack-view-border-box-color                                      | Last stack block element shadow color                                 |
| --clr-stack-block-changed-border-top-color                             | Changed stack block border top color                                  |
| --clr-stack-view-stack-block-label-and-content-bg-color                | Background color of stack block label and content                     |
| --clr-stack-view-stack-children-stack-block-border-bottom-color        | Bottom border color of stack block children                           |
| --clr-stack-view-stack-children-stack-block-label-and-content-bg-color | Background color of stack block children's label and content          |
| --clr-stack-view-stack-block-expanded-bg-color                         | Background color of expanded stack block label and content            |
| --clr-stack-view-stack-block-expandable-hover                          | Background color of expandable stack block label and content on hover |
| --clr-stack-view-stack-block-content-text-color                        | Font color of stack block content                                     |
| --clr-stack-view-stack-block-expanded-text-color                       | Font color of expanded stack block label and content                  |
| --clr-stack-view-stack-block-caret-color                               | Color of stack block caret                                            |
| --clr-stack-view-title-color                                           | Stack view title color                                                |
| --clr-stack-view-stack-block-expandable-bg-hover                       | Stack view stack block expandable background color                    |
| --clr-stack-view-stack-block-expandable-active                         | Stack view stack block expandable active (opened) color               |
| --clr-stack-view-stack-block-expandable-bg-active                      | Stack view stack-block expandable active background color             |
| --clr-stack-view-border-width                                          | Stack view border width                                               |
| --clr-stack-view-stack-block-label-padding                             | Stack view stack block label padding                                  |
| --clr-stack-view-key-margin                                            | Stack view key block margin                                           |
| --clr-stack-view-border-radius                                         | Stack view border radius                                              |
| --clr-stack-view-stack-block-caret-dimension                           | Stack view stack block caret dimension                                |
| --clr-stack-view-stack-children-block-label-padding-left               | Stack view stack children block label padding                         |
| --clr-stack-view-stack-title-padding                                   | Stack view stack title padding                                        |

## CSS Classes

| Class name             | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| stack-view             | Main stack view element                              |
| stack-header           | Main stack header element                            |
| stack-title            | Stack view header title                              |
| stack-actions          | Wrapper for stack view header actions                |
| stack-action           | Main header stack action class                       |
| stack-block            | Main stack block element                             |
| stack-block-changed    | Marks a stack block as changed                       |
| stack-block-label      | Wrapper for stack block label and content            |
| stack-view-key         | Stack block view key element                         |
| stack-block-content    | Stack block content element                          |
| stack-block-caret      | Stack block caret icon element                       |
| stack-children         | Wrapper for stack block child blocks                 |
| stack-block-expandable | Used with `stack-block` to add expandable caret icon |
| stack-block-expanded   | Stack block caret icon in expanded state             |
