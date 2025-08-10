# HexPalette - Visual Studio Code Extension

⚡ **Lightning-fast inline color swatches** with integrated color picker for web developers and designers.

![HexPalette Demo](https://raw.githubusercontent.com/hexpalette-dev/hexpalette/main/demo.gif)

## ✨ Features

### 🎨 Instant Color Preview
- **Inline color swatches** appear automatically next to HEX, RGB, HSL values
- **Gutter indicators** show all colors in the file at a glance
- **Real-time updates** as you type

### 🖱️ Interactive Color Editing
- **Click to edit** any color directly from the hover popup
- **Built-in color picker** with validation
- **Zero configuration** required

### 🎯 Supported Formats
- **HEX**: `#ff6b6b`, `#fff`, `#00000000`
- **RGB**: `rgb(255, 107, 107)`, `rgba(255, 0, 0, 0.5)`
- **HSL**: `hsl(0, 100%, 50%)`, `hsla(0, 100%, 50%, 0.5)`
- **CSS Variables**: `var(--primary-color)`

## 🚀 Getting Started

1. **Install** HexPalette from the VS Code Marketplace
2. **Open** any file with colors (CSS, JS, HTML, JSON, etc.)
3. **Enjoy** instant color previews!

## 🎮 Usage

### Basic Usage
- Colors appear **automatically** when you open files
- **Hover** over any color for detailed information
- **Click** "🎨 Edit Color" to change colors instantly

### Commands
| Command | Description |
|---------|-------------|
| `HexPalette: Toggle Gutter Colors` | Show/hide gutter color indicators |
| `HexPalette: Pick Color` | Edit color at cursor position |

### Keyboard Shortcuts
- `Ctrl+Shift+P` → "HexPalette: Pick Color" to edit current color

## 🛠️ Extension Settings

HexPalette works out of the box with zero configuration. All features are enabled by default.

## 📊 Performance

- **< 200ms** activation time
- **< 10KB** extension size
- **Zero dependencies**
- **Debounced updates** for large files

## 🌟 Examples

### Before HexPalette
```css
.button {
  background: #ff6b6b;
  color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
```

### With HexPalette
```css
.button {
  background: 🔴 #ff6b6b;
  color: ⚪ #ffffff;
  border: 1px solid ⚫ rgba(0, 0, 0, 0.1);
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with ❤️ for the VS Code community.
