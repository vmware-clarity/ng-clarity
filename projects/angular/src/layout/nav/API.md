# Header nav - Style API

## CSS Variables

| CSS Variable Name              | Description                                                   |
| ------------------------------ | ------------------------------------------------------------- |
| --clr-link-active-color        | Changes the text color when the link is active.               |
| --clr-link-color               | Changes the link text color.                                  |
| --clr-link-hover-color         | Changes the text color when user hovers over element.         |
| --clr-link-visited-color       | Changes the text color for the visited links.                 |
| --clr-custom-links-hover-color | Changes the hover color of custom links in the header         |
| --clr-header-font-color        | Changes the font color for text within the header.            |
| --clr-header-nav-opacity       | Changes the opacity of links and buttons within the header.   |
| --clr-header-bg-color          | Changes the header background color.                          |
| --clr-header-1-bg-color        | Changes the header background color (default dark grey).      |
| --clr-header-2-bg-color        | Changes the header background color (default blue grey).      |
| --clr-header-3-bg-color        | Changes the header background color (default purple).         |
| --clr-header-4-bg-color        | Changes the header background color (default light blue).     |
| --clr-header-5-bg-color        | Changes the header background color (default medium blue).    |
| --clr-header-6-bg-color        | Changes the header background color (default dark blue).      |
| --clr-header-7-bg-color        | Changes the header background color (default dark blue grey). |
| --clr-header-8-bg-color        | Changes the header background color (default black).          |

## Class names

| Class name        | Description                                                                             |
| ----------------- | --------------------------------------------------------------------------------------- |
| main-container    | Wrapping class for header navigation component                                          |
| content-container | Wrapping class for container for the content of the page.                               |
| content-area      | Class for the content area within the content container.                                |
| header            | Wrapping class for the header element around branding, navigation, search and settings. |
| branding          | Class for the logo or title in the top left of the header.                              |
| header-nav        | Wrapping class for the navigation links.                                                |
| header-actions    | Wrapping class for secondary navigation links.                                          |
| title             | Wrapping class for text in the upper left.                                              |
| nav-icon          | Styles the icon with a nav-link with proper icon styles.                                |
| nav-icon-text     | Used in conjunction with a nav-icon when text and icon are used together.               |
| nav-item          | Wrapping class for a navigation item.                                                   |
| nav-link          | Used for navigation links within the header.                                            |
| nav-text          | Styles the text within a nav-link with proper text styles.                              |
| header-1          | Modifier class to change the header color and styles (dark grey).                       |
| header-2          | Modifier class to change the header color and styles (blue grey).                       |
| header-3          | Modifier class to change the header color and styles (purple).                          |
| header-4          | Modifier class to change the header color and styles (light blue).                      |
| header-5          | Modifier class to change the header color and styles (medium blue).                     |
| header-6          | Modifier class to change the header color and styles (dark blue).                       |
| header-7          | Modifier class to change the header color and styles (dark blue grey).                  |
| header-8          | Modifier class to change the header color and styles (black).                           |
| search            | Class for the form used for search (contains search icon and input)                     |
| search-box        | It contains links to navigate other pages might be marked.                              |
| settings          | Used for the settings/gear icon dropdown menu trigger.                                  |

# Responsive header nav - Style API

## CSS Variables

| CSS Variable Name                             | Description                                                          |
| --------------------------------------------- | -------------------------------------------------------------------- |
| --clr-sliding-panel-text-color                | Changes the text color of left side nav panel.                       |
| --clr-nav-background-color                    | Changes the background color of the left nav section.                |
| --clr-responsive-nav-hover-bg                 | Changes the background color when user hovers over nav element.      |
| --clr-responsive-nav-trigger-bg-color         | Changes the color of the hamburger menu's horizontal lines.          |
| --clr-responsive-nav-trigger-border-radius    | Changes the border radius of horizontal hamburger menu.              |
| --clr-responsive-nav-hamburger-border-radius  | Changes the border radius of hamburger menu.                         |
| --clr-responsive-nav-overflow-border-radius   | Changes the border radius of close icon when overflow.               |
| --clr-responsive-nav-header-backdrop-bg-color | Changes the background color of backdrop header when expanded panel. |
| --clr-responsive-nav-header-backdrop-opacity  | Changes the backdrop opacity (z-index) when expanded panel.          |

## Class names

| Class name               | Description                                                                 |
| ------------------------ | --------------------------------------------------------------------------- |
| clr-nav-close            | Class used for the close button of the left/right drawers in a mobile view. |
| open-hamburger-menu      | State modifier class when the menu drawer is open.                          |
| open-overflow-menu       | State modifier class when the overflow drawer is open.                      |
| header-hamburger-trigger | Class for the menu button (right) in mobile view                            |
| header-overflow-trigger  | Class for the overflow button (left) in mobile view.                        |
| clr-nav-level-1          | Class for the nav element within the menu (right) drawer in mobile view.    |
| clr-nav-level-2          | Class for the nav element within the overflow (left) drawer in mobile view. |

# Header Subnav - Style API

## CSS Variables

| CSS Variable Name          | Description                                                              |
| -------------------------- | ------------------------------------------------------------------------ |
| --clr-subnav-bg-color      | Changes the background color of sub navigations.                         |
| --clr-nav-background-color | Changes the background color of the overflow/menu drawer in mobile view. |

## Class names

| Class name | Description                                                         |
| ---------- | ------------------------------------------------------------------- |
| subnav     | Sub-navigation menu with a list of links.                           |
| nav        | Creates navigation with links to various routes in the application. |
| nav-item   | It creates a nav items to naviagate specific pages.                 |
