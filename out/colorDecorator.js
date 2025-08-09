"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorDecorator = void 0;
const vscode = require("vscode");
class ColorDecorator {
    constructor(colorDetector) {
        this.gutterEnabled = false;
        this.colorDetector = colorDetector;
        // Decoración para swatches inline (antes del texto)
        this.inlineDecorationType = vscode.window.createTextEditorDecorationType({
            before: {
                contentIconPath: this.createColorIcon('#000000'),
                margin: '0 4px 0 0'
            }
        });
        // Decoración para gutter (margen izquierdo)
        this.gutterDecorationType = vscode.window.createTextEditorDecorationType({
            gutterIconPath: this.createGutterIcon('#000000'),
            gutterIconSize: 'contain'
        });
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
        const inlineDecorations = [];
        const gutterDecorations = [];
        colors.forEach(color => {
            const startPos = activeEditor.document.positionAt(color.range[0]);
            const endPos = activeEditor.document.positionAt(color.range[1]);
            const range = new vscode.Range(startPos, endPos);
            // Decoración inline (swatch)
            const inlineDecoration = {
                range: range
            };
            inlineDecorations.push(inlineDecoration);
            // Decoración gutter (si está habilitado)
            if (this.gutterEnabled) {
                const gutterDecoration = {
                    range: range
                };
                gutterDecorations.push(gutterDecoration);
            }
        });
        activeEditor.setDecorations(this.inlineDecorationType, inlineDecorations);
        activeEditor.setDecorations(this.gutterDecorationType, gutterDecorations);
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
        this.gutterDecorationType.dispose();
    }
}
exports.ColorDecorator = ColorDecorator;
//# sourceMappingURL=colorDecorator.js.map