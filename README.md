# ThreeSixtyJS — New 360° Views

[![@jbtcdDE on Twitter](http://img.shields.io/badge/twitter-%40jbtcdDE-blue.svg?style=flat)](https://twitter.com/jbtcdDE)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)

## How to use it


After installation you can create an image container in html:

```html
<div class="YOUR_IDENTIFIER" data-src="/PATH/TO/YOUR/IMAGES/{}.jpg" data-amount="48"></div>
```
Replace `YOUR_IDENTIFIER` with a custom class name to identify a ThreeSixtyJS container.

Replace `data-src` with the path to your ThreeSixtyJS images and use `{}` as placeholder for your image id`s (starts with 0).

Replace `data-amount` with the number of images your ThreeSixtyJS view contains.

```javascript
new ThreeSixtyJS('.YOUR_IDENTIFIER', OPTIONAL_SETTINGS);
```
Replace `YOUR_IDENTIFIER` with a custom class name to identify a ThreeSixtyJS container.

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.
