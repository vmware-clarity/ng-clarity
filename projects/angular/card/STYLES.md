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

| Class                      | Description                                                                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| card                       | A card presents high-level information and can guide the user toward related actions and details                                               |
| clickable                  | Adding the `.clickable` to a card class makes the entire card clickable, initiating a single action                                            |
| card-img                   | A `.card-img` can be placed anywhere in the card, or it can occupy the entire card                                                             |
| card-header                | The card's heading element                                                                                                                     |
| card-block                 | The card's main content                                                                                                                        |
| card-title                 | A card block's heading element                                                                                                                 |
| card-text                  | A card block's text content                                                                                                                    |
| list                       | An ordered (`ol`) or unordered (`ul`) list within a card block                                                                                 |
| list-unstyled              | List with no markers within a card block                                                                                                       |
| list-group                 | Full-width list with dividers for each item within a card block                                                                                |
| list-group-item            | Item within a list group                                                                                                                       |
| card-divider               | Divider within card block                                                                                                                      |
| card-media-block           | A card media block contains and image and description                                                                                          |
| wrap                       | Adding the `wrap` class to a `.card-media-block` element causes the description to be below the image instead of to the right                  |
| card-media-image           | An `img` within a card media block                                                                                                             |
| card-media-description     | The description within a card media block. It can contain a title and text                                                                     |
| card-media-title           | The title of a card media block description                                                                                                    |
| card-media-text            | Text within a card media block description                                                                                                     |
| card-footer                | The footer can contain two actions in form of a button or link. For more actions, use a dropdown                                               |
| card-link                  | A link within a card footer                                                                                                                    |
| card-collapsible           | Adding `.card-collapsible` to a `.card` enables the chevron toggle and CSS-only collapse/expand transition                                     |
| card-collapsed             | Adding `.card-collapsed` to a `.card.card-collapsible` collapses its content                                                                   |
| card-header-toggle         | The chevron toggle button rendered inside `.card-header` when the card is collapsible                                                          |
| card-header-icon           | The chevron icon within `.card-header-toggle`, rotated via its `aria-expanded` attribute                                                       |
| card-collapsible-content   | Wraps a collapsible card's content; animates between `1fr`/`0fr` via CSS grid when `.card-collapsed` is toggled                                |
| card-collapsible-inner     | The inner wrapper of `.card-collapsible-content` that clips its content during the transition                                                  |
| clr-card                   | Host class on the `<clr-card>` Angular component, alongside `card`                                                                             |
| clr-card-header            | Host class on the `<clr-card-header>` Angular component, alongside `card-header`                                                               |
| clr-card-header-content    | Wraps the projected content of `<clr-card-header>`, excluding the toggle button, so accessible names and heading roles refer only to the title |
| clr-card-body              | Host class on the `<clr-card-body>` Angular component, alongside `card-block`                                                                  |
| clr-card-body-title        | Host class on the `<clr-card-body-title>` Angular component, alongside `card-title`                                                            |
| clr-card-body-text         | Host class on the `<clr-card-body-text>` Angular component, alongside `card-text`                                                              |
| clr-card-footer            | Host class on the `<clr-card-footer>` Angular component, alongside `card-footer`                                                               |
| clr-card-image             | Host class on the `<clr-card-image>` Angular component, alongside `card-img`                                                                   |
| clr-card-divider           | Host class on the `<clr-card-divider>` Angular component, alongside `card-divider`                                                             |
| clr-card-media-block       | Host class on the `<clr-card-media-block>` Angular component, alongside `card-media-block`                                                     |
| clr-card-media-description | Host class on the `<clr-card-media-description>` Angular component, alongside `card-media-description`                                         |
| clr-card-media-image       | Applied by the `clrCardMediaImage` directive, alongside `card-media-image`                                                                     |
| clr-card-media-title       | Applied by the `clrCardMediaTitle` directive, alongside `card-media-title`                                                                     |
| clr-card-media-text        | Applied by the `clrCardMediaText` directive, alongside `card-media-text`                                                                       |
