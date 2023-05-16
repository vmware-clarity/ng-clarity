# Card - Style API

## CSS Variables

| CSS Variable Name                     | Description                                             |
| ------------------------------------- | ------------------------------------------------------- |
| --clr-card-bg-color                   | Changes the background color of the card.               |
| --clr-card-divider-color              | Changes the divider color of the card.                  |
| --clr-card-title-color                | Changes the text color of the card header.              |
| --clr-card-title-font-weight          | Changes the thickness of the card title.                |
| --clr-card-border-width               | Changes the border width of the card.                   |
| --clr-card-border-radius              | Changes the border radius of the card.                  |
| --clr-card-border-color               | Changes the border color of the card.                   |
| --clr-card-box-shadow-color           | Changes the background shadow color of the card.        |
| --clr-card-clickable-border-color     | Changes the background color of clickable cards.        |
| --clr-card-clickable-box-shadow-color | Changes the background shadow color of clickable cards. |

## Class names

| Class                                     | Description                                                                                       |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------- |
| .card                                     | A card presents high-level information and can guide the user toward related actions and details. |
| .card.clickable                           | Adding the `.clickable` class makes the entire card clickable, initiating a single action.        |
| .card .card-img                           | A `.card-img` can be placed anywhere in the card, or it can occupy the entire card.               |
| .card .card-header                        | This class styles the card's heading element.                                                     |
| .card .card-block                         | This class styles the card's main content.                                                        |
| .card-block .card-title                   | This class styles the card block's heading element.                                               |
| .card-block .card-text                    | This class styles text content within a card block.                                               |
| .card-block .list                         | This class styles a list within a card block. The list can be ordered (`ol`) or unordered (`ul`). |
| .card-block .list-unstyled                | This class styles a list with no markers within a card block.                                     |
| .card-block .list-group                   | This class styles a full-width list with dividers for each item within a card.                    |
| .list-group .list-group-item              | This class styles each item with a list group.                                                    |
| .card-block .card-divider                 | This class styles a divider within card.                                                          |
| .card .card-media-block                   | A card media block contains and image and description.                                            |
| .card .card-media-block.wrap              | Adding the `.wrap` class caused the description to be below the image instead of to the right.    |
| .card-media-block .card-media-image       | This class styles the `img` within a card media block.                                            |
| .card-media-block .card-media-description | This class styles the description within a card media block. It can contain a title and text.     |
| .card-media-description .card-media-title | This class styles the title of a card media block.                                                |
| .card-media-description .card-media-text  | This class styles the text within a card media block.                                             |
| .card .card-footer                        | The footer can contain two actions in form of a button or link. For more actions, use a dropdown. |
| .card-footer .card-link                   | This class styles an `a` element within a card footer.                                            |

# Login - Style API

## CSS Variables

| CSS Variable Name                  | Description                                 |
| ---------------------------------- | ------------------------------------------- |
| --clr-login-title-color            | Changes the text color of the title.        |
| --clr-login-title-font-weight      | Changes the font weight of the title.       |
| --clr-login-title-font-family      | Changes the font style of the title.        |
| --clr-login-background-color       | Changes the background color.               |
| --clr-login-error-background-color | Changes the error message background color. |
| --clr-login-error-border-radius    | Changes the error message border radius.    |
| --clr-login-panel-line-color       | Changes the color of the divider line.      |
| --clr-login-panel-line-opacity     | Changes the opacity to the divider line.    |

## Class names

| Class               | Description                                                                       |
| ------------------- | --------------------------------------------------------------------------------- |
| .login              | The login form is a predefined form for applications that require authentication. |
| .login-wrapper      | This class marks a `div` element that contains the `form.login` element.          |
| .login .title       | This class styles the title `section` of the login form.                          |
| .title .welcome     | This class styles the heading of the login form.                                  |
| .title .hint        | This class styles hint/helper text within the title of the login form.            |
| .login .login-group | This class marks a `div` element that contains the login form controls.           |
