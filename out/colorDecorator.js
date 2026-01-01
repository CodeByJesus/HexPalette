"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorDecorator = void 0;
const vscode = require("vscode");
class ColorDecorator {
    constructor(colorDetector) {
        this.gutterTypes = new Map();
        this.gutterEnabled = false;
        this.colorDetector = colorDetector;
        // Base inline decoration kept but unused (inline disabled). If re-enabled, set sizes here.
        this.inlineDecorationType = vscode.window.createTextEditorDecorationType({});
    }
    toggleGutter() {
        this.gutterEnabled = !this.gutterEnabled;
        this.updateDecorations();
        vscode.window.showInformationMessage(`Gutter colors ${this.gutterEnabled ? 'enabled' : 'disabled'}`);
    }
    updateDecorations() {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }
        const text = activeEditor.document.getText();
        const colors = this.colorDetector.findColors(text);
        // Inline decorations disabled: do not render circle before text
        const inlineDecorations = [];
        const gutterRangesByColor = new Map();
        colors.forEach(color => {
            const startPos = activeEditor.document.positionAt(color.range[0]);
            const endPos = activeEditor.document.positionAt(color.range[1]);
            const range = new vscode.Range(startPos, endPos);
            // Inline swatch intentionally not added (user prefers only the existing square swatch)
            // Decoración gutter (si está habilitado)
            if (this.gutterEnabled) {
                const list = gutterRangesByColor.get(color.value) ?? [];
                list.push({ range });
                gutterRangesByColor.set(color.value, list);
            }
        });
        // Inline decorations disabled: skip applying
        // Reutilizar decorationTypes por color; crear solo los faltantes
        if (this.gutterEnabled) {
            const seen = new Set();
            gutterRangesByColor.forEach((ranges, color) => {
                seen.add(color);
                let type = this.gutterTypes.get(color);
                if (!type) {
                    type = vscode.window.createTextEditorDecorationType({
                        gutterIconPath: this.createGutterIcon(color),
                        gutterIconSize: 'contain'
                    });
                    this.gutterTypes.set(color, type);
                }
                activeEditor.setDecorations(type, ranges);
            });
            // Dispose types no longer used
            [...this.gutterTypes.keys()].forEach(color => {
                if (!seen.has(color)) {
                    const t = this.gutterTypes.get(color);
                    t.dispose();
                    this.gutterTypes.delete(color);
                }
            });
        }
        else {
            // Gutter apagado: limpiar decoraciones
            this.gutterTypes.forEach(type => type.dispose());
            this.gutterTypes.clear();
        }
    }
    // Debounced updater to reduce flicker after edits
    scheduleUpdateDecorations(delay = 50) {
        if (this.updateTimer) {
            clearTimeout(this.updateTimer);
        }
        this.updateTimer = setTimeout(() => this.updateDecorations(), delay);
    }
    createColorIcon(color) {
        const svg = `
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="6" fill="${color}" stroke="#ccc" stroke-width="1"/>
            </svg>
        `;
        return vscode.Uri.parse(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`);
    }
    createGutterIcon(color) {
        const svg = `
            <svg width="2" height="16" viewBox="0 0 2 16" xmlns="http://www.w3.org/2000/svg">
                <rect width="2" height="16" fill="${color}"/>
            </svg>
        `;
        return vscode.Uri.parse(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`);
    }
    dispose() {
        this.inlineDecorationType.dispose();
        this.gutterTypes.forEach(type => type.dispose());
        this.gutterTypes.clear();
    }
}
exports.ColorDecorator = ColorDecorator;
//# sourceMappingURL=colorDecorator.js.map