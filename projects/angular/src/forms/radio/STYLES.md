# Radio Component

The Radio component represents a radio button input element.

## Usage

```html
<clr-radio-container>
  <clr-radio-wrapper>
    <input type="radio" clrRadio />
    <label>Radio Option 1</label>
  </clr-radio-wrapper>
  <clr-radio-wrapper>
    <input type="radio" clrRadio />
    <label>Radio Option 2</label>
  </clr-radio-wrapper>
</clr-radio-container>
```

## Styling

### Variables

The Radio component supports the following SCSS variables for styling:

| Variable                                   | Default Value                                                | Description                                                                 |
| ------------------------------------------ | ------------------------------------------------------------ | --------------------------------------------------------------------------- |
| $clr-forms-radio-label-color               | $clr-forms-checkbox-label-color                              | The color of the label text for the radio component.                        |
| $clr-forms-radio-disabled-background-color | $clr-color-neutral-700                                       | The background color of the disabled radio component.                       |
| $clr-forms-radio-disabled-mark-color       | $clr-forms-checkbox-disabled-mark-color                      | The color of the mark (indicator) for the disabled radio component.         |
| $clr-forms-radio-size                      | $clr-forms-checkbox-size                                     | The size (dimension) of the radio component.                                |
| $clr-forms-radio-label-height              | $clr-forms-checkbox-label-height                             | The height of the label for the radio component.                            |
| $clr-forms-radio-height                    | $clr-forms-checkbox-height                                   | The height of the radio component.                                          |
| $clr-forms-radio-padding-left              | $clr-forms-checkbox-padding-left                             | The left padding of the radio component.                                    |
| $clr-forms-radio-top                       | $clr-forms-checkbox-top                                      | The top position of the radio component.                                    |
| $clr-forms-radio-selected-shadow           | $clr-forms-checkbox-checked-shadow                           | The shadow style for the selected (checked) state of the radio component.   |
| $clr-forms-radio-focused-shadow            | 0 0 $clr-outline-blur $clr-outline-spread $clr-outline-color | The shadow style for the focused state of the radio component.              |
| $clr-forms-radio-disabled-shadow           | inset 0 0 0 $clr_baselineRem_0_5 $clr-color-neutral-200      | The shadow style for the disabled state of the radio component.             |
| $clr-forms-radio-checked-disabled-shadow   | inset 0 0 0 $clr_baselineRem_0_25 $clr-color-neutral-200     | The shadow style for the checked and disabled state of the radio component. |

These variables are used in the radio component classes and can be customized as needed to achieve the desired styling and behavior.

### Classes

The Radio component supports the following CSS classes for styling:

| Class              | Description                                              |
| ------------------ | -------------------------------------------------------- |
| .clr-radio-wrapper | The wrapper container for the radio button and its label |
| .clr-control-label | The label element of the radio button                    |

# Radio Wrapper Component

The Radio Wrapper component provides a wrapper for the Radio component.

# Radio Container Component

The Radio Container component provides a container for multiple radio buttons.
