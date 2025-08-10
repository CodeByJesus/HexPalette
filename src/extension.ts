import * as vscode from 'vscode';
import { ColorDetector } from './colorDetector';
import { ColorDecorator } from './colorDecorator';
import { HoverProvider } from './hoverProvider';
import { ColorPicker } from './colorPicker';

export function activate(context: vscode.ExtensionContext) {
    console.log('HexPalette extension is now active!');

    const colorDetector = new ColorDetector();
    const colorDecorator = new ColorDecorator(colorDetector);
    const hoverProvider = new HoverProvider(colorDetector);
    const colorPicker = new ColorPicker();


    const hoverDisposable = vscode.languages.registerHoverProvider(
        ['javascript', 'typescript', 'css', 'scss', 'less', 'html', 'json'],
        hoverProvider
    );


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
        const colorMatch = colors.find((color: any) => 
            offset >= color.range[0] && offset <= color.range[1]
        );

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
    let lastRange: vscode.Range | undefined;
    const selectionChange = vscode.window.onDidChangeTextEditorSelection(async (e) => {
        if (e.kind !== vscode.TextEditorSelectionChangeKind.Mouse) {
            return;
        }
        const editor = e.textEditor;
        if (!editor || e.selections.length !== 1) return;
        const sel = e.selections[0];
        if (!sel) return;

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
            const colorMatch = colors.find((c: any) => startOffset >= c.range[0] && endOffset <= c.range[1]);
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

    context.subscriptions.push(
        hoverDisposable,
        toggleCommand,
        pickColorCommand,
        activeEditorChange,
        documentChange,
        selectionChange
    );


    colorDecorator.updateDecorations();
}

export function deactivate() {}
