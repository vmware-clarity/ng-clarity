# Card

## CSS Custom Properties

| CSS Custom Property                   | Description                                            |
| ------------------------------------- | ------------------------------------------------------ |
| --clr-card-bg-color                   | Card background color                                  |
| --clr-card-divider-color              | Card divider color                                     |
| --clr-card-title-color                | Card base title color                                  |
| --clr-card-title-font-weight          | Card thickness title                                   |
| --clr-card-border-width               | Card border width                                      |
| --clr-card-border-radius              | Card border radius                                     |
| --clr-card-border-color               | Card border color                                      |
| --clr-card-box-shadow-color           | Card background shadow color                           |
| --clr-card-clickable-border-color     | DEPRECATED in favor of `clr-card-box-shadow`           |
| --clr-card-clickable-box-shadow-color | DEPRECATED in favor of `clr-card-clickable-box-shadow` |
| clr-card-box-shadow                   | Card background shadow                                 |
| clr-card-clickable-box-shadow         | Clickable cards shadow                                 |
| clr-card-header-title-color           | Header title font color                                |
| clr-card-content-title-color          | Content title font color                               |
| clr-card-text-color                   | Card text font color                                   |

## CSS Classes

| Class                  | Description                                                                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| card                   | A card presents high-level information and can guide the user toward related actions and details                              |
| clickable              | Adding the `.clickable` to a card class makes the entire card clickable, initiating a single action                           |
| card-img               | A `.card-img` can be placed anywhere in the card, or it can occupy the entire card                                            |
| card-header            | The card's heading element                                                                                                    |
| card-block             | The card's main content                                                                                                       |
| card-title             | A card block's heading element                                                                                                |
| card-text              | A card block's text content                                                                                                   |
| list                   | An ordered (`ol`) or unordered (`ul`) list within a card block                                                                |
| list-unstyled          | List with no markers within a card block                                                                                      |
| list-group             | Full-width list with dividers for each item within a card block                                                               |
| list-group-item        | Item within a list group                                                                                                      |
| card-divider           | Divider within card block                                                                                                     |
| card-media-block       | A card media block contains and image and description                                                                         |
| wrap                   | Adding the `wrap` class to a `.card-media-block` element causes the description to be below the image instead of to the right |
| card-media-image       | An `img` within a card media block                                                                                            |
| card-media-description | The description within a card media block. It can contain a title and text                                                    |
| card-media-title       | The title of a card media block description                                                                                   |
| card-media-text        | Text within a card media block description                                                                                    |
| card-footer            | The footer can contain two actions in form of a button or link. For more actions, use a dropdown                              |
| card-link              | A link within a card footer                                                                                                   |

# Login

## CSS Custom Properties

| CSS Custom Property                  | Description                              |
| ------------------------------------ | ---------------------------------------- |
| --clr-login-title-color              | Color of the title                       |
| --clr-login-background-color         | Background color                         |
| --clr-login-background               | Background image                         |
| --clr-login-error-background-color   | Error message background color           |
| --clr-login-error-border-radius      | Error message border radius              |
| --clr-login-panel-line-color         | Color of the divider line                |
| --clr-login-panel-line-opacity       | Opacity to the divider line              |
| --clr-login-hint-color               | Font color of the hint                   |
| --clr-login-footer-gap               | Gap size for the footer                  |
| --clr-login-copyright-color          | Font color for the copyright thumbnail   |
| --clr-login-welcome-color            | Font color for welcome                   |
| --clr-login-error-icon-color         | Color for error icon                     |
| --clr-login-logo-color               | Color of VMware logo                     |
| --clr-login-trademark-color          | DEPRECATED in v17. to be removed in v18. |
| --clr-login-trademark-font-weight    | DEPRECATED in v17. to be removed in v18. |
| --clr-login-trademark-font-family    | DEPRECATED in v17. to be removed in v18. |
| --clr-login-trademark-font-size      | DEPRECATED in v17. to be removed in v18. |
| --clr-login-trademark-letter-spacing | DEPRECATED in v17. to be removed in v18. |

## CSS Classes

| Class         | Description                                                                      |
| ------------- | -------------------------------------------------------------------------------- |
| login         | The login form is a predefined form for applications that require authentication |
| login-body    | Wrapper for login content                                                        |
| login-header  | Wrapper for login header elements                                                |
| login-footer  | Wrapper for login footer elements                                                |
| logo          | VMware logo                                                                      |
| actions       | Wrapper for header actions                                                       |
| copyright     | Copyright label                                                                  |
| login-wrapper | Wrapper element                                                                  |
| title         | The title `section` of the login form                                            |
| welcome       | The heading of the login form                                                    |
| hint          | Hint/helper text within the title of the login form                              |
| login-group   | Contains the login form controls                                                 |
| error         | Error messageThe error message is hidden by default                              |
| active        | Adding the `active` class to the `.error` element makes the error message appear |
| trademark     | DEPRECATED in v17. To be removed in v18.                                         |
| subtitle      | DEPRECATED in v17. To be removed in v18.                                         |
