import * as vscode from 'vscode';
import { ColorDetector } from './colorDetector';
import { ColorDecorator } from './colorDecorator';
import { HoverProvider } from './hoverProvider';
import { ColorPicker } from './colorPicker';

export function activate(context: vscode.ExtensionContext) {
    console.log('HexLens extension is now active!');

    const colorDetector = new ColorDetector();
    const colorDecorator = new ColorDecorator(colorDetector);
    const hoverProvider = new HoverProvider(colorDetector);
    const colorPicker = new ColorPicker();

    // Registrar el proveedor de hover
    const hoverDisposable = vscode.languages.registerHoverProvider(
        ['javascript', 'typescript', 'css', 'scss', 'less', 'html', 'json'],
        hoverProvider
    );

    // Comando para toggle del gutter
    const toggleCommand = vscode.commands.registerCommand('hexlens.toggleGutter', () => {
        colorDecorator.toggleGutter();
    });

    // Comando para color picker
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

        // Encontrar el color bajo el cursor
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

    // Actualizar decoraciones cuando cambia el editor activo
    const activeEditorChange = vscode.window.onDidChangeActiveTextEditor(() => {
        colorDecorator.updateDecorations();
    });

    // Actualizar cuando cambia el contenido del documento
    const documentChange = vscode.workspace.onDidChangeTextDocument((event) => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && event.document === activeEditor.document) {
            colorDecorator.updateDecorations();
        }
    });

    context.subscriptions.push(
        hoverDisposable,
        toggleCommand,
        pickColorCommand,
        activeEditorChange,
        documentChange
    );

    // Inicializar decoraciones
    colorDecorator.updateDecorations();
}

export function deactivate() {}
