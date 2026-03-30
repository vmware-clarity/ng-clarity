# Stack view

## CSS Custom Properties

| CSS Custom Property                           | Description                                                 |
| --------------------------------------------- | ----------------------------------------------------------- |
| --clr-stack-view-border-width                 | Stack view border width                                     |
| --clr-stack-view-border-radius                | Border radius of stack view                                 |
| --clr-stack-view-border-color                 | Border color of stack view                                  |
| --clr-stack-block-changed-border-top-color    | Changed stack block border top color                        |
| --clr-stack-view-title-color                  | Stack view title color                                      |
| --clr-stack-view-row-color                    | Text and caret color of not expandable stack view row       |
| --clr-stack-view-row-bg-color                 | Background color of not expandable stack view row           |
| --clr-stack-view-expandable-row-color         | Text and caret color of expandable stack view row           |
| --clr-stack-view-expandable-row-bg-color      | Background color of expandable stack view row               |
| --clr-stack-view-expandable-row-hover         | Text and caret `:hover` color of expandable stack view row  |
| --clr-stack-view-expandable-row-bg-hover      | Background `:hover` color of expandable stack view row      |
| --clr-stack-view-expandable-row-active        | Text and caret` :active` color of expandable stack view row |
| --clr-stack-view-expandable-row-bg-active     | Background `:active` color of expandable stack view row     |
| --clr-stack-view-expanded-row-color           | Text and caret color of expanded stack view row             |
| --clr-stack-view-expanded-row-bg-color        | Background color of expanded stack view row                 |
| --clr-stack-view-expanded-row-bg-color-hover  | Background color of hover on expanded stack view row        |
| --clr-stack-view-expanded-row-bg-color-active | Background color of active on expanded stack view row       |
| --clr-stack-view-row-font-size                | Font size for stack view row                                |
| --clr-stack-view-row-font-weight              | Font weight for stack view row                              |
| --clr-stack-view-row-line-height              | Line height for stack view row                              |
| --clr-stack-view-row-letter-spacing           | Letter spacing for stack view row                           |

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
