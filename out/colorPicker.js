"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorPicker = void 0;
const vscode = require("vscode");
class ColorPicker {
    async showColorPicker(currentColor) {
        const result = await vscode.window.showInputBox({
            prompt: 'Enter new color value',
            value: currentColor,
            validateInput: (value) => {
                if (!this.isValidColor(value)) {
                    return 'Please enter a valid color (HEX, RGB, or HSL)';
                }
                return null;
            }
        });
        return result;
    }
    isValidColor(color) {
        const patterns = [
            /^#[0-9a-fA-F]{3,8}$/,
            /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/,
            /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[0-9.]+\s*\)$/,
            /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/,
            /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[0-9.]+\s*\)$/
        ];
        return patterns.some(pattern => pattern.test(color.trim()));
    }
    replaceColorInDocument(document, range, newColor) {
        const edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, range, newColor);
        return vscode.workspace.applyEdit(edit);
    }
}
exports.ColorPicker = ColorPicker;
//# sourceMappingURL=colorPicker.js.map