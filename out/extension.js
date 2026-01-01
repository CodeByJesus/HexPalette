"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const colorDetector_1 = require("./colorDetector");
const colorDecorator_1 = require("./colorDecorator");
const hoverProvider_1 = require("./hoverProvider");
const colorPicker_1 = require("./colorPicker");
function activate(context) {
    console.log('HexPalette extension is now active!');
    const colorDetector = new colorDetector_1.ColorDetector();
    const colorDecorator = new colorDecorator_1.ColorDecorator(colorDetector);
    const hoverProvider = new hoverProvider_1.HoverProvider(colorDetector);
    const colorPicker = new colorPicker_1.ColorPicker();
    const hoverDisposable = vscode.languages.registerHoverProvider(['javascript', 'typescript', 'css', 'scss', 'less', 'html', 'json'], hoverProvider);
    const toggleCommand = vscode.commands.registerCommand('hexpalette.toggleGutter', () => {
        colorDecorator.toggleGutter();
    });
    const pickColorCommand = vscode.commands.registerCommand('hexpalette.pickColor', async () => {
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
        colorDecorator.scheduleUpdateDecorations(0);
    });
    const documentChange = vscode.workspace.onDidChangeTextDocument((event) => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && event.document === activeEditor.document) {
            colorDecorator.scheduleUpdateDecorations(50);
        }
    });
    // Double-click on a color to quickly open the picker ("confirm" flow)
    let lastClickTime = 0;
    let lastRange;
    const selectionChange = vscode.window.onDidChangeTextEditorSelection(async (e) => {
        if (e.kind !== vscode.TextEditorSelectionChangeKind.Mouse) {
            return;
        }
        const editor = e.textEditor;
        if (!editor || e.selections.length !== 1)
            return;
        const sel = e.selections[0];
        if (!sel)
            return;
        const now = Date.now();
        const doc = editor.document;
        // Determine the range to check: prefer selected range on double click; fallback to word at caret
        const rangeToCheck = sel.isEmpty
            ? (doc.getWordRangeAtPosition(sel.active) || new vscode.Range(sel.active, sel.active))
            : sel;
        // detect double click: same range within 350ms
        if (lastRange && rangeToCheck.isEqual(lastRange) && (now - lastClickTime) < 350) {
            const text = doc.getText();
            const colors = colorDetector.findColors(text);
            const startOffset = doc.offsetAt(rangeToCheck.start);
            const endOffset = doc.offsetAt(rangeToCheck.end);
            // Find a color that fully spans the selected range (or includes caret)
            const colorMatch = colors.find((c) => startOffset >= c.range[0] && endOffset <= c.range[1]);
            if (colorMatch) {
                const startPos = doc.positionAt(colorMatch.range[0]);
                const endPos = doc.positionAt(colorMatch.range[1]);
                const cRange = new vscode.Range(startPos, endPos);
                const newColor = await colorPicker.showColorPicker(colorMatch.color);
                if (newColor) {
                    await colorPicker.replaceColorInDocument(doc, cRange, newColor);
                    colorDecorator.updateDecorations();
                }
            }
        }
        lastClickTime = now;
        lastRange = rangeToCheck;
    });
    context.subscriptions.push(hoverDisposable, toggleCommand, pickColorCommand, activeEditorChange, documentChange, selectionChange);
    colorDecorator.updateDecorations();
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map