"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const colorDetector_1 = require("./colorDetector");
const colorDecorator_1 = require("./colorDecorator");
const hoverProvider_1 = require("./hoverProvider");
const colorPicker_1 = require("./colorPicker");
function activate(context) {
    console.log('HexLens extension is now active!');
    const colorDetector = new colorDetector_1.ColorDetector();
    const colorDecorator = new colorDecorator_1.ColorDecorator(colorDetector);
    const hoverProvider = new hoverProvider_1.HoverProvider(colorDetector);
    const colorPicker = new colorPicker_1.ColorPicker();
    const hoverDisposable = vscode.languages.registerHoverProvider(['javascript', 'typescript', 'css', 'scss', 'less', 'html', 'json'], hoverProvider);
    const toggleCommand = vscode.commands.registerCommand('hexlens.toggleGutter', () => {
        colorDecorator.toggleGutter();
    });
    const pickColorCommand = vscode.commands.registerCommand('hexlens.pickColor', async () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showWarningMessage('No active editor found');
            return;
        }
        const position = activeEditor.selection.active;
        const document = activeEditor.document;
        const text = document.getText();
        const colors = colorDetector.findColors(text);
        const offset = document.offsetAt(position);
        const colorMatch = colors.find((color) => offset >= color.range[0] && offset <= color.range[1]);
        if (!colorMatch) {
            vscode.window.showWarningMessage('No color found at cursor position');
            return;
        }
        const startPos = document.positionAt(colorMatch.range[0]);
        const endPos = document.positionAt(colorMatch.range[1]);
        const range = new vscode.Range(startPos, endPos);
        const newColor = await colorPicker.showColorPicker(colorMatch.color);
        if (newColor) {
            await colorPicker.replaceColorInDocument(document, range, newColor);
            colorDecorator.updateDecorations();
        }
    });
    const activeEditorChange = vscode.window.onDidChangeActiveTextEditor(() => {
        colorDecorator.updateDecorations();
    });
    const documentChange = vscode.workspace.onDidChangeTextDocument((event) => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && event.document === activeEditor.document) {
            colorDecorator.updateDecorations();
        }
    });
    context.subscriptions.push(hoverDisposable, toggleCommand, pickColorCommand, activeEditorChange, documentChange);
    colorDecorator.updateDecorations();
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map