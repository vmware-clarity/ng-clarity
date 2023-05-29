# Spinner Component API

The Spinner component provides a loading spinner that can be customized with different sizes and styles.

## Usage

```html
<clr-spinner></clr-spinner>
```

## CSS Variables

| CSS Variable Name              | Description                                                  |
| ------------------------------ | ------------------------------------------------------------ |
| --clr-spinner-color            | Changes the color of the spinner.                            |
| --clr-spinner-bg-color         | Changes the background color of the spinner.                 |
| --clr-spinner-inverse-bg-color | Changes the background color of the spinner in inverse mode. |
| --clr-spinner-opacity          | Changes the opacity of the spinner.                          |

## Component Properties

| Property   | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| clrInline  | Specifies whether the spinner is displayed inline.           |
| clrInverse | Specifies whether the spinner is displayed in inverse mode.  |
| clrSmall   | Specifies whether the spinner is displayed with small size.  |
| clrMedium  | Specifies whether the spinner is displayed with medium size. |

## Examples

### Basic Spinner

```html
<clr-spinner></clr-spinner>
```

### Inline Spinner

```html
<clr-spinner [clrInline]="true"></clr-spinner>
```

### Inverse Spinner

```html
<clr-spinner [clrInverse]="true"></clr-spinner>
```

### Small Spinner

```html
<clr-spinner [clrSmall]="true"></clr-spinner>
```

### Medium Spinner

```html
<clr-spinner [clrMedium]="true"></clr-spinner>
```

## Styling

The Spinner component can be styled using CSS classes.

### CSS Classes

| Class Name      | Description                                    |
| --------------- | ---------------------------------------------- |
| spinner         | Default class for all spinners.                |
| spinner-inline  | Class to display the spinner inline.           |
| spinner-inverse | Class to display the spinner in inverse mode.  |
| spinner-sm      | Class to display the spinner with small size.  |
| spinner-md      | Class to display the spinner with medium size. |
| spinner-check   | Class to display a checkmark icon spinner.     |

### Examples

#### Customizing Spinner Color

```scss
$clr-spinner-color: #ff0000;
```

#### Customizing Spinner Background Color

```scss
$clr-spinner-bg-color: #000000;
```

#### Customizing Inverse Spinner Background Color

```scss
$clr-spinner-inverse-bg-color: #ffffff;
```

#### Customizing Spinner Opacity

```scss
$clr-spinner-opacity: 0.5;
```
