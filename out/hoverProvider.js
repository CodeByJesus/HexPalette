"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoverProvider = void 0;
const vscode = require("vscode");
class HoverProvider {
    constructor(colorDetector) {
        this.colorDetector = colorDetector;
    }
    provideHover(document, position, token) {
        const range = document.getWordRangeAtPosition(position);
        if (!range) {
            return;
        }
        const text = document.getText(range);
        const fullText = document.getText();
        const colors = this.colorDetector.findColors(fullText);
        const offset = document.offsetAt(position);
        const colorMatch = colors.find(color => offset >= color.range[0] && offset <= color.range[1]);
        if (!colorMatch) {
            return;
        }
        const hoverContent = this.createHoverContent(colorMatch);
        return new vscode.Hover(hoverContent);
    }
    createHoverContent(colorMatch) {
        const content = new vscode.MarkdownString();
        content.appendMarkdown(`**Color:** \`${colorMatch.color}\`\n\n`);
        content.appendMarkdown(`<span style="display:inline-block;width:20px;height:20px;background-color:${colorMatch.color};border:1px solid #ccc;border-radius:3px;"></span>\n\n`);
        if (colorMatch.type === 'hex') {
            const rgb = this.colorDetector.hexToRgb(colorMatch.color);
            if (rgb) {
                content.appendMarkdown(`**RGB:** \`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\`\n\n`);
            }
        }
        // Color picker link
        content.appendMarkdown(`\n\n[🎨 Edit Color](command:hexlens.pickColor)`);
        content.isTrusted = true;
        return content;
    }
}
exports.HoverProvider = HoverProvider;
//# sourceMappingURL=hoverProvider.js.map