# Dropdown Component

The Dropdown component is used to display a list of options in a dropdown menu that can be toggled open or closed. It provides a user-friendly interface for selecting a single option from a list of choices. The `ClrDropdown` component consists of a trigger element and a dropdown menu container.

## Usage

```html
<clr-dropdown>
  <button clrDropdownTrigger class="dropdown-toggle">Toggle Dropdown</button>
  <clr-dropdown-menu>
    <button clrDropdownItem>Action 1</button>
    <button clrDropdownItem>Action 2</button>
    <button clrDropdownItem>Action 3</button>
  </clr-dropdown-menu>
</clr-dropdown>
```

## Styling

### Variables

The following variables are available for customizing the Dropdown component:

| Variable                           | Default Value | Description                                  |
| ---------------------------------- | ------------- | -------------------------------------------- |
| `$dropdown-menu-background-color`  | `#ffffff`     | Background color of the dropdown menu.       |
| `$dropdown-item-padding`           | `0.5rem 1rem` | Padding applied to the dropdown items.       |
| `$dropdown-item-hover-background`  | `#f0f0f0`     | Background color when hovering over an item. |
| `$dropdown-item-active-background` | `#f0f0f0`     | Background color of the active item.         |
| `$dropdown-item-active-color`      | `#000000`     | Text color of the active item.               |

### Classes

The Dropdown component uses the following classes for styling:

| Class                   | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `.dropdown`             | Styles the overall dropdown component.                    |
| `.dropdown-toggle`      | Styles the toggle element inside the dropdown component.  |
| `.btn`                  | Styles the button elements inside the dropdown component. |
| `.dropdown-menu`        | Styles the dropdown menu container.                       |
| `.dropdown-header`      | Styles the header element inside the dropdown menu.       |
| `.dropdown-item`        | Styles the individual items in the dropdown menu.         |
| `.dropdown-item-active` | Styles the active item in the dropdown menu.              |
| `.expandable`           | Styles the expandable dropdown item.                      |
| `.dropdown-divider`     | Styles the divider element in the dropdown menu.          |

# Dropdown Menu Component

The `ClrDropdownMenu` component is responsible for rendering the menu portion of a dropdown component. It should be placed inside a `ClrDropdown` component.

## Usage

```html
<clr-dropdown>
  <button clrDropdownTrigger>Toggle Dropdown</button>
  <clr-dropdown-menu>
    <!-- Dropdown menu content here -->
  </clr-dropdown-menu>
</clr-dropdown>
```

## Selector

The selector for the `ClrDropdownMenu` component is `clr-dropdown-menu`.

## Variables

| Variable                          | Default Value | Description                                         |
| --------------------------------- | ------------- | --------------------------------------------------- |
| `items: QueryList<FocusableItem>` |               | A list of focusable items inside the dropdown menu. |

## Host Binding

- `[class.dropdown-menu]`: Applied to the host element to style it as a dropdown menu.
- `[attr.role]`: Applied to the host element to specify the ARIA role as "menu".

## Inputs

| Input         | Type   | Description                                                                                                  |
| ------------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| `clrPosition` | string | Sets the position of the dropdown menu. Possible values: `'top-right'`, `'top-left'`, `'bottom-right'`, etc. |

## Example

```

html
<clr-dropdown>
  <button clrDropdownTrigger>Toggle Dropdown</button>
  <clr-dropdown-menu clrPosition="bottom-right">
    <button clrDropdownItem>Action 1</button>
    <button clrDropdownItem>Action 2</button>
    <button clrDropdownItem>Action 3</button>
  </clr-dropdown-menu>
</clr-dropdown>
```

## Classes

| Class            | Description                                     |
| ---------------- | ----------------------------------------------- |
| `.dropdown-menu` | Applies styling to the dropdown menu container. |

# Dropdown Item Directive

The `ClrDropdownItem` directive represents an individual item within a dropdown menu.

## Usage

```html
<button clrDropdownItem [clrDisabled]="disabled">Dropdown Item</button>
```

## Explanation

The `ClrDropdownItem` directive is used to define individual items within a dropdown menu. It should be used as a directive on the element representing the dropdown item.

## Variables

No variables available for the `ClrDropdownItem` directive.

## Classes

| Class            | Description                                      |
| ---------------- | ------------------------------------------------ |
| `.disabled`      | Applies the disabled state to the dropdown item. |
| `.dropdown-item` | Applies styling to the dropdown item element.    |
