Based on the provided code and SCSS variables, here's the API documentation for the Range component:

# Range Component API

The Range component provides a range input element that allows users to select a value within a specified range.

## Usage

```html
<clr-range></clr-range>
```

## CSS Variables

| CSS Variable Name                     | Description                                   |
| ------------------------------------- | --------------------------------------------- |
| --clr-forms-range-progress-fill-color | Changes the color of the range fill progress. |
| --clr-forms-range-track-color         | Changes the color of the range track.         |
| --clr-forms-range-track-height        | Changes the height of the range track.        |
| --clr-forms-range-thumb-height        | Changes the height of the range thumb.        |
| --clr-forms-range-thumb-margin        | Changes the margin of the range thumb.        |
| --clr-forms-range-margin              | Changes the margin of the range component.    |

## Examples

### Basic Range

```html
<clr-range></clr-range>
```

## Styling

The Range component can be styled using SCSS variables.

### SCSS Variables

| Variable Name                        | Description                                     |
| ------------------------------------ | ----------------------------------------------- |
| $clr-forms-range-progress-fill-color | Overrides the color of the range fill progress. |
| $clr-forms-range-track-color         | Overrides the color of the range track.         |
| $clr-forms-range-track-height        | Overrides the height of the range track.        |
| $clr-forms-range-thumb-height        | Overrides the height of the range thumb.        |
| $clr-forms-range-thumb-margin        | Overrides the margin of the range thumb.        |
| $clr-forms-range-margin              | Overrides the margin of the range component.    |

### Examples

#### Customizing Range Fill Color

```scss
$clr-forms-range-progress-fill-color: #ff0000;
```

#### Customizing Range Track Color

```scss
$clr-forms-range-track-color: #000000;
```

#### Customizing Range Track Height

```scss
$clr-forms-range-track-height: 8px;
```

#### Customizing Range Thumb Height

```scss
$clr-forms-range-thumb-height: 12px;
```

#### Customizing Range Thumb Margin

```scss
$clr-forms-range-thumb-margin: -6px;
```

#### Customizing Range Margin

```scss
$clr-forms-range-margin: 10px;
```

# ClrRangeContainer API

The `ClrRangeContainer` component provides a container for the Range component in the Clarity Design System for Angular. It handles the layout, styling, and validation states for the range input element.

## Usage

```html
<clr-range-container>
  <input name="model" clrRange required [(ngModel)]="model" [disabled]="disabled" />
  <label>Hello World</label>
  <clr-control-helper>Helper text</clr-control-helper>
  <clr-control-error>Must be at least 5 characters</clr-control-error>
  <clr-control-success>Valid</clr-control-success>
</clr-range-container>
```

## Selector

The selector for the `ClrRangeContainer` component is `clr-range-container`.

## Inputs

| Input               | Type      | Default Value | Description                                                 |
| ------------------- | --------- | ------------- | ----------------------------------------------------------- |
| clrRangeHasProgress | `boolean` | `false`       | Determines whether the range component has a progress fill. |

## CSS Classes

The `ClrRangeContainer` component does not expose any specific CSS classes.
