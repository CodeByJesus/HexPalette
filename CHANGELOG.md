# Changelog

All notable changes to this project will be documented in this file.

## [0.1.1] - 2025-08-10
### Fixed
- Gutter icons now correctly reflect the actual color per line using per-color decoration types.
- Removed redundant inline circle; kept the original square swatch only.
- Restored double-click on color to quickly open the picker and confirm.
- Reduced latency and flicker by debouncing decoration updates and reusing gutter decoration types.

### Internal
- Refactor of colorDecorator to use valid VS Code API properties and avoid unsupported renderOptions.

## [0.1.0] - 2025-08-10
### Added
- Initial HexPalette release with inline color swatches, hover with edit link, and gutter toggle.
